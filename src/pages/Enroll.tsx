import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, CreditCard, Landmark, Loader2, Upload } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function Enroll() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const { data: course, isLoading: courseLoading } = useCourse(slug);
  const { data: settings } = useSiteSettings();

  const [step, setStep] = useState<WizardStep>("registration");
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submittedEnrollmentId, setSubmittedEnrollmentId] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
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

      // Basic required fields validation.
      for (const field of fields || []) {
        if (!field.required) continue;
        const v = formData[field.field_key];
        if (v === undefined || v === null || String(v).trim() === "") {
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
        } as any)
        .select("*")
        .single();
      if (enrollmentError) throw enrollmentError;
      return enrollment as Tables<"enrollments">;
    },
    onSuccess: (enrollment) => {
      setSubmittedEnrollmentId(enrollment.id);
      setStep("done");
      toast.success("Enrollment submitted");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit enrollment");
    },
  });

  const isBusy = authLoading || courseLoading;

  const bankName = settings?.bank_transfer_bank_name || "";
  const accountName = settings?.bank_transfer_account_name || "";
  const accountNumber = settings?.bank_transfer_account_number || "";
  const bankInstructions = settings?.bank_transfer_payment_instructions || "";

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="container-wide">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="text-sm text-muted-foreground">
              <Link to="/courses" className="hover:underline">Courses</Link>
              {course?.title ? <span> / {course.title}</span> : null}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>Enroll</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {course ? course.title : "Loading course..."}
                      </p>
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
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <p className="text-sm text-foreground mb-3">
                        Please log in or create an account to continue your enrollment.
                      </p>
                      <div className="flex flex-wrap gap-2">
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading enrollment...
                    </div>
                  ) : null}

                  {!isBusy && user && course ? (
                    <div className="space-y-6">
                      {/* Step: Cohort */}
                      {step === "cohort" ? (
                        <div className="space-y-3">
                          <h2 className="text-lg font-semibold text-foreground">Choose your cohort</h2>
                          <p className="text-sm text-muted-foreground">
                            Select the cohort start date that fits your schedule.
                          </p>
                          {cohortsLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Loading cohorts...
                            </div>
                          ) : (
                            <Select value={selectedCohortId ?? ""} onValueChange={(v) => setSelectedCohortId(v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a cohort" />
                              </SelectTrigger>
                              <SelectContent>
                                {(cohorts || []).map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.title} — {format(new Date(c.start_date as any), "MMM d, yyyy")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          <div className="flex justify-end">
                            <Button
                              onClick={() => setStep("registration")}
                              disabled={!selectedCohortId}
                            >
                              Continue
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      {/* Step: Registration */}
                      {step === "registration" ? (
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-lg font-semibold text-foreground">Registration details</h2>
                            <p className="text-sm text-muted-foreground">
                              Complete the short form. Your submission will be reviewed for cohort enrollments.
                            </p>
                          </div>

                          {formLoading || fieldsLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Loading form...
                            </div>
                          ) : (fields || []).length === 0 ? (
                            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                              No registration form is configured yet.
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
                                          setFormData((prev) => ({ ...prev, [field.field_key]: e.target.value }))
                                        }
                                      />
                                      {field.help_text ? (
                                        <p className="text-xs text-muted-foreground">{field.help_text}</p>
                                      ) : null}
                                    </div>
                                  );
                                }

                                if (field.field_type === "select") {
                                  const opts = (field.options as any)?.options as string[] | undefined;
                                  return (
                                    <div key={field.id} className="space-y-2">
                                      <Label>
                                        {field.label}
                                        {requiredMark}
                                      </Label>
                                      <Select
                                        value={String(value)}
                                        onValueChange={(v) =>
                                          setFormData((prev) => ({ ...prev, [field.field_key]: v }))
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder={field.placeholder ?? "Select"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {(opts || []).map((o) => (
                                            <SelectItem key={o} value={o}>
                                              {o}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      {field.help_text ? (
                                        <p className="text-xs text-muted-foreground">{field.help_text}</p>
                                      ) : null}
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
                                      placeholder={field.placeholder ?? ""}
                                      value={value}
                                      onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, [field.field_key]: e.target.value }))
                                      }
                                    />
                                    {field.help_text ? (
                                      <p className="text-xs text-muted-foreground">{field.help_text}</p>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-3">
                            {course.course_type === "cohort" ? (
                              <Button variant="outline" onClick={() => setStep("cohort")}>
                                Back
                              </Button>
                            ) : (
                              <div />
                            )}
                            <Button onClick={() => setStep("payment")} disabled={(fields || []).length === 0}>
                              Continue to payment
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      {/* Step: Payment */}
                      {step === "payment" ? (
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-lg font-semibold text-foreground">Payment method</h2>
                            <p className="text-sm text-muted-foreground">
                              Choose how you want to pay. Your enrollment will be created in a pending state.
                            </p>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-3">
                            <Button
                              type="button"
                              variant={paymentMethod === "stripe" ? "default" : "outline"}
                              className="justify-start gap-2"
                              onClick={() => setPaymentMethod("stripe")}
                            >
                              <CreditCard className="w-4 h-4" />
                              Stripe
                            </Button>
                            <Button
                              type="button"
                              variant={paymentMethod === "paystack" ? "default" : "outline"}
                              className="justify-start gap-2"
                              onClick={() => setPaymentMethod("paystack")}
                            >
                              <CreditCard className="w-4 h-4" />
                              Paystack
                            </Button>
                            <Button
                              type="button"
                              variant={paymentMethod === "bank_transfer" ? "default" : "outline"}
                              className="justify-start gap-2"
                              onClick={() => setPaymentMethod("bank_transfer")}
                            >
                              <Landmark className="w-4 h-4" />
                              Bank transfer
                            </Button>
                          </div>

                          {paymentMethod === "bank_transfer" ? (
                            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                              <div className="text-sm text-foreground font-medium">Bank transfer details</div>
                              <div className="text-sm text-muted-foreground">
                                <div>Bank: {bankName || "—"}</div>
                                <div>Account Name: {accountName || "—"}</div>
                                <div>Account Number: {accountNumber || "—"}</div>
                              </div>
                              {bankInstructions ? (
                                <p className="text-sm text-muted-foreground">{bankInstructions}</p>
                              ) : null}
                              <p className="text-xs text-muted-foreground">
                                After you pay, an admin will review and confirm your enrollment.
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                              This is UI-only for now. We’ll connect {paymentMethod} payment confirmation via Edge
                              Functions next.
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-3">
                            <Button variant="outline" onClick={() => setStep("registration")}>Back</Button>
                            <Button
                              onClick={() => submitMutation.mutate()}
                              disabled={submitMutation.isPending}
                            >
                              {submitMutation.isPending ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                "Submit enrollment"
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      {/* Step: Done */}
                      {step === "done" ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-foreground">Enrollment Submitted!</h2>
                              <p className="text-sm text-muted-foreground">
                                Your enrollment is pending review. We'll notify you when it's confirmed.
                              </p>
                            </div>
                          </div>

                          {submittedEnrollmentId ? (
                            <p className="text-xs text-muted-foreground">
                              Reference: <span className="font-mono">{submittedEnrollmentId}</span>
                            </p>
                          ) : null}

                          {/* Receipt Upload for bank transfers */}
                          {paymentMethod === "bank_transfer" && submittedEnrollmentId && user && (
                            <div className="space-y-3">
                              <h3 className="text-sm font-medium text-foreground">
                                Upload Payment Receipt
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Upload your bank transfer receipt to speed up the approval process.
                              </p>
                              <ReceiptUpload
                                userId={user.id}
                                enrollmentId={submittedEnrollmentId}
                                existingUrl={receiptUrl}
                                onUploadComplete={(url) => {
                                  setReceiptUrl(url);
                                  queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
                                }}
                              />
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <Button asChild>
                              <Link to="/my-enrollments">View My Enrollments</Link>
                            </Button>
                            <Button variant="outline" asChild>
                              <Link to="/courses">Browse More Courses</Link>
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium text-foreground">{course?.price ? `$${course.price}` : "$0"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-foreground">Pending</span>
                  </div>
                  {course?.course_type === "cohort" ? (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Cohort</span>
                      <span className="font-medium text-foreground">
                        {selectedCohortId ? "Selected" : "Not selected"}
                      </span>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </PageTransition>
  );
}
