import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export type Wishlist = Tables<"wishlists">;

export function useWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("wishlists")
        .select("*, courses(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const isInWishlist = (courseId: string) => {
    return wishlistItems.some((item: any) => item.course_id === courseId);
  };

  const addToWishlist = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error("You must be logged in");
      
      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, course_id: courseId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Course added to your wishlist!");
    },
    onError: (error: any) => {
      if (error.message?.includes("duplicate")) {
        toast.info("Course is already in your wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error("You must be logged in");
      
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("course_id", courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Course removed from your wishlist");
    },
    onError: () => {
      toast.error("Failed to remove from wishlist");
    },
  });

  const toggleWishlist = (courseId: string) => {
    if (!user) {
      toast.error("Please log in to save courses");
      return;
    }
    
    if (isInWishlist(courseId)) {
      removeFromWishlist.mutate(courseId);
    } else {
      addToWishlist.mutate(courseId);
    }
  };

  return {
    wishlistItems,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    wishlistCount: wishlistItems.length,
  };
}
