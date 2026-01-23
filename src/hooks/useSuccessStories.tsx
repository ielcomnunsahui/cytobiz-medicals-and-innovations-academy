import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SuccessStory {
  id: string;
  name: string;
  testimonial: string;
  title: string | null;
  company: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  rating: number | null;
  outcome: string | null;
  project_name: string | null;
  project_description: string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export function useSuccessStories() {
  return useQuery({
    queryKey: ["success-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as SuccessStory[];
    },
  });
}

export function useAdminSuccessStories() {
  return useQuery({
    queryKey: ["admin-success-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as SuccessStory[];
    },
  });
}

export function useCreateSuccessStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (story: Omit<SuccessStory, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("success_stories")
        .insert([story])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-success-stories"] });
      queryClient.invalidateQueries({ queryKey: ["success-stories"] });
      toast.success("Success story created");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create success story");
    },
  });
}

export function useUpdateSuccessStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SuccessStory> & { id: string }) => {
      const { data, error } = await supabase
        .from("success_stories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-success-stories"] });
      queryClient.invalidateQueries({ queryKey: ["success-stories"] });
      toast.success("Success story updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update success story");
    },
  });
}

export function useDeleteSuccessStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("success_stories").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-success-stories"] });
      queryClient.invalidateQueries({ queryKey: ["success-stories"] });
      toast.success("Success story deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete success story");
    },
  });
}
