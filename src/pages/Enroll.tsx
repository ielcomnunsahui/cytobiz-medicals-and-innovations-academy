import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  Upload,
  Zap,
  Copy,
  Check,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { useCourse } from "@/hooks/useCourses";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { ReceiptUpload } from "@/components/enrollment/ReceiptUpload";
import { PageTransition } from "@/components/PageTransition";

type Cohort = Tables<"cohorts">;
type RegistrationForm = Tables<"registration_forms">;
type RegistrationField = Tables<"registration_form_fields">;

type PaymentMethod = "stripe" | "paystack" | "bank_transfer";

type WizardStep = "cohort" | "registration" | "payment" | "done";

function getInitialStep(courseType: string | null | undefined): WizardStep {
  return courseType === "cohort" ? "cohort" : "registration";
}

const stepOrder: WizardStep[] = ["cohort", "registration", "payment", "done"];

function StepIndicator({ currentStep, courseType }: { currentStep: WizardStep; courseType: string | null }) {
  const steps = courseType === "cohort" 
    ? [
        { key: "cohort", label: "Cohort" },
        { key: "registration", label: "Details" },
        { key: "payment", label: "Payment" },
        { key: "done", label: "Complete" },
      ]
    : [
        { key: "registration", label: "Details" },
        { key: "payment", label: "Payment" },
        { key: "done", label: "Complete" },
      ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isComplete = index < currentIndex;
        return (
          <div key={step.key} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                isComplete
                  ? "bg-green-500 text-white"
                  : isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isComplete ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${isActive ? "font-medium text-foreground" : "text-muted-foreground"}`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${isComplete ? "bg-green-500" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Enroll() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const { data: course, isLoading: courseLoading } = useCourse(slug);
  const { data: settings } = useSiteSettings();

  const [step, setStep] = useState<WizardStep>("registration");
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submittedEnrollmentId, setSubmittedEnrollmentId] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Keep step in sync once course loads.
  useEffect(() => {
    if (!course) return;
    setStep((prev) => {
      if (prev === "done") return prev;
      return getInitialStep(course.course_type);
    });
  }, [course]);

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
    enabled: !!course?.id,
  });

  const { data: activeForm, isLoading: formLoading } = useQuery({
    queryKey: ["enroll-active-form", course?.id, course?.course_type],
    queryFn: async () => {
      if (!course?.id) return null as RegistrationForm | null;

      // Prefer course-specific form; fallback to course_type form.
      const { data: byCourse, error: byCourseError } = await supabase
        .from("registration_forms")
        .select("*")
        .eq("is_active", true)
        .eq("course_id", course.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (byCourseError) throw byCourseError;
      if (byCourse?.[0]) return byCourse[0] as RegistrationForm;

      if (!course.course_type) return null;
      const { data: byType, error: byTypeError } = await supabase
        .from("registration_forms")
        .select("*")
        .eq("is_active", true)
        .eq("course_type", course.course_type)
        .order("created_at", { ascending: false })
        .limit(1);
      if (byTypeError) throw byTypeError;
      return (byType?.[0] ?? null) as RegistrationForm | null;
    },
    enabled: !!course?.id,
  });

  const { data: fields, isLoading: fieldsLoading } = useQuery({
    queryKey: ["enroll-form-fields", activeForm?.id],
    queryFn: async () => {
      if (!activeForm?.id) return [] as RegistrationField[];
      const { data, error } = await supabase
        .from("registration_form_fields")
        .select("*")
        .eq("form_id", activeForm.id)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data || []) as RegistrationField[];
    },
    enabled: !!activeForm?.id,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to enroll.");
      if (!course) throw new Error("Course not found.");
      if (!activeForm) throw new Error("No active registration form is configured for this course.");
      if (course.course_type === "cohort" && !selectedCohortId) {
        throw new Error("Please select a cohort.");
      }
      if (!paymentMethod) throw new Error("Please select a payment method.");

      // Basic required fields validation.
      for (const field of fields || []) {
        if (!field.required) continue;
        const v = formData[field.field_key];
        if (field.field_type === "checkbox") {
          if (!v) throw new Error(`Please check: ${field.label}`);
        } else if (v === undefined || v === null || String(v).trim() === "") {
          throw new Error(`Please fill in: ${field.label}`);
        }
      }

      const { data: submission, error: submissionError } = await supabase
        .from("registration_submissions")
        .insert({
          user_id: user.id,
          course_id: course.id,
          cohort_id: selectedCohortId,
          form_id: activeForm.id,
          data: formData,
        } as any)
        .select("*")
        .single();
      if (submissionError) throw submissionError;

      const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .insert({
          user_id: user.id,
          course_id: course.id,
          cohort_id: selectedCohortId,
          status: "pending",
          payment_method: paymentMethod,
          payment_amount: course.price ?? 0,
          payment_currency: "USD",
          registration_submission_id: submission.id,
          receipt_url: receiptUrl,
          payment_submitted_at: receiptUrl ? new Date().toISOString() : null,
        } as any)
        .select("*")
        .single();
      if (enrollmentError) throw enrollmentError;
      return enrollment as Tables<"enrollments">;
    },
    onSuccess: (enrollment) => {
      setSubmittedEnrollmentId(enrollment.id);
      setStep("done");
      toast.success("Enrollment submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit enrollment");
    },
  });

  const isBusy = authLoading || courseLoading;

  // Payment settings
  const stripeEnabled = settings?.payment_stripe_enabled === "true";
  const paystackEnabled = settings?.payment_paystack_enabled === "true";
  const bankTransferEnabled = settings?.payment_bank_transfer_enabled === "true";

  const bankName = settings?.bank_transfer_bank_name || "";
  const accountName = settings?.bank_transfer_account_name || "";
  const accountNumber = settings?.bank_transfer_account_number || "";
  const routingNumber = settings?.bank_transfer_routing_number || "";
  const swiftCode = settings?.bank_transfer_swift_code || "";
  const bankInstructions = settings?.bank_transfer_payment_instructions || "";

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const availablePaymentMethods = [
    stripeEnabled && { id: "stripe" as const, label: "Credit Card (Stripe)", icon: CreditCard, color: "purple" },
    paystackEnabled && { id: "paystack" as const, label: "Paystack", icon: Zap, color: "blue" },
    bankTransferEnabled && { id: "bank_transfer" as const, label: "Bank Transfer", icon: Building2, color: "green" },
  ].filter(Boolean) as { id: PaymentMethod; label: string; icon: any; color: string }[];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 pt-20 pb-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="mb-6 flex items-center justify-between gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="text-sm text-muted-foreground">
                <Link to="/courses" className="hover:underline">
                  Courses
                </Link>
                {course?.title ? <span> / {course.title}</span> : null}
              </div>
            </div>

            {/* Step Indicator */}
            {course && step !== "done" && (
              <StepIndicator currentStep={step} courseType={course.course_type} />
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl">
                          {step === "done" ? "Enrollment Complete!" : "Enroll in Course"}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {course ? course.title : "Loading course..."}
                        </CardDescription>
                      </div>
                      {course?.course_type ? (
                        <Badge variant="secondary" className="capitalize">
                          {course.course_type === "cohort" ? "Cohort" : "Self-paced"}
                        </Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!user && !isBusy ? (
                      <div className="rounded-lg border border-border bg-muted/30 p-6">
                        <p className="text-foreground mb-4">
                          Please log in or create an account to continue your enrollment.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Button asChild>
                            <Link to="/login">Log in</Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link to="/signup">Create account</Link>
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {isBusy ? (
                      <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading enrollment...
                      </div>
                    ) : null}

                    {!isBusy && user && course ? (
                      <div className="space-y-6">
                        {/* Step: Cohort */}
                        {step === "cohort" && (
                          <div className="space-y-4">
                            <div>
                              <h2 className="text-lg font-semibold text-foreground">Choose your cohort</h2>
                              <p className="text-sm text-muted-foreground mt-1">
                                Select the cohort start date that fits your schedule.
                              </p>
                            </div>
                            {cohortsLoading ? (
                              <div className="flex items-center gap-2 text-muted-foreground py-4">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading cohorts...
                              </div>
                            ) : cohorts?.length === 0 ? (
                              <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                                No cohorts are currently available for this course.
                              </div>
                            ) : (
                              <div className="grid gap-3">
                                {cohorts?.map((c) => (
                                  <button
                                    key={c.id}
                                    onClick={() => setSelectedCohortId(c.id)}
                                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                                      selectedCohortId === c.id
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                        : "border-border hover:border-primary/50"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="font-medium text-foreground">{c.title}</div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                          {format(new Date(c.start_date), "MMMM d, yyyy")} —{" "}
                                          {format(new Date(c.end_date), "MMMM d, yyyy")}
                                        </div>
                                      </div>
                                      {c.max_students && (
                                        <Badge variant="outline">{c.max_students} spots</Badge>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="flex justify-end pt-4">
                              <Button onClick={() => setStep("registration")} disabled={!selectedCohortId}>
                                Continue
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Step: Registration */}
                        {step === "registration" && (
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-lg font-semibold text-foreground">Registration details</h2>
                              <p className="text-sm text-muted-foreground mt-1">
                                Complete the form below. Your submission will be reviewed.
                              </p>
                            </div>

                            {formLoading || fieldsLoading ? (
                              <div className="flex items-center gap-2 text-muted-foreground py-4">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading form...
                              </div>
                            ) : (fields || []).length === 0 ? (
                              <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                                No registration form is configured for this course yet.
                              </div>
                            ) : (
                              <div className="grid sm:grid-cols-2 gap-4">
                                {(fields || []).map((field) => {
                                  const value = formData[field.field_key] ?? "";
                                  const requiredMark = field.required ? " *" : "";

                                  if (field.field_type === "textarea") {
                                    return (
                                      <div key={field.id} className="sm:col-span-2 space-y-2">
                                        <Label>
                                          {field.label}
                                          {requiredMark}
                                        </Label>
                                        <Textarea
                                          placeholder={field.placeholder ?? ""}
                                          value={value}
                                          onChange={(e) =>
                                            setFormData((prev) => ({
                                              ...prev,
                                              [field.field_key]: e.target.value,
                                            }))
                                          }
                                        />
                                        {field.help_text && (
                                          <p className="text-xs text-muted-foreground">{field.help_text}</p>
                                        )}
                                      </div>
                                    );
                                  }

                                  if (field.field_type === "select" || field.field_type === "multiselect") {
                                    const opts = (field.options as any)?.items as string[] | undefined;
                                    return (
                                      <div key={field.id} className="space-y-2">
                                        <Label>
                                          {field.label}
                                          {requiredMark}
                                        </Label>
                                        <Select
                                          value={String(value) || "__placeholder__"}
                                          onValueChange={(v) =>
                                            setFormData((prev) => ({
                                              ...prev,
                                              [field.field_key]: v === "__placeholder__" ? "" : v,
                                            }))
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder={field.placeholder || "Select"} />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="__placeholder__" disabled>
                                              {field.placeholder || "Select an option"}
                                            </SelectItem>
                                            {(opts || []).map((o) => (
                                              <SelectItem key={o} value={o}>
                                                {o}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        {field.help_text && (
                                          <p className="text-xs text-muted-foreground">{field.help_text}</p>
                                        )}
                                      </div>
                                    );
                                  }

                                  if (field.field_type === "checkbox") {
                                    return (
                                      <div key={field.id} className="sm:col-span-2 flex items-start gap-3">
                                        <Checkbox
                                          id={field.field_key}
                                          checked={!!value}
                                          onCheckedChange={(checked) =>
                                            setFormData((prev) => ({
                                              ...prev,
                                              [field.field_key]: checked,
                                            }))
                                          }
                                        />
                                        <div className="space-y-1">
                                          <Label htmlFor={field.field_key} className="cursor-pointer">
                                            {field.label}
                                            {requiredMark}
                                          </Label>
                                          {field.help_text && (
                                            <p className="text-xs text-muted-foreground">{field.help_text}</p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div key={field.id} className="space-y-2">
                                      <Label>
                                        {field.label}
                                        {requiredMark}
                                      </Label>
                                      <Input
                                        type={field.field_type === "email" ? "email" : field.field_type === "phone" ? "tel" : field.field_type === "number" ? "number" : "text"}
                                        placeholder={field.placeholder ?? ""}
                                        value={value}
                                        onChange={(e) =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            [field.field_key]: e.target.value,
                                          }))
                                        }
                                      />
                                      {field.help_text && (
                                        <p className="text-xs text-muted-foreground">{field.help_text}</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-3 pt-4">
                              {course.course_type === "cohort" ? (
                                <Button variant="outline" onClick={() => setStep("cohort")}>
                                  <ArrowLeft className="w-4 h-4 mr-2" />
                                  Back
                                </Button>
                              ) : (
                                <div />
                              )}
                              <Button onClick={() => setStep("payment")}>
                                Continue to Payment
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Step: Payment */}
                        {step === "payment" && (
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-lg font-semibold text-foreground">Payment method</h2>
                              <p className="text-sm text-muted-foreground mt-1">
                                Select how you'd like to pay for this course.
                              </p>
                            </div>

                            {/* Course Price */}
                            <div className="rounded-lg border border-border bg-muted/30 p-4">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Course Fee</span>
                                <span className="text-2xl font-bold text-foreground">
                                  ${course.price?.toFixed(2) || "0.00"}
                                </span>
                              </div>
                            </div>

                            {/* Payment Method Selection */}
                            {availablePaymentMethods.length === 0 ? (
                              <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                                No payment methods are currently configured.
                              </div>
                            ) : (
                              <div className="grid gap-3">
                                {availablePaymentMethods.map((method) => {
                                  const Icon = method.icon;
                                  const isSelected = paymentMethod === method.id;
                                  return (
                                    <button
                                      key={method.id}
                                      onClick={() => setPaymentMethod(method.id)}
                                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                                        isSelected
                                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                          : "border-border hover:border-primary/50"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${method.color}-100 dark:bg-${method.color}-900/30`}
                                        >
                                          <Icon className={`w-5 h-5 text-${method.color}-600 dark:text-${method.color}-400`} />
                                        </div>
                                        <span className="font-medium text-foreground">{method.label}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Bank Transfer Details */}
                            {paymentMethod === "bank_transfer" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="space-y-4"
                              >
                                <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                                  <h3 className="font-medium text-foreground flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Bank Account Details
                                  </h3>
                                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground">Bank Name</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-foreground">{bankName || "—"}</span>
                                        {bankName && (
                                          <button
                                            onClick={() => copyToClipboard(bankName, "bank")}
                                            className="text-muted-foreground hover:text-foreground"
                                          >
                                            {copiedField === "bank" ? (
                                              <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                              <Copy className="w-4 h-4" />
                                            )}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground">Account Name</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-foreground">{accountName || "—"}</span>
                                        {accountName && (
                                          <button
                                            onClick={() => copyToClipboard(accountName, "name")}
                                            className="text-muted-foreground hover:text-foreground"
                                          >
                                            {copiedField === "name" ? (
                                              <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                              <Copy className="w-4 h-4" />
                                            )}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground">Account Number</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-foreground font-mono">
                                          {accountNumber || "—"}
                                        </span>
                                        {accountNumber && (
                                          <button
                                            onClick={() => copyToClipboard(accountNumber, "number")}
                                            className="text-muted-foreground hover:text-foreground"
                                          >
                                            {copiedField === "number" ? (
                                              <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                              <Copy className="w-4 h-4" />
                                            )}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    {routingNumber && (
                                      <div className="space-y-1">
                                        <span className="text-muted-foreground">Routing Number</span>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-foreground font-mono">{routingNumber}</span>
                                          <button
                                            onClick={() => copyToClipboard(routingNumber, "routing")}
                                            className="text-muted-foreground hover:text-foreground"
                                          >
                                            {copiedField === "routing" ? (
                                              <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                              <Copy className="w-4 h-4" />
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                    {swiftCode && (
                                      <div className="space-y-1">
                                        <span className="text-muted-foreground">SWIFT Code</span>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-foreground font-mono">{swiftCode}</span>
                                          <button
                                            onClick={() => copyToClipboard(swiftCode, "swift")}
                                            className="text-muted-foreground hover:text-foreground"
                                          >
                                            {copiedField === "swift" ? (
                                              <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                              <Copy className="w-4 h-4" />
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {bankInstructions && (
                                    <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted/50 rounded-lg">
                                      {bankInstructions}
                                    </p>
                                  )}
                                </div>

                                {/* Receipt Upload */}
                                <div className="space-y-2">
                                  <Label>Upload Payment Proof *</Label>
                                  <ReceiptUpload
                                    onUploadComplete={(url) => setReceiptUrl(url)}
                                    existingUrl={receiptUrl}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Upload a screenshot or photo of your payment confirmation.
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            <div className="flex items-center justify-between gap-3 pt-4">
                              <Button variant="outline" onClick={() => setStep("registration")}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                              </Button>
                              <Button
                                onClick={() => submitMutation.mutate()}
                                disabled={
                                  submitMutation.isPending ||
                                  !paymentMethod ||
                                  (paymentMethod === "bank_transfer" && !receiptUrl)
                                }
                              >
                                {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Submit Enrollment
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Step: Done */}
                        {step === "done" && (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto flex items-center justify-center mb-6">
                              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                              Enrollment Submitted!
                            </h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                              {paymentMethod === "bank_transfer"
                                ? "Your enrollment is pending review. We'll verify your payment and notify you via email once approved."
                                : "Your enrollment has been submitted. You'll receive a confirmation email shortly."}
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                              <Button asChild>
                                <Link to="/my-enrollments">View My Enrollments</Link>
                              </Button>
                              <Button variant="outline" asChild>
                                <Link to="/courses">Browse More Courses</Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
