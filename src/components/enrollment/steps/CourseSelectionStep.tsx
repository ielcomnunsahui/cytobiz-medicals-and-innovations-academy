import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sparkles, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;

interface CourseSelectionStepProps {
  formData: Record<string, any>;
  updateField: (key: string, value: any) => void;
  errors: Record<string, string>;
  currentCourse: Course;
  availableCourses: Course[];
}

export function CourseSelectionStep({
  formData,
  updateField,
  errors,
  currentCourse,
  availableCourses,
}: CourseSelectionStepProps) {
  const selectedCourseId = formData.selected_course_id || currentCourse.id;
  const selectedCourse = availableCourses.find(c => c.id === selectedCourseId) || currentCourse;

  // Pricing display logic - use database fields
  const originalPrice = selectedCourse.original_price ?? selectedCourse.price ?? 0;
  const discountedPrice = selectedCourse.discounted_price;
  const hasDiscount = discountedPrice !== null && discountedPrice !== undefined;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Course Selection & Pricing</h2>
        <p className="text-sm text-muted-foreground">
          Confirm your course selection and review pricing details.
        </p>
      </div>

      {/* Course Selection */}
      <div className="space-y-3">
        <Label>
          Preferred Course <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={selectedCourseId}
          onValueChange={(value) => updateField("selected_course_id", value)}
          className="space-y-3"
        >
          {availableCourses.map((course) => {
            const isSelected = course.id === selectedCourseId;
            const displayPrice = course.discounted_price ?? course.original_price ?? course.price ?? 0;
            
            return (
              <label
                key={course.id}
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={course.id} className="mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{course.title}</span>
                    {displayPrice > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        ₦{displayPrice.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                  {course.short_description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {course.short_description}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-primary shrink-0" />
                )}
              </label>
            );
          })}
        </RadioGroup>
        {errors.selected_course_id && (
          <p className="text-xs text-destructive">{errors.selected_course_id}</p>
        )}
      </div>

      {/* Pricing Card */}
      <Card className="p-5 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Pricing Details</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Selected Course</span>
            <span className="font-medium text-foreground">{selectedCourse.title}</span>
          </div>
          
          {originalPrice > 0 ? (
            <>
              {hasDiscount ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Original Price</span>
                    <span className="text-muted-foreground line-through">
                      ₦{originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Discounted Price</span>
                      <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">
                        {Math.round((1 - discountedPrice / originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      ₦{discountedPrice.toLocaleString()}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Course Fee</span>
                  <span className="text-xl font-bold text-primary">
                    ₦{originalPrice.toLocaleString()}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Course Fee</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                FREE
              </Badge>
            </div>
          )}
        </div>

        {originalPrice > 0 && (
          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
            * Pricing is configured by admin and may vary per course. Discounts apply during promotional periods.
          </p>
        )}
      </Card>
    </div>
  );
}
