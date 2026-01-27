import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Edit2, 
  User, 
  Briefcase, 
  BookOpen, 
  MessageSquare, 
  Award,
  ClipboardCheck,
  Check,
  Lock,
  AlertCircle
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import type { CourseAccessSettings } from "@/hooks/useCourseAccess";

interface AccessAcknowledgmentStepProps {
  formData: Record<string, any>;
  updateField: (key: string, value: any) => void;
  errors: Record<string, string>;
  course: Tables<"courses">;
  cohort?: Tables<"cohorts"> | null;
  accessSettings: CourseAccessSettings | null;
  onEditStep: (step: string) => void;
}

function ReviewSection({
  title,
  icon: Icon,
  onEdit,
  children,
}: {
  title: string;
  icon: React.ComponentType<any>;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 gap-1">
          <Edit2 className="w-3 h-3" />
          Edit
        </Button>
      </div>
      <div className="space-y-2 text-sm">{children}</div>
    </Card>
  );
}

function ReviewItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value || "—"}</span>
    </div>
  );
}

export function AccessAcknowledgmentStep({
  formData,
  updateField,
  errors,
  course,
  cohort,
  accessSettings,
  onEditStep,
}: AccessAcknowledgmentStepProps) {
  const originalPrice = course.original_price ?? course.price ?? 0;
  const discountedPrice = course.discounted_price;
  const hasDiscount = discountedPrice !== null && discountedPrice !== undefined;

  // Determine what's included based on access settings
  const contentIsFree = accessSettings?.promo_enabled || accessSettings?.content_access === 'free';
  const assessmentIsFree = accessSettings?.assessment_access === 'free';
  const certificateIsFree = accessSettings?.certificate_access === 'free';
  const certificateDisabled = accessSettings?.certificate_access === 'disabled';

  // Generate acknowledgment text based on settings
  const getAcknowledgmentText = () => {
    const items: string[] = [];

    if (contentIsFree) {
      items.push("Course content is available immediately after enrollment");
    } else {
      items.push("Payment is required before accessing course content");
    }

    if (assessmentIsFree) {
      items.push("All assessments are included at no extra cost");
    } else if (accessSettings?.assessment_access === 'locked') {
      items.push("Assessments are not available for this course");
    } else {
      items.push("Additional payment may be required for assessments");
    }

    if (certificateIsFree) {
      items.push("Certificate of completion is included at no extra cost");
    } else if (certificateDisabled) {
      items.push("No certificate is available for this course");
    } else {
      items.push(`Certificate requires a fee of ₦${accessSettings?.certificate_fee?.toLocaleString() || "5,000"} after course completion`);
    }

    return items;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Review & Acknowledge</h2>
        <p className="text-sm text-muted-foreground">
          Review your information and acknowledge the access and certification requirements.
        </p>
      </div>

      <div className="space-y-4">
        {/* Personal Information */}
        <ReviewSection
          title="Personal Information"
          icon={User}
          onEdit={() => onEditStep("personal")}
        >
          <ReviewItem label="Full Name" value={formData.full_name} />
          <ReviewItem label="Email" value={formData.email} />
          <ReviewItem label="Phone" value={formData.phone} />
          <ReviewItem 
            label="Gender" 
            value={formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : null} 
          />
          <ReviewItem label="Country" value={formData.country} />
        </ReviewSection>

        {/* Background */}
        <ReviewSection
          title="Professional Background"
          icon={Briefcase}
          onEdit={() => onEditStep("background")}
        >
          <ReviewItem label="Education" value={formData.education} />
          <ReviewItem 
            label="Current Status" 
            value={formData.current_status === "Other" ? formData.current_status_other : formData.current_status} 
          />
          <ReviewItem label="LinkedIn" value={formData.linkedin || "Not provided"} />
        </ReviewSection>

        {/* Course & Cohort */}
        <ReviewSection
          title="Course Selection"
          icon={BookOpen}
          onEdit={() => onEditStep("course_selection")}
        >
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Course</span>
            <span className="font-medium text-foreground">{course.title}</span>
          </div>
          {cohort && (
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Cohort</span>
              <span className="font-medium text-foreground">{cohort.title}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Course Price</span>
            {contentIsFree ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                FREE
              </Badge>
            ) : originalPrice > 0 ? (
              hasDiscount ? (
                <div className="text-right">
                  <span className="text-muted-foreground line-through text-xs mr-2">
                    ₦{originalPrice.toLocaleString()}
                  </span>
                  <span className="font-bold text-primary">₦{discountedPrice?.toLocaleString()}</span>
                </div>
              ) : (
                <span className="font-bold text-primary">₦{originalPrice.toLocaleString()}</span>
              )
            ) : (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                FREE
              </Badge>
            )}
          </div>
        </ReviewSection>

        {/* Motivation (if cohort-based) */}
        {formData.motivation && (
          <ReviewSection
            title="Motivation"
            icon={MessageSquare}
            onEdit={() => onEditStep("motivation")}
          >
            <div className="py-1">
              <p className="text-muted-foreground mb-1">Why this course?</p>
              <p className="text-foreground text-sm leading-relaxed">
                {formData.motivation}
              </p>
            </div>
            <ReviewItem 
              label="Discovered via" 
              value={formData.discovery_source === "other" ? formData.discovery_source_other : formData.discovery_source} 
            />
          </ReviewSection>
        )}
      </div>

      {/* Access & Certification Disclosure */}
      <Card className="p-4 border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Access & Certification Requirements</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Please review the following requirements before enrolling:
            </p>
          </div>
        </div>
        
        <div className="space-y-3 ml-8">
          {/* Content Access */}
          <div className="flex items-center justify-between p-2 bg-background rounded-lg">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Course Content</span>
            </div>
            {contentIsFree ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <Check className="w-3 h-3 mr-1" />
                Free Access
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                <Lock className="w-3 h-3 mr-1" />
                Payment Required
              </Badge>
            )}
          </div>

          {/* Assessment Access */}
          <div className="flex items-center justify-between p-2 bg-background rounded-lg">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Assessments</span>
            </div>
            {assessmentIsFree ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <Check className="w-3 h-3 mr-1" />
                Included
              </Badge>
            ) : accessSettings?.assessment_access === 'locked' ? (
              <Badge variant="outline" className="text-muted-foreground">
                <Lock className="w-3 h-3 mr-1" />
                Not Available
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                <Lock className="w-3 h-3 mr-1" />
                Payment Required
              </Badge>
            )}
          </div>

          {/* Certificate Access */}
          <div className="flex items-center justify-between p-2 bg-background rounded-lg">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Certificate</span>
            </div>
            {certificateIsFree ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <Check className="w-3 h-3 mr-1" />
                Free
              </Badge>
            ) : certificateDisabled ? (
              <Badge variant="outline" className="text-muted-foreground">
                <Lock className="w-3 h-3 mr-1" />
                Not Available
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                <Lock className="w-3 h-3 mr-1" />
                ₦{accessSettings?.certificate_fee?.toLocaleString() || "5,000"}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Confirmation Checkboxes */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-start gap-3">
          <Checkbox
            id="access_acknowledgment"
            checked={!!formData.access_acknowledgment}
            onCheckedChange={(checked) => updateField("access_acknowledgment", checked)}
            className={errors.access_acknowledgment ? "border-destructive" : ""}
          />
          <div className="space-y-1">
            <Label htmlFor="access_acknowledgment" className="cursor-pointer leading-relaxed text-sm">
              I understand the access and certification requirements for this course.
              <span className="text-destructive"> *</span>
            </Label>
            {errors.access_acknowledgment && (
              <p className="text-xs text-destructive">{errors.access_acknowledgment}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="confirmation"
            checked={!!formData.confirmation}
            onCheckedChange={(checked) => updateField("confirmation", checked)}
            className={errors.confirmation ? "border-destructive" : ""}
          />
          <div className="space-y-1">
            <Label htmlFor="confirmation" className="cursor-pointer leading-relaxed text-sm">
              I confirm that the information provided is accurate and complete.
              <span className="text-destructive"> *</span>
            </Label>
            {errors.confirmation && (
              <p className="text-xs text-destructive">{errors.confirmation}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
