import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Course = Tables<"courses">;

export function useCourses(options?: { 
  status?: "draft" | "published" | "archived";
  type?: "cohort" | "self_paced";
  featured?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["courses", options],
    queryFn: async () => {
      let query = supabase.from("courses").select("*");
      
      if (options?.status) {
        query = query.eq("status", options.status);
      }
      
      if (options?.type) {
        query = query.eq("course_type", options.type);
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      // Order by created_at desc
      query = query.order("created_at", { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Course[];
    },
  });
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data as Course;
    },
    enabled: !!slug,
  });
}

export function useCourseWithDetails(slug: string) {
  return useQuery({
    queryKey: ["course-details", slug],
    queryFn: async () => {
      // Get course
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (courseError) throw courseError;
      
      // Get modules with lessons
      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select(`
          *,
          lessons (
            *,
            assignments (*)
          )
        `)
        .eq("course_id", course.id)
        .order("order_index");
      
      if (modulesError) throw modulesError;
      
      // Get FAQs
      const { data: faqs, error: faqsError } = await supabase
        .from("faqs")
        .select("*")
        .or(`course_id.eq.${course.id},is_global.eq.true`)
        .order("order_index");
      
      if (faqsError) throw faqsError;
      
      // Get cohorts for this course
      const { data: cohorts, error: cohortsError } = await supabase
        .from("cohorts")
        .select("*")
        .eq("course_id", course.id)
        .eq("is_active", true)
        .order("start_date");
      
      if (cohortsError) throw cohortsError;
      
      return {
        ...course,
        modules: modules || [],
        faqs: faqs || [],
        cohorts: cohorts || [],
      };
    },
    enabled: !!slug,
  });
}

export function useEnrolledCourses(userId: string | undefined) {
  return useQuery({
    queryKey: ["enrolled-courses", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses (*),
          cohort:cohorts (*)
        `)
        .eq("user_id", userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}
