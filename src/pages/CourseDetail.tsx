import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Calendar,
  Award,
  Play,
  FileText,
  CheckCircle,
  ArrowRight,
  Heart,
  BookOpen,
  ChevronDown,
  ArrowLeft,
  Loader2,
  Star,
  MessageSquare,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import { useCourseWithDetails, useEnrolledCourses, useCourses } from "@/hooks/useCourses";
import { useCourseAverageRating } from "@/hooks/useCourseReviews";
import { CourseReviewForm } from "@/components/courses/CourseReviewForm";
import { CourseReviewsList } from "@/components/courses/CourseReviewsList";
import { SocialShareButtons } from "@/components/courses/SocialShareButtons";
import { CertificatePreview } from "@/components/courses/CertificatePreview";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<string>("");
  const { user } = useAuth();

  const { data: course, isLoading, error } = useCourseWithDetails(slug || "");
  const { data: ratingData } = useCourseAverageRating(course?.id || "");
  const { data: enrolledCourses } = useEnrolledCourses(user?.id);
  
  // Fetch all published courses for next/prev navigation
  const { data: allCourses } = useCourses({ status: "published" });
  
  const currentIndex = allCourses?.findIndex((c) => c.slug === slug) ?? -1;
  const nextCourse = currentIndex >= 0 && allCourses ? allCourses[(currentIndex + 1) % allCourses.length] : null;
  
  const isEnrolled = enrolledCourses?.some((e: any) => e.course_id === course?.id) || false;

  // Enrollment deadline countdown
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  useEffect(() => {
    const deadline = (course as any)?.enrollment_deadline;
    if (!deadline) return;

    const update = () => {
      const now = new Date().getTime();
      const end = new Date(deadline).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setDeadlinePassed(true);
        setCountdown(null);
        return;
      }

      setDeadlinePassed(false);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [(course as any)?.enrollment_deadline]);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "reading":
        return <FileText className="w-4 h-4" />;
      case "quiz":
        return <CheckCircle className="w-4 h-4" />;
      case "project":
        return <Award className="w-4 h-4" />;
      case "live":
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleEnroll = () => {
    if (course?.course_type === "cohort" && !selectedCohort) {
      return;
    }
    setEnrollOpen(false);
    const cohortParam = selectedCohort ? `?cohort=${selectedCohort}` : "";
    navigate(`/enroll/${slug}${cohortParam}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24">
          <div className="bg-hero-gradient py-16">
            <div className="container-wide">
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <div className="flex gap-4 pt-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
                <div className="lg:sticky lg:top-24">
                  <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container-wide text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/courses">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalLessons = course.modules?.reduce(
    (acc: number, mod: any) => acc + (mod.lessons?.length || 0),
    0
  ) || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={course.title}
        description={course.short_description || course.description || `Enroll in ${course.title} - Expert-led course at Cytobiz Medical Academy`}
        url={`/courses/${slug}`}
        type="course"
        image={course.thumbnail_url || undefined}
        keywords={[
          course.category || "",
          course.level || "",
          course.course_type,
          "medical course",
          "healthcare education",
        ].filter(Boolean)}
        publishedTime={course.created_at}
        modifiedTime={course.updated_at}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-[hsl(252,50%,8%)] via-[hsl(252,60%,15%)] to-[hsl(252,80%,25%)] dark:from-[hsl(252,50%,6%)] dark:via-[hsl(252,60%,12%)] dark:to-[hsl(252,80%,20%)] overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/20 dark:bg-primary/15 blur-[120px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to courses
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                {course.category && (
                  <Badge className="bg-white/20 text-white border-0">
                    {course.category}
                  </Badge>
                )}
                <Badge
                  className={cn(
                    "border-0 capitalize",
                    course.course_type === "cohort"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gold/90 text-foreground"
                  )}
                >
                  {course.course_type === "cohort" ? "Cohort Program" : "Self-Paced"}
                </Badge>
                {course.level && (
                  <Badge variant="outline" className="border-white/30 text-white capitalize">
                    {course.level}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-white/80 mb-6">
                {course.short_description || course.description}
              </p>

              {/* Rating & Meta Info */}
              <div className="flex flex-wrap gap-6 mb-8 text-white/80">
                {ratingData && ratingData.count > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(ratingData.average)
                              ? "text-gold fill-gold"
                              : "text-white/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{ratingData.average}</span>
                    <span className="text-white/60">({ratingData.count} reviews)</span>
                  </div>
                )}
                {course.duration_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {course.duration_hours} hours
                  </div>
                )}
                {course.effort_hours_per_week && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {course.effort_hours_per_week} hrs/week
                  </div>
                )}
                {course.course_type === "cohort" && course.cohorts?.[0] && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Next: {format(new Date(course.cohorts[0].start_date), "MMM d, yyyy")}
                  </div>
                )}
              </div>

              {/* Enrollment Deadline Countdown */}
              {countdown && !deadlinePassed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Timer className="w-5 h-5 text-gold" />
                    <span className="font-semibold text-gold text-sm uppercase tracking-wider">Enrollment Closes In</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                      { value: countdown.days, label: "Days" },
                      { value: countdown.hours, label: "Hours" },
                      { value: countdown.minutes, label: "Mins" },
                      { value: countdown.seconds, label: "Secs" },
                    ].map(({ value, label }) => (
                      <div key={label} className="bg-white/10 rounded-lg p-2">
                        <div className="text-2xl font-bold text-white">{String(value).padStart(2, "0")}</div>
                        <div className="text-xs text-white/60">{label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {deadlinePassed && (
                <div className="bg-destructive/20 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
                  <Timer className="w-5 h-5 text-destructive" />
                  <span className="font-semibold text-white">Enrollment for this course has closed</span>
                </div>
              )}

              {/* Mobile CTA */}
              <div className="lg:hidden">
                {isEnrolled ? (
                  <Button
                    size="lg"
                    className="w-full bg-white text-foreground hover:bg-white/90 h-14"
                    onClick={() => navigate(`/learn/${course.id}`)}
                  >
                    Continue Learning
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full bg-white text-foreground hover:bg-white/90 h-14"
                    onClick={() => setEnrollOpen(true)}
                  >
                    Enroll Now - {course.discounted_price !== null ? `₦${course.discounted_price.toLocaleString()}` : course.original_price ? `₦${course.original_price.toLocaleString()}` : course.price ? `₦${course.price.toLocaleString()}` : "Free"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block lg:sticky lg:top-24"
            >
              <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
                <div className="relative h-48 bg-gradient-to-br from-primary via-primary/80 to-primary/60">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary ml-1" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-6">
                    {course.discounted_price !== null ? (
                      <>
                        <span className="text-2xl text-muted-foreground line-through">
                          ₦{(course.original_price || course.price || 0).toLocaleString()}
                        </span>
                        <span className="text-4xl font-bold text-primary">
                          ₦{course.discounted_price.toLocaleString()}
                        </span>
                      </>
                    ) : course.original_price || course.price ? (
                      <span className="text-4xl font-bold text-card-foreground">
                        ₦{(course.original_price || course.price || 0).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-4xl font-bold text-card-foreground">Free</span>
                    )}
                  </div>
                  {(course.discounted_price !== null || course.original_price || course.price) && (
                    <span className="text-muted-foreground">one-time payment</span>
                  )}

                  {/* Countdown in sidebar */}
                  {countdown && !deadlinePassed && (
                    <div className="mb-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Timer className="w-4 h-4 text-destructive" />
                        <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Enrollment Closes In</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { value: countdown.days, label: "D" },
                          { value: countdown.hours, label: "H" },
                          { value: countdown.minutes, label: "M" },
                          { value: countdown.seconds, label: "S" },
                        ].map(({ value, label }) => (
                          <div key={label} className="bg-destructive/10 rounded p-1.5">
                            <div className="text-lg font-bold text-foreground">{String(value).padStart(2, "0")}</div>
                            <div className="text-[10px] text-muted-foreground">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {deadlinePassed && !isEnrolled && (
                    <div className="mb-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">
                      <p className="text-sm font-semibold text-destructive">Enrollment Closed</p>
                    </div>
                  )}

                  {isEnrolled ? (
                    <Button
                      size="lg"
                      className="w-full bg-success hover:bg-success/90 mb-3 h-14 text-lg"
                      onClick={() => navigate(`/learn/${course.id}`)}
                    >
                      Continue Learning
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 mb-3 h-14 text-lg"
                      onClick={() => setEnrollOpen(true)}
                      disabled={deadlinePassed}
                    >
                      {deadlinePassed ? "Enrollment Closed" : "Enroll Now"}
                      {!deadlinePassed && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 ${
                          isSaved ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      Save
                    </Button>
                    <SocialShareButtons
                      title={course.title}
                      description={course.short_description || course.description}
                    />
                  </div>

                  <div className="mt-6 space-y-3 text-sm">
                    {course.duration_hours && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {course.duration_hours} hours of content
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Certificate of completion
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Lifetime access to materials
                    </div>
                    {course.course_type === "cohort" && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success" />
                        Live sessions with facilitators
                      </div>
                    )}
                  </div>

                  {/* Accreditation Badges */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Accredited By</p>
                    <div className="flex gap-3">
                      <Link
                        to="/partners"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Award className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">WAHBS</span>
                      </Link>
                      <Link
                        to="/partners"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                          <Award className="w-3 h-3 text-gold" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">SDCC</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enrollment Dialog */}
      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll in {course.title}</DialogTitle>
            <DialogDescription>
              {course.course_type === "cohort"
                ? "Select a cohort to join, then complete registration."
                : "Complete a short registration form to start learning."}
            </DialogDescription>
          </DialogHeader>

          {course.course_type === "cohort" && course.cohorts && course.cohorts.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Select a Cohort</label>
              <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your preferred cohort" />
                </SelectTrigger>
                <SelectContent>
                  {course.cohorts.map((cohort: any) => (
                    <SelectItem key={cohort.id} value={cohort.id}>
                      {cohort.title} - Starts {format(new Date(cohort.start_date), "MMM d, yyyy")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!user && (
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              Please log in or create an account to continue.
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {!user ? (
              <>
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/signup">Create account</Link>
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={course.course_type === "cohort" && !selectedCohort}
                className="w-full"
              >
                Continue to Registration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* About */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  About This Course
                </h2>
                <div className="prose prose-lg dark:prose-invert text-muted-foreground max-w-none">
                  {course.description?.split("\n\n").map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>

              {/* Learning Outcomes */}
              {course.learning_outcomes && course.learning_outcomes.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    What You'll Learn
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.learning_outcomes.map((outcome: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3 p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{outcome}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certificate Preview */}
              <CertificatePreview 
                courseType={course.course_type} 
                courseTitle={course.title} 
              />

              {/* Curriculum */}
              {course.modules && course.modules.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Curriculum
                  </h2>
                  <div className="text-sm text-muted-foreground mb-4">
                    {course.modules.length} modules • {totalLessons} lessons
                  </div>
                  <Accordion type="single" collapsible className="space-y-3">
                    {course.modules.map((module: any, index: number) => (
                      <AccordionItem
                        key={module.id}
                        value={module.id}
                        className="border border-border rounded-xl overflow-hidden bg-card"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4 text-left">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium text-foreground">{module.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {module.lessons?.length || 0} lessons
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-6 pb-4 space-y-2">
                            {module.lessons?.map((lesson: any) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                              >
                                <div className="flex items-center gap-3">
                                  {getLessonIcon("video")}
                                  <span className="text-sm text-foreground">{lesson.title}</span>
                                </div>
                                {lesson.duration_minutes && (
                                  <span className="text-xs text-muted-foreground">
                                    {lesson.duration_minutes} min
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Prerequisites
                  </h2>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prereq: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <ChevronDown className="w-5 h-5 text-primary flex-shrink-0 rotate-[-90deg]" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Target Audience */}
              {course.target_audience && course.target_audience.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Who Should Take This Course
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.target_audience.map((audience: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border"
                      >
                        <Users className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground text-sm">{audience}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQs */}
              {course.faqs && course.faqs.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Frequently Asked Questions
                  </h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {course.faqs.map((faq: any) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border border-border rounded-xl overflow-hidden bg-card"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/50">
                          <span className="font-medium text-foreground">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}

              {/* Reviews Section */}
              <section id="reviews">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Student Reviews
                  </h2>
                </div>
                
                {/* Review Form - Show only for enrolled users */}
                {isEnrolled && (
                  <div className="mb-8">
                    <CourseReviewForm courseId={course.id} isEnrolled={isEnrolled} />
                  </div>
                )}
                
                {/* Reviews List */}
                <CourseReviewsList courseId={course.id} />
              </section>
            </div>

            {/* Right Sidebar - Visible only on desktop, shows cohort info for cohort courses */}
            <div className="hidden lg:block space-y-6">
              {course.course_type === "cohort" && course.cohorts && course.cohorts.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Upcoming Cohorts</h3>
                  <div className="space-y-3">
                    {course.cohorts.map((cohort: any) => (
                      <div
                        key={cohort.id}
                        className="p-4 rounded-lg bg-muted/50 border border-border"
                      >
                        <p className="font-medium text-foreground mb-1">{cohort.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(cohort.start_date), "MMM d")} -{" "}
                          {format(new Date(cohort.end_date), "MMM d, yyyy")}
                        </div>
                        {cohort.max_students && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Users className="w-4 h-4" />
                            Max {cohort.max_students} students
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Next Course Navigation */}
      {nextCourse && (
        <section className="border-t border-border bg-muted/30">
          <div className="container-wide py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Next Course</p>
                <p className="font-semibold text-foreground">{nextCourse.title}</p>
              </div>
              <Button asChild variant="outline" size="lg">
                <Link to={`/courses/${nextCourse.slug}`}>
                  View Course
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Mobile Fixed CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 h-12"
          onClick={() => setEnrollOpen(true)}
        >
          Enroll Now - {course.discounted_price !== null ? `₦${course.discounted_price.toLocaleString()}` : course.original_price ? `₦${course.original_price.toLocaleString()}` : course.price ? `₦${course.price.toLocaleString()}` : "Free"}
        </Button>
      </div>

      <Footer />
    </div>
  );
}
