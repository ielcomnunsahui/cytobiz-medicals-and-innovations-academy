import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { useCourse, useCourses } from "@/hooks/useCourses";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useEnrollmentAutoSave } from "@/hooks/useEnrollmentAutoSave";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";

// Components
import { EnrollmentHeader } from "@/components/enrollment/EnrollmentHeader";
import {
  EnrollmentProgress,
  EnrollmentStep,
  getNextStep,
  getPrevStep,
  getSteps,
} from "@/components/enrollment/EnrollmentProgress";
import { CohortSelectionStep } from "@/components/enrollment/steps/CohortSelectionStep";
import { PersonalInfoStep } from "@/components/enrollment/steps/PersonalInfoStep";
import { BackgroundStep } from "@/components/enrollment/steps/BackgroundStep";
import { CourseSelectionStep } from "@/components/enrollment/steps/CourseSelectionStep";
import { MotivationStep } from "@/components/enrollment/steps/MotivationStep";
import { ReviewStep } from "@/components/enrollment/steps/ReviewStep";
import { PaymentStep } from "@/components/enrollment/steps/PaymentStep";

type Cohort = Tables<"cohorts">;
type PaymentMethod = "stripe" | "paystack" | "bank_transfer";

// Skeleton loader for the form
function EnrollmentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-muted rounded" />
        ))}
      </div>
    </div>
  );
}

