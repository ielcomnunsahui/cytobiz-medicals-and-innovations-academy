import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, User, Briefcase, BookOpen, MessageSquare } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;
type Cohort = Tables<"cohorts">;

interface ReviewStepProps {
  formData: Record<string, any>;
  updateField: (key: string, value: any) => void;
  errors: Record<string, string>;
  course: Course;
  cohort?: Cohort | null;
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

export function ReviewStep({
  formData,
  updateField,
  errors,
  course,
  cohort,
  onEditStep,
}: ReviewStepProps) {
  const originalPrice = course.original_price ?? course.price ?? 0;
  const discountedPrice = course.discounted_price;
  const hasDiscount = discountedPrice !== null && discountedPrice !== undefined;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Review Your Application</h2>
        <p className="text-sm text-muted-foreground">
          Please review your information before submitting. You can edit any section by clicking the Edit button.
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
          <ReviewItem label="Gender" value={formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : null} />
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

        {/* Course Selection */}
        <ReviewSection
          title="Course & Pricing"
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
            <span className="text-muted-foreground">Price</span>
            {originalPrice > 0 ? (
              hasDiscount ? (
                <div className="text-right">
                  <span className="text-muted-foreground line-through text-xs mr-2">
                    ₦{originalPrice.toLocaleString()}
                  </span>
                  <span className="font-bold text-primary">₦{discountedPrice.toLocaleString()}</span>
                </div>
              ) : (
                <span className="font-bold text-primary">₦{originalPrice.toLocaleString()}</span>
              )
            ) : (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                FREE
              </Badge>
            )}
          </div>
        </ReviewSection>

        {/* Motivation */}
        <ReviewSection
          title="Motivation"
          icon={MessageSquare}
          onEdit={() => onEditStep("motivation")}
        >
          <div className="py-1">
            <p className="text-muted-foreground mb-1">Why this course?</p>
            <p className="text-foreground text-sm leading-relaxed">
              {formData.motivation || "—"}
            </p>
          </div>
          <ReviewItem 
            label="Discovered via" 
            value={formData.discovery_source === "other" ? formData.discovery_source_other : formData.discovery_source} 
          />
        </ReviewSection>
      </div>

      {/* Confirmation Checkbox */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-start gap-3">
          <Checkbox
            id="confirmation"
            checked={!!formData.confirmation}
            onCheckedChange={(checked) => updateField("confirmation", checked)}
            className={errors.confirmation ? "border-destructive" : ""}
          />
          <div className="space-y-1">
            <Label htmlFor="confirmation" className="cursor-pointer leading-relaxed">
              I confirm that the information provided is accurate and complete. I understand that any false information may result in the rejection of my application.
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
