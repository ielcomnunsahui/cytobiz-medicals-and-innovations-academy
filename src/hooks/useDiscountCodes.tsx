import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  min_purchase_amount: number | null;
  course_id: string | null;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  course?: { id: string; title: string } | null;
}

export function useDiscountCodes() {
  return useQuery({
    queryKey: ["discount-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discount_codes")
        .select(`
          *,
          course:courses(id, title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DiscountCode[];
    },
  });
}

export function useValidateDiscountCode() {
  return useMutation({
    mutationFn: async ({
      code,
      courseId,
      amount,
    }: {
      code: string;
      courseId: string;
      amount: number;
    }) => {
      // Fetch the discount code
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", code.toUpperCase().trim())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        throw new Error("Invalid discount code");
      }

      const discountCode = data as DiscountCode;

      // Check if code is valid for this course
      if (discountCode.course_id && discountCode.course_id !== courseId) {
        throw new Error("This code is not valid for this course");
      }

      // Check validity dates
      const now = new Date();
      if (discountCode.valid_from && new Date(discountCode.valid_from) > now) {
        throw new Error("This code is not yet valid");
      }
      if (discountCode.valid_until && new Date(discountCode.valid_until) < now) {
        throw new Error("This code has expired");
      }

      // Check usage limits
      if (discountCode.max_uses && discountCode.current_uses >= discountCode.max_uses) {
        throw new Error("This code has reached its usage limit");
      }

      // Check minimum purchase amount
      if (discountCode.min_purchase_amount && amount < discountCode.min_purchase_amount) {
        throw new Error(`Minimum purchase amount is ₦${discountCode.min_purchase_amount.toLocaleString()}`);
      }

      // Calculate discount
      let discountAmount: number;
      if (discountCode.discount_type === "percentage") {
        discountAmount = (amount * discountCode.discount_value) / 100;
      } else {
        discountAmount = Math.min(discountCode.discount_value, amount);
      }

      const finalAmount = Math.max(0, amount - discountAmount);

      return {
        discountCode,
        discountAmount,
        finalAmount,
      };
    },
  });
}

export function useCreateDiscountCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (discountCode: Partial<DiscountCode>) => {
      const { data, error } = await supabase
        .from("discount_codes")
        .insert({
          code: discountCode.code?.toUpperCase().trim(),
          description: discountCode.description,
          discount_type: discountCode.discount_type || "percentage",
          discount_value: discountCode.discount_value,
          max_uses: discountCode.max_uses,
          min_purchase_amount: discountCode.min_purchase_amount,
          course_id: discountCode.course_id,
          is_active: discountCode.is_active ?? true,
          valid_from: discountCode.valid_from,
          valid_until: discountCode.valid_until,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
      toast.success("Discount code created");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create discount code");
    },
  });
}

export function useUpdateDiscountCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DiscountCode> & { id: string }) => {
      const { data, error } = await supabase
        .from("discount_codes")
        .update({
          code: updates.code?.toUpperCase().trim(),
          description: updates.description,
          discount_type: updates.discount_type,
          discount_value: updates.discount_value,
          max_uses: updates.max_uses,
          min_purchase_amount: updates.min_purchase_amount,
          course_id: updates.course_id,
          is_active: updates.is_active,
          valid_from: updates.valid_from,
          valid_until: updates.valid_until,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
      toast.success("Discount code updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update discount code");
    },
  });
}

export function useDeleteDiscountCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("discount_codes")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
      toast.success("Discount code deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete discount code");
    },
  });
}

export function useIncrementDiscountCodeUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Get current usage and increment
      const { data: current } = await supabase
        .from("discount_codes")
        .select("current_uses")
        .eq("id", id)
        .single();

      if (current) {
        const { error } = await supabase
          .from("discount_codes")
          .update({ current_uses: (current.current_uses || 0) + 1 })
          .eq("id", id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
    },
  });
}
