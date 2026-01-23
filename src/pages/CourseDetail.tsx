import { useState } from "react";
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
  Share2,
  Heart,
  BookOpen,
  ChevronDown,
  ArrowLeft,
  Loader2,
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
import { useCourseWithDetails } from "@/hooks/useCourses";
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
      <section className="relative pt-24 pb-16 bg-hero-gradient overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[120px]"
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
              className="text-primary-foreground"
            >
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to courses
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                {course.category && (
                  <Badge className="bg-white/20 text-primary-foreground border-0">
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
                  <Badge variant="outline" className="border-white/30 text-primary-foreground capitalize">
                    {course.level}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-primary-foreground/80 mb-6">
                {course.short_description || course.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-8 text-primary-foreground/80">
                {course.duration_weeks && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {course.duration_weeks} weeks
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

              {/* Mobile CTA */}
              <div className="lg:hidden">
                <Button
                  size="lg"
                  className="w-full bg-white text-foreground hover:bg-white/90 h-14"
                  onClick={() => setEnrollOpen(true)}
                >
                  Enroll Now - {course.price ? `$${course.price}` : "Free"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
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
                    <span className="text-4xl font-bold text-card-foreground">
                      {course.price ? `$${course.price}` : "Free"}
                    </span>
                    {course.price && <span className="text-muted-foreground">one-time payment</span>}
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 mb-3 h-14 text-lg"
                    onClick={() => setEnrollOpen(true)}
                  >
                    Enroll Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

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
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <div className="mt-6 space-y-3 text-sm">
                    {course.duration_weeks && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {course.duration_weeks} weeks of content
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
                        className="flex gap-3 p-4 rounded-xl bg-muted/50"
                      >
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{outcome}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

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

      {/* Mobile Fixed CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 h-12"
          onClick={() => setEnrollOpen(true)}
        >
          Enroll Now - {course.price ? `$${course.price}` : "Free"}
        </Button>
      </div>

      <Footer />
    </div>
  );
}
