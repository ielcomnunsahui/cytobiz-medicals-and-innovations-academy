import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Zap,
  Building2,
  Copy,
  Check,
  Upload,
  AlertCircle,
  Tag,
  Loader2,
  X,
  Award,
  BookOpen,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { ReceiptUpload } from "@/components/enrollment/ReceiptUpload";
import { useValidateDiscountCode, DiscountCode } from "@/hooks/useDiscountCodes";
import type { Tables } from "@/integrations/supabase/types";
import type { CourseAccessSettings } from "@/hooks/useCourseAccess";

type PaymentMethod = "stripe" | "paystack" | "bank_transfer";

export type PaymentScenario = 
  | "free_all"           // Everything is free -no payment needed
  | "paid_content"       // Content is paid (course enrollment fee)
  | "certificate_only"   // Content is free, but certificate is paid
  | "content_and_cert";  // Content paid, certificate also paid separately

interface PaymentStepProps {
  course: Tables<"courses">;
  paymentMethod: PaymentMethod | null;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  receiptUrl: string | null;
  onReceiptUploaded: (url: string) => void;
  settings: Record<string, string | undefined>;
  errors: Record<string, string>;
  appliedDiscount: { code: DiscountCode; discountAmount: number; finalAmount: number } | null;
  onApplyDiscount: (discount: { code: DiscountCode; discountAmount: number; finalAmount: number } | null) => void;
  accessSettings?: CourseAccessSettings | null;
  paymentScenario?: PaymentScenario;
}

const PAYMENT_METHODS = [
  { id: "stripe" as const, label: "Credit Card (Stripe)", icon: CreditCard, description: "Pay securely with your credit or debit card" },
  { id: "paystack" as const, label: "Paystack", icon: Zap, description: "Fast payment with Paystack" },
  { id: "bank_transfer" as const, label: "Bank Transfer", icon: Building2, description: "Transfer directly to our bank account" },
];

