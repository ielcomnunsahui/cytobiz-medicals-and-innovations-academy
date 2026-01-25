import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  BookOpen,
  Award,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface CourseAnalytics {
  id: string;
  title: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  completionRate: number;
  avgProgress: number;
  totalLessons: number;
  avgTimeSpent: number;
  totalTimeSpent: number;
  assessmentPassRate: number;
}

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("30");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  // Fetch all courses
  const { data: courses } = useQuery({
    queryKey: ["admin-courses-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  // Fetch comprehensive analytics
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics", dateRange, selectedCourse],
    queryFn: async () => {
      const startDate = subDays(new Date(), parseInt(dateRange));

      // Get all enrollments with course info
      let enrollmentsQuery = supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(id, title)
        `)
        .gte("enrolled_at", startDate.toISOString());

      if (selectedCourse !== "all") {
        enrollmentsQuery = enrollmentsQuery.eq("course_id", selectedCourse);
      }

      const { data: enrollments, error: enrollmentsError } = await enrollmentsQuery;
      if (enrollmentsError) throw enrollmentsError;

      // Get lesson progress with time spent
      const { data: lessonProgress, error: progressError } = await supabase
        .from("lesson_progress")
        .select("*, lesson:lessons(module:modules(course_id))");
      if (progressError) throw progressError;

      // Get all modules with lessons count
      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select("course_id, lessons(id)");
      if (modulesError) throw modulesError;

      // Get assessment attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from("assessment_attempts")
        .select("*, assessment:assessments(module:modules(course_id))");
      if (attemptsError) throw attemptsError;

      // Process analytics per course
      const courseMap = new Map<string, CourseAnalytics>();

      // Initialize course data
      for (const enrollment of enrollments || []) {
        const courseId = enrollment.course_id;
        if (!courseMap.has(courseId)) {
          const courseLessons = modules
            ?.filter((m) => m.course_id === courseId)
            .reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;

          courseMap.set(courseId, {
            id: courseId,
            title: (enrollment.course as any)?.title || "Unknown Course",
            totalEnrollments: 0,
            activeEnrollments: 0,
            completedEnrollments: 0,
            completionRate: 0,
            avgProgress: 0,
            totalLessons: courseLessons,
            avgTimeSpent: 0,
            totalTimeSpent: 0,
            assessmentPassRate: 0,
          });
        }

        const course = courseMap.get(courseId)!;
        course.totalEnrollments++;

        if (enrollment.status === "confirmed") {
          course.activeEnrollments++;
        }
        if (enrollment.completed_at) {
          course.completedEnrollments++;
        }
        course.avgProgress += enrollment.progress_percentage || 0;
      }

      // Calculate time spent per course
      for (const progress of lessonProgress || []) {
        const courseId = (progress.lesson as any)?.module?.course_id;
        if (courseId && courseMap.has(courseId)) {
          const course = courseMap.get(courseId)!;
          course.totalTimeSpent += (progress as any).time_spent_seconds || 0;
        }
      }

      // Calculate assessment pass rates
      const courseAttempts = new Map<string, { passed: number; total: number }>();
      for (const attempt of attempts || []) {
        const courseId = (attempt.assessment as any)?.module?.course_id;
        if (courseId) {
          if (!courseAttempts.has(courseId)) {
            courseAttempts.set(courseId, { passed: 0, total: 0 });
          }
          const stats = courseAttempts.get(courseId)!;
          stats.total++;
          if (attempt.passed) {
            stats.passed++;
          }
        }
      }

      for (const [courseId, stats] of courseAttempts) {
        if (courseMap.has(courseId)) {
          const course = courseMap.get(courseId)!;
          course.assessmentPassRate = stats.total > 0 ? (stats.passed / stats.total) * 100 : 0;
        }
      }

      // Finalize averages
      for (const course of courseMap.values()) {
        if (course.totalEnrollments > 0) {
          course.avgProgress = course.avgProgress / course.totalEnrollments;
          course.completionRate = (course.completedEnrollments / course.totalEnrollments) * 100;
          course.avgTimeSpent = course.totalTimeSpent / course.totalEnrollments;
        }
      }

      // Calculate totals
      const coursesArray = Array.from(courseMap.values());
      const totals = {
        totalStudents: new Set(enrollments?.map((e) => e.user_id)).size,
        totalEnrollments: enrollments?.length || 0,
        activeEnrollments: enrollments?.filter((e) => e.status === "confirmed").length || 0,
        completedEnrollments: enrollments?.filter((e) => e.completed_at).length || 0,
        avgCompletionRate:
          coursesArray.length > 0
            ? coursesArray.reduce((sum, c) => sum + c.completionRate, 0) / coursesArray.length
            : 0,
        avgProgress:
          coursesArray.length > 0
            ? coursesArray.reduce((sum, c) => sum + c.avgProgress, 0) / coursesArray.length
            : 0,
        totalTimeSpent: coursesArray.reduce((sum, c) => sum + c.totalTimeSpent, 0),
        avgAssessmentPassRate:
          coursesArray.filter((c) => c.assessmentPassRate > 0).length > 0
            ? coursesArray
                .filter((c) => c.assessmentPassRate > 0)
                .reduce((sum, c) => sum + c.assessmentPassRate, 0) /
              coursesArray.filter((c) => c.assessmentPassRate > 0).length
            : 0,
      };

      return {
        courses: coursesArray.sort((a, b) => b.totalEnrollments - a.totalEnrollments),
        totals,
      };
    },
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Progress Analytics</h1>
            <p className="text-muted-foreground">
              Track completion rates, engagement, and learning metrics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border">
                <SelectItem value="all">All Courses</SelectItem>
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border">
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Students</span>
            </div>
            <div className="text-3xl font-bold">{analytics?.totals.totalStudents || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {analytics?.totals.activeEnrollments || 0} active enrollments
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Completion Rate</span>
            </div>
            <div className="text-3xl font-bold">
              {(analytics?.totals.avgCompletionRate || 0).toFixed(1)}%
            </div>
            <Progress value={analytics?.totals.avgCompletionRate || 0} className="h-2 mt-2" />
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm text-muted-foreground">Total Time Spent</span>
            </div>
            <div className="text-3xl font-bold">
              {formatTime(analytics?.totals.totalTimeSpent || 0)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Across all students</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm text-muted-foreground">Assessment Pass Rate</span>
            </div>
            <div className="text-3xl font-bold">
              {(analytics?.totals.avgAssessmentPassRate || 0).toFixed(1)}%
            </div>
            <Progress value={analytics?.totals.avgAssessmentPassRate || 0} className="h-2 mt-2" />
          </div>
        </div>

        {/* Average Progress */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Average Course Progress</h2>
            <span className="text-2xl font-bold text-primary">
              {(analytics?.totals.avgProgress || 0).toFixed(1)}%
            </span>
          </div>
          <Progress value={analytics?.totals.avgProgress || 0} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Per-Course Analytics */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Course Performance</h2>
            <p className="text-sm text-muted-foreground">
              Detailed metrics for each course
            </p>
          </div>

          {analytics?.courses?.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No course data available for the selected period.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {analytics?.courses?.map((course) => (
                <div key={course.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{course.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.totalEnrollments} enrolled
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.totalLessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(course.avgTimeSpent)} avg
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/courses/${course.id}/lessons`)}
                    >
                      View Course
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">Completion Rate</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {course.completionRate.toFixed(1)}%
                        </span>
                        <Badge
                          variant={course.completionRate >= 50 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {course.completedEnrollments}/{course.totalEnrollments}
                        </Badge>
                      </div>
                      <Progress value={course.completionRate} className="h-1.5 mt-2" />
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">Avg Progress</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {course.avgProgress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={course.avgProgress} className="h-1.5 mt-2" />
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">Assessment Pass Rate</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {course.assessmentPassRate > 0
                            ? `${course.assessmentPassRate.toFixed(1)}%`
                            : "N/A"}
                        </span>
                      </div>
                      {course.assessmentPassRate > 0 && (
                        <Progress value={course.assessmentPassRate} className="h-1.5 mt-2" />
                      )}
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">Active Students</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{course.activeEnrollments}</span>
                        <span className="text-sm text-muted-foreground">
                          / {course.totalEnrollments}
                        </span>
                      </div>
                      <Progress
                        value={(course.activeEnrollments / course.totalEnrollments) * 100}
                        className="h-1.5 mt-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
