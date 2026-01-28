import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertCircle, Calendar, Clock, Monitor, Sparkles, Award, BookOpen, CheckCircle } from "lucide-react";
import { format, differenceInDays, differenceInHours } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import type { CourseAccessSettings } from "@/hooks/useCourseAccess";

type Course = Tables<"courses">;
type Cohort = Tables<"cohorts">;

interface EnrollmentHeaderProps {
  course: Course;
  cohort?: Cohort | null;
  deadline?: Date | null;
  accessSettings?: CourseAccessSettings | null;
}

function CountdownBadge({ deadline }: { deadline: Date }) {
  const now = new Date();
  const daysLeft = differenceInDays(deadline, now);
  const hoursLeft = differenceInHours(deadline, now);

  if (daysLeft < 0) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertCircle className="w-3 h-3" />
        Application Closed
      </Badge>
    );
  }

  if (daysLeft === 0) {
    return (
      <Badge variant="destructive" className="gap-1 animate-pulse">
        <Clock className="w-3 h-3" />
        {hoursLeft} hours left
      </Badge>
    );
  }

  if (daysLeft <= 3) {
    return (
      <Badge variant="destructive" className="gap-1">
        <Clock className="w-3 h-3" />
        {daysLeft} days left
      </Badge>
    );
  }

  if (daysLeft <= 7) {
    return (
      <Badge className="gap-1 bg-amber-500 hover:bg-amber-600">
        <Clock className="w-3 h-3" />
        {daysLeft} days left
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <Calendar className="w-3 h-3" />
      {format(deadline, "MMM d, yyyy")}
    </Badge>
  );
}

// Determine payment scenario based on access settings
type PaymentScenario = "free_all" | "paid_content" | "certificate_only" | "content_and_cert";

function getPaymentScenario(accessSettings?: CourseAccessSettings | null, coursePrice?: number | null): PaymentScenario {
  const price = coursePrice || 0;
  const contentFree = !accessSettings || accessSettings.content_access === 'free' || price === 0;
  const certFree = !accessSettings || accessSettings.certificate_access === 'free' || accessSettings.certificate_access === 'disabled';
  
  if (contentFree && certFree) return "free_all";
  if (contentFree && !certFree) return "certificate_only";
  if (!contentFree && !certFree) return "content_and_cert";
  return "paid_content";
}

function getPaymentBannerConfig(scenario: PaymentScenario, accessSettings?: CourseAccessSettings | null, coursePrice?: number | null) {
  const certificateFee = accessSettings?.certificate_fee || 5000;
  const price = coursePrice || 0;
  
  switch (scenario) {
    case "paid_content":
      return {
        show: true,
        variant: "warning" as const,
        icon: AlertCircle,
        title: "Payment Required",
        message: `A payment of ₦${price.toLocaleString()} is required to access this course. Your enrollment will be confirmed after payment verification.`,
      };
    case "content_and_cert":
      return {
        show: true,
        variant: "warning" as const,
        icon: AlertCircle,
        title: "Payment Required",
        message: `Course enrollment requires ₦${price.toLocaleString()}. An additional ₦${certificateFee.toLocaleString()} certificate fee applies upon completion.`,
      };
    case "certificate_only":
      return {
        show: true,
        variant: "info" as const,
        icon: Award,
        title: "Free Course with Paid Certificate",
        message: `Course content is free to access. Certificate of completion is available for ₦${certificateFee.toLocaleString()} after meeting requirements.`,
      };
    case "free_all":
    default:
      return {
        show: false,
        variant: "success" as const,
        icon: CheckCircle,
        title: "Free Access",
        message: "This course is completely free including all content and assessments.",
      };
  }
}

export function EnrollmentHeader({ course, cohort, deadline, accessSettings }: EnrollmentHeaderProps) {
  const paymentScenario = getPaymentScenario(accessSettings, course.price);
  const bannerConfig = getPaymentBannerConfig(paymentScenario, accessSettings, course.price);
  
  // Determine the badge to show based on scenario
  const isPaidContent = paymentScenario === "paid_content" || paymentScenario === "content_and_cert";
  const isCertificateOnly = paymentScenario === "certificate_only";
  const isFreeAll = paymentScenario === "free_all";

  return (
    <div className="space-y-4">
      {/* Course Header Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20">
        <div className="space-y-4">
          {/* Course Title */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {course.title}
              </h1>
              {cohort && (
                <p className="text-lg text-primary font-medium mt-1">
                  {cohort.title}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {isPaidContent ? (
                <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                  <Sparkles className="w-3 h-3" />
                  Premium Course
                </Badge>
              ) : isCertificateOnly ? (
                <Badge className="gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0">
                  <BookOpen className="w-3 h-3" />
                  Free Course
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                  <CheckCircle className="w-3 h-3" />
                  Fully Free
                </Badge>
              )}
            </div>
          </div>

          {/* Course Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Monitor className="w-4 h-4" />
              <span>100% Virtual</span>
            </div>
            {course.duration_weeks && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{course.duration_weeks} weeks</span>
              </div>
            )}
            {deadline && (
              <CountdownBadge deadline={deadline} />
            )}
          </div>
        </div>
      </Card>

      {/* Context-Aware Payment Banner */}
      {bannerConfig.show && (
        <div className={`rounded-lg border p-4 ${
          bannerConfig.variant === "warning" 
            ? "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
            : bannerConfig.variant === "info"
            ? "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30"
            : "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30"
        }`}>
          <div className="flex gap-3">
            <bannerConfig.icon className={`w-5 h-5 shrink-0 mt-0.5 ${
              bannerConfig.variant === "warning"
                ? "text-amber-600 dark:text-amber-400"
                : bannerConfig.variant === "info"
                ? "text-blue-600 dark:text-blue-400"
                : "text-green-600 dark:text-green-400"
            }`} />
            <div className="text-sm">
              <p className={`font-medium ${
                bannerConfig.variant === "warning"
                  ? "text-amber-800 dark:text-amber-200"
                  : bannerConfig.variant === "info"
                  ? "text-blue-800 dark:text-blue-200"
                  : "text-green-800 dark:text-green-200"
              }`}>
                {bannerConfig.title}
              </p>
              <p className={`mt-0.5 ${
                bannerConfig.variant === "warning"
                  ? "text-amber-700 dark:text-amber-300"
                  : bannerConfig.variant === "info"
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-green-700 dark:text-green-300"
              }`}>
                {bannerConfig.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
