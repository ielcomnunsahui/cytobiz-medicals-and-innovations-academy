import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

// Types
export type Course = Tables<"courses">;
export type Profile = Tables<"profiles">;
export type Enrollment = Tables<"enrollments">;
export type Certificate = Tables<"certificates">;
export type UserRole = Tables<"user_roles">;
export type SiteSetting = Tables<"site_settings">;

// ==================== ADMIN STATS ====================
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: coursesCount },
        { count: enrollmentsCount },
        { count: certificatesCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
      ]);

      // Get published courses count
      const { count: publishedCoursesCount } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true })
        .eq("status", "published");

      return {
        totalUsers: usersCount || 0,
        totalCourses: coursesCount || 0,
        publishedCourses: publishedCoursesCount || 0,
        totalEnrollments: enrollmentsCount || 0,
        totalCertificates: certificatesCount || 0,
      };
    },
  });
}

// ==================== RECENT ENROLLMENTS ====================
export function useRecentEnrollments(limit = 5) {
  return useQuery({
    queryKey: ["recent-enrollments", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(title),
          profile:profiles!enrollments_user_id_fkey(display_name)
        `)
        .order("enrolled_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
}

// ==================== COURSES CRUD ====================
export function useAdminCourses() {
  return useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get enrollment counts for each course
      const courseIds = data.map((c) => c.id);
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id")
        .in("course_id", courseIds);

      const enrollmentCounts = enrollments?.reduce((acc, e) => {
        acc[e.course_id] = (acc[e.course_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return data.map((course) => ({
        ...course,
        enrollmentCount: enrollmentCounts?.[course.id] || 0,
      }));
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (course: TablesInsert<"courses">) => {
      const { data, error } = await supabase
        .from("courses")
        .insert(course)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Course created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create course: ${error.message}`);
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...course }: TablesUpdate<"courses"> & { id: string }) => {
      const { data, error } = await supabase
        .from("courses")
        .update(course)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Course updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update course: ${error.message}`);
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Course deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete course: ${error.message}`);
    },
  });
}

// ==================== USERS & ROLES ====================
export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get roles for all users
      const userIds = profiles.map((p) => p.user_id);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("*")
        .in("user_id", userIds);

      // Get enrollment counts
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("user_id")
        .in("user_id", userIds);

      const enrollmentCounts = enrollments?.reduce((acc, e) => {
        acc[e.user_id] = (acc[e.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return profiles.map((profile) => ({
        ...profile,
        roles: roles?.filter((r) => r.user_id === profile.user_id).map((r) => r.role) || [],
        enrollmentCount: enrollmentCounts?.[profile.user_id] || 0,
      }));
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role, action }: { userId: string; role: "admin" | "facilitator" | "learner"; action: "add" | "remove" }) => {
      if (action === "add") {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: role as any });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated");
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error.message}`);
    },
  });
}

// ==================== ENROLLMENTS ====================
export function useAdminEnrollments() {
  return useQuery({
    queryKey: ["admin-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(title, slug),
          profile:profiles!enrollments_user_id_fkey(display_name, avatar_url)
        `)
        .order("enrolled_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteEnrollment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("enrollments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
      toast.success("Enrollment removed");
    },
    onError: (error) => {
      toast.error(`Failed to remove enrollment: ${error.message}`);
    },
  });
}

// ==================== CERTIFICATES ====================
export function useAdminCertificates() {
  return useQuery({
    queryKey: ["admin-certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select(`
          *,
          course:courses(title, slug)
        `)
        .order("issued_at", { ascending: false });

      if (error) throw error;

      // Get profile info separately
      const userIds = data.map((c) => c.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);

      const profileMap = profiles?.reduce((acc, p) => {
        acc[p.user_id] = p;
        return acc;
      }, {} as Record<string, any>);

      return data.map((cert) => ({
        ...cert,
        profile: profileMap?.[cert.user_id] || null,
      }));
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      toast.success("Certificate revoked");
    },
    onError: (error) => {
      toast.error(`Failed to revoke certificate: ${error.message}`);
    },
  });
}

// ==================== SITE SETTINGS ====================
export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("setting_key");

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, setting_value }: { id: string; setting_value: string }) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ setting_value, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Setting updated");
    },
    onError: (error) => {
      toast.error(`Failed to update setting: ${error.message}`);
    },
  });
}

export function useCreateSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (setting: TablesInsert<"site_settings">) => {
      const { error } = await supabase.from("site_settings").insert(setting);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("Setting created");
    },
    onError: (error) => {
      toast.error(`Failed to create setting: ${error.message}`);
    },
  });
}
