import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  Play,
  CheckCircle,
  TrendingUp,
  Target,
  BarChart3,
  Calendar,
  Trophy,
  Star,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useEnrolledCourses } from "@/hooks/useCourses";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export default function ProgressPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Fetch enrolled courses
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrolledCourses(user?.id);

  // Fetch certificates
  const { data: certificates, isLoading: certificatesLoading } = useQuery({
    queryKey: ["user-certificates", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("certificates")
        .select("*, course:courses(title)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch lesson progress
  const { data: lessonProgress } = useQuery({
    queryKey: ["lesson-progress", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*, lesson:lessons(title, module:modules(title, course:courses(title)))")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch assignment submissions
  const { data: submissions } = useQuery({
    queryKey: ["user-submissions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("submissions")
        .select("*, assignment:assignments(title, max_points, lesson:lessons(title))")
        .eq("learner_id", user.id)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isLoading = enrollmentsLoading || certificatesLoading;
  const completedLessons = lessonProgress?.filter((lp) => lp.completed)?.length || 0;
  const totalLessons = lessonProgress?.length || 0;
  const gradedSubmissions = submissions?.filter((s) => s.grade !== null) || [];
  const averageGrade = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((acc, s) => acc + ((s.grade || 0) / (s.assignment?.max_points || 100)) * 100, 0) / gradedSubmissions.length)
    : 0;

  // Calculate streak (simplified - just counting recent active days)
  const activeDays = new Set(lessonProgress?.filter(lp => lp.completed_at).map(lp => 
    new Date(lp.completed_at!).toDateString()
  )).size;

  const stats = [
    { 
      label: "Courses Enrolled", 
      value: enrollments?.length || 0, 
      icon: BookOpen, 
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      label: "Lessons Completed", 
      value: completedLessons, 
      icon: CheckCircle, 
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30"
    },
    { 
      label: "Certificates Earned", 
      value: certificates?.length || 0, 
      icon: Award, 
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30"
    },
    { 
      label: "Active Days", 
      value: activeDays, 
      icon: Flame, 
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-100 dark:bg-rose-900/30"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Learning Progress
                </h1>
                <p className="text-muted-foreground">
                  Track your learning journey and achievements
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-card dark:bg-card/80 border border-border rounded-2xl p-6"
              >
                <div className={cn("w-12 h-12 rounded-xl mb-4 flex items-center justify-center", stat.bgColor)}>
                  <stat.icon className={cn("w-6 h-6", `text-${stat.color.split('-')[1]}-600 dark:text-${stat.color.split('-')[1]}-400`)} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Progress */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Course Progress
                  </h2>
                  <Link
                    to="/dashboard"
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                  >
                    View Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-card dark:bg-card/80 border border-border rounded-2xl p-6">
                        <div className="flex gap-4">
                          <Skeleton className="w-16 h-16 rounded-xl" />
                          <div className="flex-1 space-y-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-2 w-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : enrollments && enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.map((enrollment, index) => (
                      <motion.div
                        key={enrollment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card dark:bg-card/80 border border-border rounded-2xl p-6 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 flex items-center justify-center shrink-0">
                            {enrollment.course?.thumbnail_url ? (
                              <img
                                src={enrollment.course.thumbnail_url}
                                alt={enrollment.course.title}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <BookOpen className="w-8 h-8 text-primary" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <Badge variant="outline" className="mb-2 capitalize text-xs">
                                  {enrollment.course?.course_type?.replace("_", "-") || "course"}
                                </Badge>
                                <h3 className="font-semibold text-foreground line-clamp-1">
                                  {enrollment.course?.title || "Course"}
                                </h3>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-2xl font-bold text-primary">
                                  {enrollment.progress_percentage || 0}%
                                </div>
                                <div className="text-xs text-muted-foreground">Complete</div>
                              </div>
                            </div>

                            <Progress value={enrollment.progress_percentage || 0} className="h-2 mb-4" />

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {enrollment.course?.duration_weeks || 0} weeks
                                </span>
                                {enrollment.cohort && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Ends {new Date(enrollment.cohort.end_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <Button size="sm" asChild>
                                <Link to={`/learn/${enrollment.course_id}`}>
                                  <Play className="w-4 h-4 mr-1" />
                                  Continue
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card dark:bg-card/80 border border-border rounded-2xl p-8 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your learning journey by enrolling in a course.
                    </p>
                    <Button asChild>
                      <Link to="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </motion.section>

              {/* Recent Submissions */}
              {submissions && submissions.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Recent Submissions
                  </h2>

                  <div className="bg-card dark:bg-card/80 border border-border rounded-2xl overflow-hidden">
                    <div className="divide-y divide-border">
                      {submissions.slice(0, 5).map((submission, index) => (
                        <motion.div
                          key={submission.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-foreground">
                                {submission.assignment?.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {submission.assignment?.lesson?.title}
                              </p>
                            </div>
                            <div className="text-right">
                              {submission.grade !== null ? (
                                <div className="flex items-center gap-2">
                                  <div className="text-lg font-bold text-foreground">
                                    {submission.grade}/{submission.assignment?.max_points || 100}
                                  </div>
                                  <Badge variant={submission.grade >= (submission.assignment?.max_points || 100) * 0.7 ? "default" : "secondary"}>
                                    {Math.round((submission.grade / (submission.assignment?.max_points || 100)) * 100)}%
                                  </Badge>
                                </div>
                              ) : (
                                <Badge variant="outline">Pending Review</Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Average Grade */}
              {gradedSubmissions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-8 h-8" />
                    <div>
                      <div className="text-3xl font-bold">{averageGrade}%</div>
                      <div className="text-sm text-white/80">Average Grade</div>
                    </div>
                  </div>
                  <div className="text-sm text-white/70">
                    Based on {gradedSubmissions.length} graded assignment{gradedSubmissions.length !== 1 ? "s" : ""}
                  </div>
                </motion.div>
              )}

              {/* Certificates */}
              {certificates && certificates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card dark:bg-card/80 border border-border rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Certificates
                  </h3>

                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl"
                      >
                        <h4 className="font-medium text-foreground mb-1 line-clamp-1">
                          {cert.course?.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          Issued {new Date(cert.issued_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Recent Activity */}
              {lessonProgress && lessonProgress.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card dark:bg-card/80 border border-border rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Activity
                  </h3>

                  <div className="space-y-3">
                    {lessonProgress.slice(0, 5).map((lp, index) => (
                      <div
                        key={lp.id}
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                        <div>
                          <p className="text-foreground line-clamp-1">
                            {lp.lesson?.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lp.completed_at
                              ? new Date(lp.completed_at).toLocaleDateString()
                              : "In progress"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-muted/50 dark:bg-muted/30 rounded-2xl p-6 border border-border"
              >
                <Star className="w-8 h-8 text-amber-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Keep Learning!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Consistency is key. Set aside time each day to continue your courses.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/courses">Explore More Courses</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
