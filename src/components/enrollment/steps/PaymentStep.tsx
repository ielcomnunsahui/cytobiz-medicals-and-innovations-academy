import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Zap,
  Building2,
  Copy,
  Check,
  Upload,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ReceiptUpload } from "@/components/enrollment/ReceiptUpload";
import type { Tables } from "@/integrations/supabase/types";

type PaymentMethod = "stripe" | "paystack" | "bank_transfer";

interface PaymentStepProps {
  course: Tables<"courses">;
  paymentMethod: PaymentMethod | null;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  receiptUrl: string | null;
  onReceiptUploaded: (url: string) => void;
  settings: Record<string, string | undefined>;
  errors: Record<string, string>;
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
}: PaymentStepProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const price = course.price || 0;
  const discountedPrice = price * 0.5;
  const isFree = price === 0;

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

  if (isFree) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Confirm Enrollment</h2>
          <p className="text-sm text-muted-foreground">
            This is a free course. No payment is required.
          </p>
        </div>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">Free Course</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Click "Submit Application" to complete your enrollment.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
        <p className="text-sm text-muted-foreground">
          Select your preferred payment method to complete enrollment.
        </p>
      </div>

      {/* Price Display */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Amount</span>
          <div className="text-right">
            <span className="text-muted-foreground line-through text-sm mr-2">
              ₦{price.toLocaleString()}
            </span>
            <span className="text-2xl font-bold text-primary">
              ₦{discountedPrice.toLocaleString()}
            </span>
          </div>
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
