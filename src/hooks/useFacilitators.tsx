import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Facilitator = Tables<"facilitators">;

export function useFacilitators() {
  return useQuery({
    queryKey: ["facilitators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilitators")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data as Facilitator[];
    },
  });
}

export function useCourseFacilitators(courseId: string | undefined) {
  return useQuery({
    queryKey: ["course-facilitators", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      
      // Get all facilitators as fallback (since facilitator_cohorts may not have proper FK)
      const { data: allFacilitators, error } = await supabase
        .from("facilitators")
        .select("*")
        .limit(3)
        .order("display_order");
      
      if (error) throw error;
      return allFacilitators as Facilitator[];
    },
    enabled: !!courseId,
  });
}
