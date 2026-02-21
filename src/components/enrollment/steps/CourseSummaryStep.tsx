import { Calendar, Clock, Users, Globe, BookOpen, Award, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AccessSummaryPanel } from "@/components/enrollment/AccessSummaryPanel";
import type { Tables } from "@/integrations/supabase/types";
import type { CourseAccessSettings } from "@/hooks/useCourseAccess";
import { format } from "date-fns";

interface CourseSummaryStepProps {
  course: Tables<"courses">;
  cohort?: Tables<"cohorts"> | null;
  accessSettings: CourseAccessSettings | null;
}

export function CourseSummaryStep({
  course,
  cohort,
  accessSettings,
}: CourseSummaryStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Course Overview</h2>
        <p className="text-sm text-muted-foreground">
          Review the course details before proceeding with your enrollment.
        </p>
      </div>

      {/* Course Header */}
      <Card className="p-5 space-y-4">
        <div className="flex gap-4">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-20 h-20 object-cover rounded-lg shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
              <GraduationCap className="w-8 h-8 text-primary/50" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground">{course.title}</h3>
            {cohort && (
              <p className="text-sm text-primary font-medium mt-0.5">{cohort.title}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {course.course_type === 'cohort' ? 'Cohort-Based' : 'Self-Paced'}
              </Badge>
              {course.level && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {course.level}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {course.short_description && (
          <p className="text-sm text-muted-foreground">
            {course.short_description}
          </p>
        )}

        <Separator />

        {/* Course Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">100% Online</span>
          </div>
          
          {course.duration_hours && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{course.duration_hours} hours</span>
            </div>
          )}
          
          {course.effort_hours_per_week && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{course.effort_hours_per_week} hrs/week</span>
            </div>
          )}

          {cohort?.start_date && (
            <div className="flex items-center gap-2 text-sm col-span-2 sm:col-span-1">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                Starts {format(new Date(cohort.start_date), "MMM d, yyyy")}
              </span>
            </div>
          )}
        </div>

        {/* Learning Outcomes Preview */}
        {course.learning_outcomes && course.learning_outcomes.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                What you'll learn
              </h4>
              <ul className="grid gap-1.5">
                {course.learning_outcomes.slice(0, 4).map((outcome, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    {outcome}
                  </li>
                ))}
                {course.learning_outcomes.length > 4 && (
                  <li className="text-sm text-primary">
                    +{course.learning_outcomes.length - 4} more outcomes
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </Card>

      {/* Access & Pricing Summary */}
      <AccessSummaryPanel
        course={course}
        cohort={cohort}
        accessSettings={accessSettings}
        variant="detailed"
      />

      {/* Certification Info */}
      {accessSettings?.certificate_access !== 'disabled' && (
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Certificate of Completion</h4>
              <p className="text-sm text-muted-foreground mt-0.5">
                {accessSettings?.certificate_access === 'free' 
                  ? "You'll receive a certificate upon successful completion, included at no extra cost."
                  : `Certificate available for ₦${accessSettings?.certificate_fee?.toLocaleString() || "5,000"} after completing the course.`
                }
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
