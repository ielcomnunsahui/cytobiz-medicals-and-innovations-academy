import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Cohort = Tables<"cohorts">;
export type CohortInsert = TablesInsert<"cohorts">;
export type CohortUpdate = TablesUpdate<"cohorts">;

export interface CohortWithCourse extends Cohort {
  course?: {
    id: string;
    title: string;
    slug: string;
  };
  _count?: {
    enrollments: number;
  };
}

export function useCohorts() {
  return useQuery({
    queryKey: ["cohorts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cohorts")
        .select(`
          *,
          course:courses(id, title, slug)
        `)
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data as CohortWithCourse[];
    },
  });
}

export function useCohortsForCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ["cohorts", "course", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from("cohorts")
        .select("*")
        .eq("course_id", courseId)
        .eq("is_active", true)
        .order("start_date");

      if (error) throw error;
      return data as Cohort[];
    },
    enabled: !!courseId,
  });
}

export function useCreateCohort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cohort: CohortInsert) => {
      const { data, error } = await supabase
        .from("cohorts")
        .insert(cohort)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      toast.success("Cohort created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create cohort: ${error.message}`);
    },
  });
}

export function useUpdateCohort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: CohortUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("cohorts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      toast.success("Cohort updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update cohort: ${error.message}`);
    },
  });
}

export function useDeleteCohort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cohorts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      toast.success("Cohort deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete cohort: ${error.message}`);
    },
  });
}