export function PaymentStep({
  course,
  paymentMethod,
  onSelectPaymentMethod,
  receiptUrl,
  onReceiptUploaded,
  settings,
  errors,
  appliedDiscount,
  onApplyDiscount,
  accessSettings,
  paymentScenario: providedScenario,
}: PaymentStepProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  
  const validateDiscountMutation = useValidateDiscountCode();

  const price = course.price || 0;
  const certificateFee = accessSettings?.certificate_fee || 5000;
  
  // Determine the payment scenario based on access settings
  const paymentScenario: PaymentScenario = providedScenario || (() => {
    const contentFree = !accessSettings || accessSettings.content_access === 'free' || price === 0;
    const certFree = !accessSettings || accessSettings.certificate_access === 'free' || accessSettings.certificate_access === 'disabled';
    
    if (contentFree && certFree) return "free_all";
    if (contentFree && !certFree) return "certificate_only";
    if (!contentFree && !certFree) return "content_and_cert";
    return "paid_content";
  })();
  
  const isFree = paymentScenario === "free_all";
  const isCertificateOnly = paymentScenario === "certificate_only";
  
  // Calculate the appropriate price based on scenario
  const displayPrice = isCertificateOnly ? certificateFee : price;
  
  // Calculate final price with discount
  const finalPrice = appliedDiscount ? appliedDiscount.finalAmount : displayPrice;
  const discountAmount = appliedDiscount ? appliedDiscount.discountAmount : 0;

  // Payment settings
  const stripeEnabled = settings.payment_stripe_enabled === "true";
  const paystackEnabled = settings.payment_paystack_enabled === "true";
  const bankTransferEnabled = settings.payment_bank_transfer_enabled === "true";

  const bankName = settings.bank_transfer_bank_name || "";
  const accountName = settings.bank_transfer_account_name || "";
  const accountNumber = settings.bank_transfer_account_number || "";
  const routingNumber = settings.bank_transfer_routing_number || "";
  const swiftCode = settings.bank_transfer_swift_code || "";
  const bankInstructions = settings.bank_transfer_payment_instructions || "";

  const availableMethods = PAYMENT_METHODS.filter((method) => {
    if (method.id === "stripe") return stripeEnabled;
    if (method.id === "paystack") return paystackEnabled;
    if (method.id === "bank_transfer") return bankTransferEnabled;
    return false;
  });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleApplyDiscount = async () => {
    if (!discountCodeInput.trim()) {
      toast.error("Please enter a discount code");
      return;
    }

    try {
      const result = await validateDiscountMutation.mutateAsync({
        code: discountCodeInput,
        courseId: course.id,
        amount: displayPrice,
      });

      onApplyDiscount({
        code: result.discountCode,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
      });
      
      toast.success(`Discount applied! You save ₦${result.discountAmount.toLocaleString()}`);
      setDiscountCodeInput("");
    } catch (error: any) {
      toast.error(error.message || "Invalid discount code");
    }
  };

  const handleRemoveDiscount = () => {
    onApplyDiscount(null);
    toast.success("Discount removed");
  };

  // Render: Free All scenario
  if (isFree) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Confirm Enrollment</h2>
          <p className="text-sm text-muted-foreground">
            This course content is completely free. No payment is required.
          </p>
        </div>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Free Access</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Click "Submit Application" to complete your enrollment and start learning.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>What's included:</strong> Full access to course content and assessments at no cost.
              </p>
              {accessSettings?.certificate_access === 'disabled' && (
                <p className="mt-1">Certificates are not available for this course.</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Render: Certificate-only payment (content is free, certificate is paid)
  if (isCertificateOnly) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Enrollment & Certificate</h2>
          <p className="text-sm text-muted-foreground">
            Course content is free! Certificate is optional and available for a fee.
          </p>
        </div>

        {/* Free Content Badge */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Free Course Access</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                All lessons and assessments are free
              </p>
            </div>
            <Badge className="bg-emerald-500 text-white">FREE</Badge>
          </div>
        </Card>

        {/* Certificate Option */}
        <Card className="p-4 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Certificate of Completion</h3>
                <Badge variant="outline" className="text-amber-600 border-amber-300">Optional</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Receive an official certificate after completing all requirements. Payment can be made later from your enrollments page.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-bold text-amber-600">₦{certificateFee.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">one-time fee</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Note:</strong> You can enroll now for free and pay for the certificate later 
                when you're ready. The certificate fee can be paid from your "My Enrollments" page 
                after you complete the course requirements.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Render: Paid content scenario (with optional certificate info)
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
        <p className="text-sm text-muted-foreground">
          Select your preferred payment method to complete enrollment.
        </p>
      </div>

      {/* Price Display with Discount */}
      <Card className="p-4 bg-muted/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Course Fee</span>
            <span className={`font-medium ${discountAmount > 0 ? "text-muted-foreground line-through" : "text-foreground"}`}>
              ₦{displayPrice.toLocaleString()}
            </span>
          </div>
          
          {discountAmount > 0 && (
            <>
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>Discount ({appliedDiscount?.code.code})</span>
                </div>
                <span>-₦{discountAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ₦{finalPrice.toLocaleString()}
                </span>
              </div>
            </>
          )}
          
          {discountAmount === 0 && (
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-medium text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">
                ₦{displayPrice.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Certificate Info for content_and_cert scenario */}
      {paymentScenario === "content_and_cert" && accessSettings?.certificate_access === 'paid' && (
        <Card className="p-4 border-amber-200/50 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-950/10">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Certificate Available</p>
              <p className="text-muted-foreground mt-1">
                After completing the course, you can obtain a certificate for an additional fee of{" "}
                <span className="font-semibold text-amber-600">₦{certificateFee.toLocaleString()}</span>.
                This can be paid from your enrollments page after meeting the requirements.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Discount Code Input */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-foreground">Have a discount code?</h3>
          </div>
          
          {appliedDiscount ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="font-mono font-medium text-green-700 dark:text-green-300">
                  {appliedDiscount.code.code}
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                  {appliedDiscount.code.discount_type === "percentage"
                    ? `${appliedDiscount.code.discount_value}% OFF`
                    : `₦${appliedDiscount.code.discount_value.toLocaleString()} OFF`}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveDiscount}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={discountCodeInput}
                onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                className="font-mono uppercase"
                onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
              />
              <Button
                onClick={handleApplyDiscount}
                disabled={validateDiscountMutation.isPending}
                variant="secondary"
              >
                {validateDiscountMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Payment Methods */}
      {availableMethods.length === 0 ? (
        <Card className="p-6 border-dashed">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Payment Methods Available</h3>
            <p className="text-sm">
              Please contact support for payment options.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {availableMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = paymentMethod === method.id;

            return (
              <button
                key={method.id}
                onClick={() => onSelectPaymentMethod(method.id)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{method.label}</span>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-primary text-primary-foreground" : "border-2 border-muted"
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {errors.paymentMethod && (
        <p className="text-sm text-destructive">{errors.paymentMethod}</p>
      )}

      {/* Bank Transfer Details */}
      {paymentMethod === "bank_transfer" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4"
        >
          <Card className="p-5 space-y-4">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Bank Account Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {bankName && (
                <div className="space-y-1">
                  <span className="text-muted-foreground">Bank Name</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{bankName}</span>
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
                  </div>
                </div>
              )}
              {accountName && (
                <div className="space-y-1">
                  <span className="text-muted-foreground">Account Name</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{accountName}</span>
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
                  </div>
                </div>
              )}
              {accountNumber && (
                <div className="space-y-1">
                  <span className="text-muted-foreground">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground font-mono">{accountNumber}</span>
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
                  </div>
                </div>
              )}
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
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {bankInstructions}
                </p>
              </div>
            )}

            {/* Amount to pay reminder */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                <span className="text-sm text-muted-foreground">Amount to transfer</span>
                <span className="font-bold text-primary text-lg">
                  ₦{finalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Receipt Upload */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-foreground">Upload Payment Receipt</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              After making the transfer, please upload your payment receipt or screenshot as proof of payment.
            </p>
            <ReceiptUpload
              onUploadComplete={onReceiptUploaded}
              existingUrl={receiptUrl}
            />
            {errors.receiptUrl && (
              <p className="text-sm text-destructive">{errors.receiptUrl}</p>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}
