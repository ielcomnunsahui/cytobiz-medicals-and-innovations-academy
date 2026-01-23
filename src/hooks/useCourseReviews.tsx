import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  review: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function useCourseReviews(courseId: string) {
  return useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: async () => {
      // Fetch reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from("course_reviews")
        .select("*")
        .eq("course_id", courseId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;
      if (!reviews?.length) return [];

      // Fetch profiles for users
      const userIds = reviews.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);

      // Map profiles to reviews
      return reviews.map(review => ({
        ...review,
        profiles: profiles?.find(p => p.user_id === review.user_id) || null,
      })) as CourseReview[];
    },
    enabled: !!courseId,
  });
}

export function useCourseAverageRating(courseId: string) {
  return useQuery({
    queryKey: ["course-average-rating", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_reviews")
        .select("rating")
        .eq("course_id", courseId)
        .eq("is_approved", true);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return { average: 0, count: 0 };
      }

      const sum = data.reduce((acc, r) => acc + r.rating, 0);
      return {
        average: Math.round((sum / data.length) * 10) / 10,
        count: data.length,
      };
    },
    enabled: !!courseId,
  });
}

export function useUserCourseReview(courseId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ["user-course-review", courseId, userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("course_reviews")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId && !!userId,
  });
}

export function useCreateCourseReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      course_id: string;
      user_id: string;
      rating: number;
      review?: string;
    }) => {
      const { data, error } = await supabase
        .from("course_reviews")
        .insert({
          course_id: review.course_id,
          user_id: review.user_id,
          rating: review.rating,
          review: review.review || null,
          is_approved: false, // Reviews need admin approval
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course-reviews", variables.course_id] });
      queryClient.invalidateQueries({ queryKey: ["course-average-rating", variables.course_id] });
      queryClient.invalidateQueries({ queryKey: ["user-course-review", variables.course_id] });
      toast.success("Review submitted! It will be visible after approval.");
    },
    onError: (error: any) => {
      console.error("Error creating review:", error);
      toast.error(error.message || "Failed to submit review");
    },
  });
}

export function useUpdateCourseReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      id: string;
      course_id: string;
      rating: number;
      review?: string;
    }) => {
      const { data, error } = await supabase
        .from("course_reviews")
        .update({
          rating: review.rating,
          review: review.review || null,
          is_approved: false, // Needs re-approval after edit
        })
        .eq("id", review.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course-reviews", variables.course_id] });
      queryClient.invalidateQueries({ queryKey: ["course-average-rating", variables.course_id] });
      queryClient.invalidateQueries({ queryKey: ["user-course-review", variables.course_id] });
      toast.success("Review updated! It will be visible after approval.");
    },
    onError: (error: any) => {
      console.error("Error updating review:", error);
      toast.error(error.message || "Failed to update review");
    },
  });
}

// Admin hooks
export function useAdminCourseReviews() {
  return useQuery({
    queryKey: ["admin-course-reviews"],
    queryFn: async () => {
      // Fetch all reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from("course_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;
      if (!reviews?.length) return [];

      // Fetch profiles
      const userIds = reviews.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);

      // Fetch courses
      const courseIds = [...new Set(reviews.map(r => r.course_id))];
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title, slug")
        .in("id", courseIds);

      // Map data
      return reviews.map(review => ({
        ...review,
        profiles: profiles?.find(p => p.user_id === review.user_id) || null,
        courses: courses?.find(c => c.id === review.course_id) || null,
      }));
    },
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase
        .from("course_reviews")
        .update({ is_approved: approved })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["course-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["course-average-rating"] });
      toast.success("Review status updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update review");
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("course_reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["course-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["course-average-rating"] });
      toast.success("Review deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
}
