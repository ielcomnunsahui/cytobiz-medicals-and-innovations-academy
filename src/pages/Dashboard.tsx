import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  Play,
  CheckCircle,
  Download,
  Eye,
  X,
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
import { generateCertificatePNG, generateCertificateJPEG, generateCertificatePDF, generateCertificatePreviewURL } from "@/lib/generateCertificate";
import logoFull from "@/assets/logo-full.png";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrolledCourses(user?.id);

  // Fetch user profile for display name
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch certificates with course info
  const { data: certificates, isLoading: certificatesLoading } = useQuery({
    queryKey: ["user-certificates", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("certificates")
        .select("*, course:courses(title, course_type)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch real lesson progress
  const { data: lessonProgress } = useQuery({
    queryKey: ["lesson-progress-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return { completedLessons: 0, totalTimeSeconds: 0 };
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("completed, time_spent_seconds")
        .eq("user_id", user.id);
      if (error) throw error;
      const completedLessons = data?.filter(l => l.completed).length || 0;
      const totalTimeSeconds = data?.reduce((sum, l) => sum + (l.time_spent_seconds || 0), 0) || 0;
      return { completedLessons, totalTimeSeconds };
    },
    enabled: !!user?.id,
  });

  // Fetch upcoming cohort sessions
  const { data: upcomingSessions } = useQuery({
    queryKey: ["upcoming-sessions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data: cohortEnrollments } = await supabase
        .from("enrollments")
        .select("cohort:cohorts(*, course:courses(title))")
        .eq("user_id", user.id)
        .not("cohort_id", "is", null);
      return cohortEnrollments?.map(e => ({
        title: `Live Session`,
        course: e.cohort?.course?.title || "Course",
        date: e.cohort?.start_date,
      })).slice(0, 3) || [];
    },
    enabled: !!user?.id,
  });

  // Certificate preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const handlePreviewCert = useCallback(async (cert: any) => {
    setPreviewLoading(true);
    try {
      const url = await generateCertificatePreviewURL({
        recipientName: profile?.display_name || user?.email?.split("@")[0] || "Learner",
        courseTitle: cert.course?.title || "Course",
        courseType: cert.course?.course_type || "self_paced",
        verificationCode: cert.verification_code,
        issuedDate: new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        logoUrl: logoFull,
      });
      setPreviewUrl(url);
    } finally {
      setPreviewLoading(false);
    }
  }, [profile, user]);

  const handleDownloadCert = useCallback(async (cert: any) => {
    await generateCertificatePNG({
      recipientName: profile?.display_name || user?.email?.split("@")[0] || "Learner",
      courseTitle: cert.course?.title || "Course",
      courseType: cert.course?.course_type || "self_paced",
      verificationCode: cert.verification_code,
      issuedDate: new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      logoUrl: logoFull,
    });
  }, [profile, user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isLoading = enrollmentsLoading || certificatesLoading;
  const hoursLearned = lessonProgress ? Math.round(lessonProgress.totalTimeSeconds / 3600) : 0;
  const displayName = profile?.display_name || user?.email?.split("@")[0] || "";

  // Calculate real average progress
  const avgProgress = enrollments && enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrollments.length)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container-wide">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back{displayName ? `, ${displayName}` : ""}!
            </h1>
            <p className="text-muted-foreground">
              Continue your learning journey where you left off.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Continue Learning */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Continue Learning
                  </h2>
                  <Link
                    to="/courses"
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Browse more courses
                  </Link>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-card border border-border rounded-2xl p-5">
                        <div className="flex gap-4">
                          <Skeleton className="w-48 h-32 rounded-lg" />
                          <div className="flex-1 space-y-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-48 h-32 sm:h-auto relative flex-shrink-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60">
                            {enrollment.course?.thumbnail_url ? (
                              <img
                                src={enrollment.course.thumbnail_url}
                                alt={enrollment.course.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-white/50" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="capitalize">
                                    {enrollment.course?.course_type?.replace("_", "-") || "course"}
                                  </Badge>
                                  {(enrollment.progress_percentage || 0) === 100 && (
                                    <Badge className="bg-success/15 text-success border-success/30 text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Completed
                                    </Badge>
                                  )}
                                  {certificates?.some(c => c.course_id === enrollment.course_id) && (
                                    <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                                      <Award className="w-3 h-3 mr-1" />
                                      Certified
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-semibold text-card-foreground">
                                  {enrollment.course?.title || "Course"}
                                </h3>
                              </div>
                              {enrollment.cohort && (
                                <span className="text-sm text-muted-foreground">
                                  Ends: {new Date(enrollment.cohort.end_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                              {(enrollment.progress_percentage || 0) === 100 ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-success" />
                                  <span className="text-success font-medium">Course completed</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  Continue learning
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-4">
                              <Progress value={enrollment.progress_percentage || 0} className="flex-1 h-2" />
                              <span className="text-sm font-medium text-muted-foreground">
                                {enrollment.progress_percentage || 0}%
                              </span>
                            </div>

                            <Button
                              size="sm"
                              className="mt-4"
                              asChild
                            >
                              <Link to={`/learn/${enrollment.course_id}`}>
                                {(enrollment.progress_percentage || 0) === 100 ? "Review" : "Continue"}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-8 text-center">
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
              </section>

              {/* Certificates with Preview & Download */}
              {certificates && certificates.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Your Certificates
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="bg-card border border-border rounded-2xl p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Award className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-card-foreground">
                              {cert.course?.title || "Course Certificate"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Issued on {new Date(cert.issued_at).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              {cert.verification_code}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handlePreviewCert(cert)}
                            disabled={previewLoading}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleDownloadCert(cert)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            PNG
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              const certParams = {
                                recipientName: profile?.display_name || user?.email?.split("@")[0] || "Learner",
                                courseTitle: cert.course?.title || "Course",
                                courseType: (cert.course?.course_type || "self_paced") as "cohort" | "self_paced",
                                verificationCode: cert.verification_code,
                                issuedDate: new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                                logoUrl: logoFull,
                              };
                              generateCertificatePDF(certParams);
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-card-foreground mb-4">
                  Your Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{enrollments?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Active Courses</p>
                    </div>
                  </div>
                  {enrollments && enrollments.length > 0 && (
                    <div className="px-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Avg. Progress</span>
                        <span className="font-medium text-foreground">{avgProgress}%</span>
                      </div>
                      <Progress value={avgProgress} className="h-2" />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{certificates?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Certificates Earned</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {hoursLearned > 0 ? hoursLearned : enrollments?.reduce((t, e) => t + (e.course?.duration_hours || 0), 0) || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {hoursLearned > 0 ? "Hours Spent Learning" : "Course Hours"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{lessonProgress?.completedLessons || 0}</p>
                      <p className="text-sm text-muted-foreground">Lessons Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Sessions */}
              {upcomingSessions && upcomingSessions.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold text-card-foreground mb-4">
                    Upcoming Sessions
                  </h3>
                  <div className="space-y-4">
                    {upcomingSessions.map((session, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <p className="font-medium text-card-foreground">
                          {session.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.course}
                        </p>
                        <p className="text-sm text-primary mt-1">
                          {session.date ? new Date(session.date).toLocaleDateString() : "TBA"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse Courses CTA */}
              <div className="bg-hero-gradient rounded-2xl p-6 text-primary-foreground">
                <h3 className="font-semibold mb-2">Explore More Courses</h3>
                <p className="text-sm text-primary-foreground/80 mb-4">
                  Discover new skills and advance your healthcare career.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full"
                >
                  <Link to="/courses">Browse Catalog</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Certificate Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-12 right-0 text-white hover:text-white/80"
              onClick={() => setPreviewUrl(null)}
            >
              <X className="w-5 h-5 mr-1" /> Close
            </Button>
            <img
              src={previewUrl}
              alt="Certificate Preview"
              className="w-full rounded-xl shadow-2xl border-2 border-border"
            />
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
