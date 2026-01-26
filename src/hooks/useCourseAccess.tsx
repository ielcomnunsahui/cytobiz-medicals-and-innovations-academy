import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type ContentAccessMode = 'free' | 'paid_before_access';
export type AssessmentAccessMode = 'free' | 'paid' | 'locked';
export type CertificateAccessMode = 'free' | 'paid' | 'disabled';

export interface CourseAccessSettings {
  content_access: ContentAccessMode;
  assessment_access: AssessmentAccessMode;
  certificate_access: CertificateAccessMode;
  certificate_fee: number;
  promo_enabled: boolean;
  promo_expiry: string | null;
  is_legacy: boolean;
}

export interface AccessStatus {
  content: {
    mode: ContentAccessMode;
    hasAccess: boolean;
    reason: 'free' | 'paid' | 'unlocked' | 'requires_payment';
  };
  assessment: {
    mode: AssessmentAccessMode;
    hasAccess: boolean;
    reason: 'free' | 'paid' | 'unlocked' | 'requires_payment' | 'locked';
  };
  certificate: {
    mode: CertificateAccessMode;
    hasAccess: boolean;
    reason: 'free' | 'paid' | 'unlocked' | 'requires_payment' | 'disabled';
    fee: number;
  };
  isLegacy: boolean;
}

// Fetch platform defaults
export function usePlatformAccessDefaults() {
  return useQuery({
    queryKey: ["platform-access-defaults"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_access_defaults")
        .select("*")
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });
}

// Fetch course access settings
export function useCourseAccessSettings(courseId: string | undefined) {
  return useQuery({
    queryKey: ["course-access-settings", courseId],
    queryFn: async () => {
      if (!courseId) return null;
      
      const { data, error } = await supabase
        .from("course_access_settings")
        .select("*")
        .eq("course_id", courseId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
}

// Fetch cohort access overrides
export function useCohortAccessOverrides(cohortId: string | undefined) {
  return useQuery({
    queryKey: ["cohort-access-overrides", cohortId],
    queryFn: async () => {
      if (!cohortId) return null;
      
      const { data, error } = await supabase
        .from("cohort_access_overrides")
        .select("*")
        .eq("cohort_id", cohortId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!cohortId,
  });
}

// Get effective access settings with priority: cohort > course > platform
export function useEffectiveAccessSettings(
  courseId: string | undefined,
  cohortId: string | undefined
) {
  const { data: platform } = usePlatformAccessDefaults();
  const { data: course } = useCourseAccessSettings(courseId);
  const { data: cohort } = useCohortAccessOverrides(cohortId);

  const settings: CourseAccessSettings | null = courseId ? {
    content_access: cohort?.content_access || course?.content_access || platform?.content_access || 'free',
    assessment_access: cohort?.assessment_access || course?.assessment_access || platform?.assessment_access || 'free',
    certificate_access: cohort?.certificate_access || course?.certificate_access || platform?.certificate_access || 'paid',
    certificate_fee: cohort?.certificate_fee || course?.certificate_fee || platform?.default_certificate_fee || 5000,
    promo_enabled: cohort?.promo_enabled ?? course?.promo_enabled ?? false,
    promo_expiry: cohort?.promo_expiry || course?.promo_expiry || null,
    is_legacy: course?.is_legacy ?? false,
  } : null;

  return settings;
}

// Check user's access unlocks
export function useAccessUnlocks(courseId: string | undefined) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["access-unlocks", courseId, user?.id],
    queryFn: async () => {
      if (!courseId || !user?.id) return [];
      
      const { data, error } = await supabase
        .from("access_unlocks")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!courseId && !!user?.id,
  });
}

// Check certificate payment status
export function useCertificatePayment(courseId: string | undefined) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["certificate-payment", courseId, user?.id],
    queryFn: async () => {
      if (!courseId || !user?.id) return null;
      
      const { data, error } = await supabase
        .from("certificate_payments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId && !!user?.id,
  });
}

// Check enrollment payment status
export function useEnrollmentPayment(courseId: string | undefined) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["enrollment-payment", courseId, user?.id],
    queryFn: async () => {
      if (!courseId || !user?.id) return null;
      
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .eq("status", "confirmed")
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId && !!user?.id,
  });
}

// Main hook: Get complete access status for a user on a course
export function useCourseAccessStatus(
  courseId: string | undefined,
  cohortId?: string
): { accessStatus: AccessStatus | null; isLoading: boolean } {
  const settings = useEffectiveAccessSettings(courseId, cohortId);
  const { data: unlocks, isLoading: unlocksLoading } = useAccessUnlocks(courseId);
  const { data: certificatePayment, isLoading: certPaymentLoading } = useCertificatePayment(courseId);
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollmentPayment(courseId);

  const isLoading = unlocksLoading || certPaymentLoading || enrollmentLoading;

  if (!settings || !courseId) {
    return { accessStatus: null, isLoading };
  }

  const hasContentUnlock = unlocks?.some(u => u.unlock_type === 'content') || false;
  const hasAssessmentUnlock = unlocks?.some(u => u.unlock_type === 'assessment') || false;
  const hasCertificateUnlock = unlocks?.some(u => u.unlock_type === 'certificate') || false;
  const hasPaidEnrollment = enrollment?.status === 'confirmed' && (enrollment?.payment_amount || 0) > 0;
  const hasPaidCertificate = certificatePayment?.payment_status === 'completed';

  // Determine content access
  const contentAccess = (() => {
    if (settings.content_access === 'free') {
      return { mode: settings.content_access, hasAccess: true, reason: 'free' as const };
    }
    if (hasContentUnlock) {
      return { mode: settings.content_access, hasAccess: true, reason: 'unlocked' as const };
    }
    if (hasPaidEnrollment) {
      return { mode: settings.content_access, hasAccess: true, reason: 'paid' as const };
    }
    return { mode: settings.content_access, hasAccess: false, reason: 'requires_payment' as const };
  })();

  // Determine assessment access
  const assessmentAccess = (() => {
    if (settings.assessment_access === 'locked') {
      return { mode: settings.assessment_access, hasAccess: false, reason: 'locked' as const };
    }
    if (settings.assessment_access === 'free') {
      return { mode: settings.assessment_access, hasAccess: true, reason: 'free' as const };
    }
    if (hasAssessmentUnlock) {
      return { mode: settings.assessment_access, hasAccess: true, reason: 'unlocked' as const };
    }
    if (hasPaidEnrollment) {
      return { mode: settings.assessment_access, hasAccess: true, reason: 'paid' as const };
    }
    return { mode: settings.assessment_access, hasAccess: false, reason: 'requires_payment' as const };
  })();

  // Determine certificate access
  const certificateAccess = (() => {
    if (settings.certificate_access === 'disabled') {
      return { 
        mode: settings.certificate_access, 
        hasAccess: false, 
        reason: 'disabled' as const, 
        fee: 0 
      };
    }
    if (settings.certificate_access === 'free') {
      return { 
        mode: settings.certificate_access, 
        hasAccess: true, 
        reason: 'free' as const, 
        fee: 0 
      };
    }
    if (hasCertificateUnlock) {
      return { 
        mode: settings.certificate_access, 
        hasAccess: true, 
        reason: 'unlocked' as const, 
        fee: settings.certificate_fee 
      };
    }
    if (hasPaidCertificate) {
      return { 
        mode: settings.certificate_access, 
        hasAccess: true, 
        reason: 'paid' as const, 
        fee: settings.certificate_fee 
      };
    }
    return { 
      mode: settings.certificate_access, 
      hasAccess: false, 
      reason: 'requires_payment' as const, 
      fee: settings.certificate_fee 
    };
  })();

  return {
    accessStatus: {
      content: contentAccess,
      assessment: assessmentAccess,
      certificate: certificateAccess,
      isLegacy: settings.is_legacy,
    },
    isLoading,
  };
}

// Admin: Update course access settings
export function useUpdateCourseAccessSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      courseId,
      settings,
    }: {
      courseId: string;
      settings: Partial<{
        content_access: ContentAccessMode;
        assessment_access: AssessmentAccessMode;
        certificate_access: CertificateAccessMode;
        certificate_fee: number;
        promo_enabled: boolean;
        promo_expiry: string | null;
        is_legacy: boolean;
      }>;
    }) => {
      const { data, error } = await supabase
        .from("course_access_settings")
        .upsert({
          course_id: courseId,
          ...settings,
        }, { onConflict: 'course_id' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course-access-settings", variables.courseId] });
    },
  });
}