export default function Enroll() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: course, isLoading: courseLoading } = useCourse(slug);
  const { data: allCourses } = useCourses();
  const { data: settings } = useSiteSettings();

  // State
  const [step, setStep] = useState<EnrollmentStep>("personal");
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<EnrollmentStep>>(new Set());
  const [submittedEnrollmentId, setSubmittedEnrollmentId] = useState<string | null>(null);
  const [showDraftLoaded, setShowDraftLoaded] = useState(false);

  // Auto-save hook
  const { loadDraft, clearDraft, saveDraft } = useEnrollmentAutoSave({
    courseId: course?.id || "",
    userId: user?.id || null,
    formData,
    cohortId: selectedCohortId,
    enabled: !!course?.id && !!user?.id && step !== "done",
  });

  // Fetch cohorts for cohort-based courses
  const { data: cohorts, isLoading: cohortsLoading } = useQuery({
    queryKey: ["enroll-cohorts", course?.id],
    queryFn: async () => {
      if (!course?.id) return [] as Cohort[];
      const { data, error } = await supabase
        .from("cohorts")
        .select("*")
        .eq("course_id", course.id)
        .eq("is_active", true)
        .order("start_date", { ascending: true });
      if (error) throw error;
      return (data || []) as Cohort[];
    },
    enabled: !!course?.id && course?.course_type === "cohort",
  });

  // Initialize step and load draft
  useEffect(() => {
    if (!course) return;

    // Set initial step
    const initialStep = course.course_type === "cohort" ? "cohort" : "personal";
    setStep(initialStep);

    // Pre-fill email from user profile
    if (user?.email && !formData.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }

    // Load draft if exists
    const draft = loadDraft();
    if (draft && draft.formData && Object.keys(draft.formData).length > 0) {
      setFormData((prev) => ({ ...prev, ...draft.formData }));
      if (draft.cohortId) {
        setSelectedCohortId(draft.cohortId);
      }
      setShowDraftLoaded(true);
      setTimeout(() => setShowDraftLoaded(false), 3000);
    }
  }, [course, user]);

  // Get selected cohort
  const selectedCohort = cohorts?.find((c) => c.id === selectedCohortId);

  // Calculate deadline (example: cohort start date or 7 days from now)
  const deadline = selectedCohort
    ? new Date(selectedCohort.start_date)
    : addDays(new Date(), 7);

  // Available courses for course selection step
  const availableCourses = allCourses?.filter((c) => c.status === "published") || [];

  // Update form field
  const updateField = useCallback((key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when field is updated
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  // Validate current step
  const validateStep = useCallback((currentStep: EnrollmentStep): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case "cohort":
        if (!selectedCohortId) {
          newErrors.cohort = "Please select a cohort";
        }
        break;

      case "personal":
        if (!formData.full_name?.trim()) {
          newErrors.full_name = "Full name is required";
        }
        if (!formData.email?.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!formData.phone?.trim()) {
          newErrors.phone = "Phone number is required";
        }
        if (!formData.gender) {
          newErrors.gender = "Please select your gender";
        }
        if (!formData.country) {
          newErrors.country = "Please select your country";
        }
        break;

      case "background":
        if (!formData.education) {
          newErrors.education = "Please select your educational background";
        }
        if (!formData.current_status) {
          newErrors.current_status = "Please select your current status";
        }
        if (formData.current_status === "Other" && !formData.current_status_other?.trim()) {
          newErrors.current_status_other = "Please specify your status";
        }
        break;

      case "course_selection":
        // Course is pre-selected
        break;

      case "motivation":
        if (!formData.motivation?.trim()) {
          newErrors.motivation = "Please tell us why you want to take this course";
        } else if (formData.motivation.trim().length < 20) {
          newErrors.motivation = "Please provide at least 20 characters";
        }
        if (!formData.discovery_source) {
          newErrors.discovery_source = "Please tell us how you heard about us";
        }
        if (formData.discovery_source === "other" && !formData.discovery_source_other?.trim()) {
          newErrors.discovery_source_other = "Please specify where you heard about us";
        }
        break;

      case "review":
        if (!formData.confirmation) {
          newErrors.confirmation = "Please confirm that your information is accurate";
        }
        break;

      case "payment":
        const isFree = !course?.price || course.price === 0;
        if (!isFree && !paymentMethod) {
          newErrors.paymentMethod = "Please select a payment method";
        }
        if (paymentMethod === "bank_transfer" && !receiptUrl) {
          newErrors.receiptUrl = "Please upload your payment receipt";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedCohortId, paymentMethod, receiptUrl, course]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!validateStep(step)) return;

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, step]));

    const nextStep = getNextStep(step, course?.course_type as "cohort" | "self_paced" | null);
    if (nextStep === "done") {
      // Handle submit
      submitMutation.mutate();
    } else {
      setStep(nextStep);
    }
  }, [step, course, validateStep]);

  const handleBack = useCallback(() => {
    const prevStep = getPrevStep(step, course?.course_type as "cohort" | "self_paced" | null);
    if (prevStep) {
      setStep(prevStep);
    }
  }, [step, course]);

  const handleEditStep = useCallback((targetStep: string) => {
    setStep(targetStep as EnrollmentStep);
  }, []);

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to enroll.");
      if (!course) throw new Error("Course not found.");

      // Create enrollment with form data stored in a JSON field
      const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .insert({
          user_id: user.id,
          course_id: course.id,
          cohort_id: selectedCohortId,
          status: "pending",
          payment_method: paymentMethod,
          payment_amount: course.price ?? 0,
          payment_currency: "NGN",
          receipt_url: receiptUrl,
          payment_submitted_at: receiptUrl ? new Date().toISOString() : null,
        } as any)
        .select("*")
        .single();

      if (enrollmentError) throw enrollmentError;

      // Store registration data
      const { error: submissionError } = await supabase
        .from("registration_submissions")
        .insert({
          user_id: user.id,
          course_id: course.id,
          cohort_id: selectedCohortId,
          form_id: course.id, // Using course_id as form_id for now
          data: formData,
        } as any);

      // Don't throw on submission error, enrollment is already created
      if (submissionError) {
        console.error("Failed to save form data:", submissionError);
      }

      return enrollment;
    },
    onSuccess: (enrollment) => {
      setSubmittedEnrollmentId(enrollment.id);
      setStep("done");
      clearDraft();
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit enrollment");
    },
  });

  const isLoading = authLoading || courseLoading;
  const currentSteps = getSteps(course?.course_type as "cohort" | "self_paced" | null);
  const isLastStep = step === currentSteps[currentSteps.length - 1]?.key;

  // Render content based on current step
  const renderStepContent = () => {
    if (step === "done") {
      return (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Application Submitted!
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Thank you for applying to {course?.title}. We've received your application and will review it shortly. You'll receive an email confirmation at {formData.email}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/my-enrollments">View My Enrollments</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/courses">Browse More Courses</Link>
            </Button>
          </div>
        </div>
      );
    }

    switch (step) {
      case "cohort":
        return (
          <CohortSelectionStep
            cohorts={cohorts || []}
            selectedCohortId={selectedCohortId}
            onSelectCohort={setSelectedCohortId}
            isLoading={cohortsLoading}
          />
        );

      case "personal":
        return (
          <PersonalInfoStep
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        );

      case "background":
        return (
          <BackgroundStep
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        );

      case "course_selection":
        return (
          <CourseSelectionStep
            formData={formData}
            updateField={updateField}
            errors={errors}
            currentCourse={course!}
            availableCourses={availableCourses.length > 0 ? availableCourses : [course!]}
          />
        );

      case "motivation":
        return (
          <MotivationStep
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        );

      case "review":
        return (
          <ReviewStep
            formData={formData}
            updateField={updateField}
            errors={errors}
            course={course!}
            cohort={selectedCohort}
            onEditStep={handleEditStep}
          />
        );

      case "payment":
        return (
          <PaymentStep
            course={course!}
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            receiptUrl={receiptUrl}
            onReceiptUploaded={setReceiptUrl}
            settings={settings || {}}
            errors={errors}
          />
        );

      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 pt-20 pb-16">
          <div className="container max-w-3xl mx-auto px-4">
            {/* Back Button */}
            <div className="mb-6">
              <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>

            {/* Draft Loaded Notification */}
            {showDraftLoaded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2 text-sm"
              >
                <Save className="w-4 h-4 text-primary" />
                <span className="text-foreground">Your previous progress has been restored.</span>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <Card className="p-6">
                <EnrollmentSkeleton />
              </Card>
            ) : !user ? (
              // Not logged in
              <Card className="p-6">
                <div className="text-center py-8">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Sign in to Continue
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Please log in or create an account to enroll in this course.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link to={`/login?redirect=/enroll/${slug}`}>Log In</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={`/signup?redirect=/enroll/${slug}`}>Create Account</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ) : !course ? (
              // Course not found
              <Card className="p-6">
                <div className="text-center py-8">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Course Not Found
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    The course you're looking for doesn't exist or has been removed.
                  </p>
                  <Button asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                {step !== "done" && (
                  <>
                    <EnrollmentHeader
                      course={course}
                      cohort={selectedCohort}
                      deadline={deadline}
                    />

                    {/* Progress */}
                    <EnrollmentProgress
                      currentStep={step}
                      courseType={course.course_type as "cohort" | "self_paced" | null}
                      completedSteps={completedSteps}
                    />
                  </>
                )}

                {/* Form Card */}
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {renderStepContent()}
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Navigation Buttons */}
                {step !== "done" && (
                  <div className="flex items-center justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={!getPrevStep(step, course.course_type as "cohort" | "self_paced" | null)}
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={submitMutation.isPending}
                      className="gap-2"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : isLastStep ? (
                        <>
                          Submit Application
                          <Send className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
