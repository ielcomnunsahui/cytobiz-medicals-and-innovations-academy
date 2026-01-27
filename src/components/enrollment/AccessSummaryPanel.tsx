import { Info, BookOpen, ClipboardCheck, Award, Check, Lock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CourseAccessSettings } from "@/hooks/useCourseAccess";
import type { Tables } from "@/integrations/supabase/types";

interface AccessSummaryPanelProps {
  course: Tables<"courses">;
  cohort?: Tables<"cohorts"> | null;
  accessSettings: CourseAccessSettings | null;
  variant?: "compact" | "detailed";
}

export function AccessSummaryPanel({
  course,
  cohort,
  accessSettings,
  variant = "compact",
}: AccessSummaryPanelProps) {
  if (!accessSettings) return null;

  const { content_access, assessment_access, certificate_access, certificate_fee, promo_enabled } = accessSettings;

  // Generate summary message
  const getSummaryMessage = () => {
    const messages: string[] = [];

    // Content access
    if (promo_enabled || content_access === 'free') {
      messages.push("Course content is free");
    } else {
      messages.push("Payment is required to access this course");
    }

    // Assessment access
    if (assessment_access === 'free') {
      // Don't mention if content already requires payment
    } else if (assessment_access === 'locked') {
      messages.push("Assessments are not available");
    } else if (assessment_access === 'paid' && content_access === 'free') {
      messages.push("Assessments require payment");
    }

    // Certificate access
    if (certificate_access === 'free') {
      messages.push("Certificate is included at no cost");
    } else if (certificate_access === 'paid') {
      messages.push(`Certificate requires ₦${certificate_fee?.toLocaleString() || "5,000"} to unlock`);
    } else if (certificate_access === 'disabled') {
      messages.push("No certificate is available for this course");
    }

    return messages;
  };

  const summaryMessages = getSummaryMessage();

  // Compact variant - just shows a quick summary line
  if (variant === "compact") {
    const isFullyFree = 
      (content_access === 'free' || promo_enabled) && 
      assessment_access === 'free' && 
      certificate_access === 'free';

    const requiresPayment = content_access === 'paid_before_access' && !promo_enabled;

    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm text-muted-foreground">
          {isFullyFree ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              This course is fully free, including certification.
            </span>
          ) : requiresPayment ? (
            <span>Payment is required to access this course.</span>
          ) : (
            <span>Course content is free. {certificate_access === 'paid' && `Certificate requires ₦${certificate_fee?.toLocaleString()}.`}</span>
          )}
        </p>
      </div>
    );
  }

  // Detailed variant - shows full breakdown
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="font-medium text-foreground">Access Summary</h4>
      </div>

      <div className="space-y-3">
        {/* Content Access */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Course Content</span>
          </div>
          {promo_enabled || content_access === 'free' ? (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <Check className="w-3 h-3 mr-1" />
              Free Access
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-300">
              <Lock className="w-3 h-3 mr-1" />
              Paid Access
            </Badge>
          )}
        </div>

        {/* Assessment Access */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Assessments</span>
          </div>
          {assessment_access === 'free' ? (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <Check className="w-3 h-3 mr-1" />
              Included
            </Badge>
          ) : assessment_access === 'locked' ? (
            <Badge variant="outline" className="text-muted-foreground">
              <Lock className="w-3 h-3 mr-1" />
              Not Available
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-300">
              <Lock className="w-3 h-3 mr-1" />
              Requires Payment
            </Badge>
          )}
        </div>

        {/* Certificate Access */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Certificate</span>
          </div>
          {certificate_access === 'free' ? (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <Check className="w-3 h-3 mr-1" />
              Free
            </Badge>
          ) : certificate_access === 'disabled' ? (
            <Badge variant="outline" className="text-muted-foreground">
              <Lock className="w-3 h-3 mr-1" />
              Not Available
            </Badge>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    <Lock className="w-3 h-3 mr-1" />
                    ₦{certificate_fee?.toLocaleString() || "5,000"}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Certificate fee payable after course completion</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Summary Text */}
      <div className="pt-3 border-t border-border">
        <ul className="space-y-1">
          {summaryMessages.map((msg, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span>
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
