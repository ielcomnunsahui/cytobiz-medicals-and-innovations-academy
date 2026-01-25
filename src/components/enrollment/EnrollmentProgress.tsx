import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type EnrollmentStep = 
  | "cohort" 
  | "personal" 
  | "background" 
  | "course_selection" 
  | "motivation" 
  | "review" 
  | "payment" 
  | "done";

interface StepConfig {
  key: EnrollmentStep;
  label: string;
  shortLabel: string;
}

const COHORT_STEPS: StepConfig[] = [
  { key: "cohort", label: "Select Cohort", shortLabel: "Cohort" },
  { key: "personal", label: "Personal Info", shortLabel: "Personal" },
  { key: "background", label: "Background", shortLabel: "Background" },
  { key: "course_selection", label: "Course & Pricing", shortLabel: "Course" },
  { key: "motivation", label: "Motivation", shortLabel: "Why" },
  { key: "review", label: "Review", shortLabel: "Review" },
  { key: "payment", label: "Payment", shortLabel: "Payment" },
];

// When cohort is pre-selected from URL, skip the cohort step
const COHORT_PRESELECTED_STEPS: StepConfig[] = [
  { key: "personal", label: "Personal Info", shortLabel: "Personal" },
  { key: "background", label: "Background", shortLabel: "Background" },
  { key: "course_selection", label: "Course & Pricing", shortLabel: "Course" },
  { key: "motivation", label: "Motivation", shortLabel: "Why" },
  { key: "review", label: "Review", shortLabel: "Review" },
  { key: "payment", label: "Payment", shortLabel: "Payment" },
];

const SELF_PACED_STEPS: StepConfig[] = [
  { key: "personal", label: "Personal Info", shortLabel: "Personal" },
  { key: "background", label: "Background", shortLabel: "Background" },
  { key: "review", label: "Review", shortLabel: "Review" },
  { key: "payment", label: "Payment", shortLabel: "Payment" },
];

interface EnrollmentProgressProps {
  currentStep: EnrollmentStep;
  courseType: "cohort" | "self_paced" | null;
  completedSteps: Set<EnrollmentStep>;
  cohortPreselected?: boolean;
}

export function getSteps(courseType: "cohort" | "self_paced" | null, cohortPreselected?: boolean): StepConfig[] {
  if (courseType === "cohort") {
    return cohortPreselected ? COHORT_PRESELECTED_STEPS : COHORT_STEPS;
  }
  return SELF_PACED_STEPS;
}

export function getNextStep(currentStep: EnrollmentStep, courseType: "cohort" | "self_paced" | null, cohortPreselected?: boolean): EnrollmentStep {
  const steps = getSteps(courseType, cohortPreselected);
  const currentIndex = steps.findIndex(s => s.key === currentStep);
  if (currentIndex < steps.length - 1) {
    return steps[currentIndex + 1].key;
  }
  return "done";
}

export function getPrevStep(currentStep: EnrollmentStep, courseType: "cohort" | "self_paced" | null, cohortPreselected?: boolean): EnrollmentStep | null {
  const steps = getSteps(courseType, cohortPreselected);
  const currentIndex = steps.findIndex(s => s.key === currentStep);
  if (currentIndex > 0) {
    return steps[currentIndex - 1].key;
  }
  return null;
}

export function EnrollmentProgress({ currentStep, courseType, completedSteps, cohortPreselected }: EnrollmentProgressProps) {
  const steps = getSteps(courseType, cohortPreselected);
  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="w-full">
      {/* Desktop Progress */}
      <div className="hidden md:flex items-center justify-center gap-1">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep;
          const isComplete = completedSteps.has(step.key) || index < currentIndex;
          const isPast = index < currentIndex;

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    isComplete
                      ? "bg-primary text-primary-foreground"
                      : isActive
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete && !isActive ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs transition-colors whitespace-nowrap",
                    isActive ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.shortLabel}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 mx-1 mt-[-18px] transition-colors duration-300",
                    isPast ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {steps[currentIndex]?.label}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
