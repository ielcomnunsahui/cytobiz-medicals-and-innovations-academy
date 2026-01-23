import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertCircle, Calendar, Clock, Monitor, Sparkles } from "lucide-react";
import { format, differenceInDays, differenceInHours } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;
type Cohort = Tables<"cohorts">;

interface EnrollmentHeaderProps {
  course: Course;
  cohort?: Cohort | null;
  deadline?: Date | null;
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

export function EnrollmentHeader({ course, cohort, deadline }: EnrollmentHeaderProps) {
  const isFree = !course.price || course.price === 0;
  const isPremium = !isFree;

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
              {isPremium ? (
                <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                  <Sparkles className="w-3 h-3" />
                  Premium Course
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                  Free Course
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

      {/* Payment Notice for Premium Courses */}
      {isPremium && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30 p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Payment Required
              </p>
              <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                Payment is required after submitting this form. Your slot will be confirmed only after payment verification.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