// Admin: Update cohort access overrides
export function useUpdateCohortAccessOverrides() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      cohortId,
      overrides,
    }: {
      cohortId: string;
      overrides: Partial<{
        content_access: ContentAccessMode | null;
        assessment_access: AssessmentAccessMode | null;
        certificate_access: CertificateAccessMode | null;
        certificate_fee: number | null;
        promo_enabled: boolean | null;
        promo_expiry: string | null;
      }>;
    }) => {
      const { data, error } = await supabase
        .from("cohort_access_overrides")
        .upsert({
          cohort_id: cohortId,
          ...overrides,
        }, { onConflict: 'cohort_id' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cohort-access-overrides", variables.cohortId] });
    },
  });
}

// Admin: Create access unlock
export function useCreateAccessUnlock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      courseId,
      cohortId,
      unlockType,
      reason,
    }: {
      userId: string;
      courseId: string;
      cohortId?: string;
      unlockType: 'content' | 'assessment' | 'certificate';
      reason?: string;
    }) => {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("access_unlocks")
        .insert({
          user_id: userId,
          course_id: courseId,
          cohort_id: cohortId,
          unlock_type: unlockType,
          unlocked_by: currentUser.user?.id,
          reason,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["access-unlocks", variables.courseId, variables.userId] });
    },
  });
}

// Create certificate payment
export function useCreateCertificatePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      courseId,
      cohortId,
      amount,
      paymentMethod,
    }: {
      courseId: string;
      cohortId?: string;
      amount: number;
      paymentMethod: 'stripe' | 'paystack' | 'bank_transfer';
    }) => {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("certificate_payments")
        .insert({
          user_id: currentUser.user.id,
          course_id: courseId,
          cohort_id: cohortId,
          amount,
          payment_method: paymentMethod,
          payment_status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["certificate-payment", variables.courseId] });
    },
  });
}

// Update certificate payment status
export function useUpdateCertificatePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      paymentId,
      status,
      providerRef,
      receiptUrl,
    }: {
      paymentId: string;
      status: 'pending' | 'completed' | 'failed';
      providerRef?: string;
      receiptUrl?: string;
    }) => {
      const { data, error } = await supabase
        .from("certificate_payments")
        .update({
          payment_status: status,
          payment_provider_ref: providerRef,
          receipt_url: receiptUrl,
          paid_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq("id", paymentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["certificate-payment", data.course_id] });
    },
  });
}

// Fetch all certificate payments (admin)
export function useAllCertificatePayments() {
  return useQuery({
    queryKey: ["all-certificate-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificate_payments")
        .select(`
          *,
          course:courses(title, slug),
          cohort:cohorts(title)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// Fetch access unlocks for a course (admin)
export function useAllAccessUnlocks(courseId?: string) {
  return useQuery({
    queryKey: ["all-access-unlocks", courseId],
    queryFn: async () => {
      let query = supabase
        .from("access_unlocks")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (courseId) {
        query = query.eq("course_id", courseId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
}
