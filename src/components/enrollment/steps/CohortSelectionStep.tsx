import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";

type Cohort = Tables<"cohorts">;

interface CohortSelectionStepProps {
  cohorts: Cohort[];
  selectedCohortId: string | null;
  onSelectCohort: (cohortId: string) => void;
  isLoading?: boolean;
  error?: string;
}

export function CohortSelectionStep({
  cohorts,
  selectedCohortId,
  onSelectCohort,
  isLoading,
  error,
}: CohortSelectionStepProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Choose Your Cohort</h2>
        <p className="text-sm text-muted-foreground">
          Select the cohort start date that best fits your schedule. Each cohort has a fixed start and end date.
        </p>
      </div>

      {cohorts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-foreground mb-2">No Cohorts Available</h3>
          <p className="text-sm text-muted-foreground">
            There are currently no open cohorts for this course. Please check back later or contact us for more information.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cohorts.map((cohort) => {
            const isSelected = selectedCohortId === cohort.id;
            const startDate = new Date(cohort.start_date);
            const endDate = new Date(cohort.end_date);
            const isUpcoming = startDate > new Date();

            return (
              <button
                key={cohort.id}
                onClick={() => onSelectCohort(cohort.id)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{cohort.title}</span>
                      {isUpcoming && (
                        <Badge variant="secondary" className="text-xs">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(startDate, "MMM d")} — {format(endDate, "MMM d, yyyy")}
                        </span>
                      </div>
                      {cohort.max_students && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{cohort.max_students} spots</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "bg-primary text-primary-foreground" : "border-2 border-muted"
                  }`}>
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
