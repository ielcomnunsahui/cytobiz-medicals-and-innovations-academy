import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  description: string | null;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");
      
      if (error) throw error;
      
      // Convert to key-value map
      const settingsMap: Record<string, string> = {};
      (data as SiteSetting[]).forEach((setting) => {
        settingsMap[setting.setting_key] = setting.setting_value || "";
      });
      
      return settingsMap;
    },
  });
}

export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: ["site-setting", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", key)
        .single();
      
      if (error) throw error;
      return data?.setting_value || null;
    },
  });
}

// Hook for getting stats that can be admin-configurable
export function useSiteStats() {
  return useQuery({
    queryKey: ["site-stats"],
    queryFn: async () => {
      // Get settings for stats
      const { data: settings } = await supabase
        .from("site_settings")
        .select("*");
      
      // Get actual counts from database
      const [enrollmentsResult, coursesResult] = await Promise.all([
        supabase.from("enrollments").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("status", "published"),
      ]);
      
      const settingsMap: Record<string, string> = {};
      (settings as SiteSetting[] || []).forEach((s) => {
        settingsMap[s.setting_key] = s.setting_value || "";
      });
      
      return {
        learnerCount: settingsMap["stat_learner_count"] || `${enrollmentsResult.count || 0}+`,
        countriesCount: settingsMap["stat_countries"] || "50+",
        programsCount: settingsMap["stat_programs"] || `${coursesResult.count || 0}+`,
        completionRate: settingsMap["stat_completion_rate"] || "95%",
      };
    },
  });
}
