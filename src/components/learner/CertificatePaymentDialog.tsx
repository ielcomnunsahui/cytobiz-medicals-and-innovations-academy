import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  CreditCard,
  Building2,
  Loader2,
  CheckCircle,
  Upload,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useCreateCertificatePayment, useUpdateCertificatePayment } from "@/hooks/useCourseAccess";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CertificatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  cohortId?: string;
  courseName: string;
  certificateFee: number;
}

export function CertificatePaymentDialog({
  open,
  onOpenChange,
  courseId,
  cohortId,
  courseName,
  certificateFee,
}: CertificatePaymentDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: settings } = useSiteSettings();
  const createPayment = useCreateCertificatePayment();
  const updatePayment = useUpdateCertificatePayment();
  
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'bank_transfer'>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const bankName = settings?.bank_transfer_bank_name || "";
  const accountName = settings?.bank_transfer_account_name || "";
  const accountNumber = settings?.bank_transfer_account_number || "";

  const handlePaystackPayment = async () => {
    if (!user) {
      toast.error("Please log in to continue");
      return;
    }

    setIsProcessing(true);
    try {
      // Create payment record
      const payment = await createPayment.mutateAsync({
        courseId,
        cohortId,
        amount: certificateFee,
        paymentMethod: 'paystack',
      });

      // Initialize Paystack payment
      const response = await supabase.functions.invoke('initialize-certificate-payment', {
        body: {
          paymentId: payment.id,
          amount: certificateFee,
          email: user.email,
          courseName,
        },
      });

      if (response.error) throw response.error;

      const { authorization_url } = response.data;
      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (error: any) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBankTransferSubmit = async () => {
    if (!user) {
      toast.error("Please log in to continue");
      return;
    }

    setIsProcessing(true);
    try {
      // Create payment record
      const payment = await createPayment.mutateAsync({
        courseId,
        cohortId,
        amount: certificateFee,
        paymentMethod: 'bank_transfer',
      });

      setPaymentId(payment.id);
      setShowBankDetails(true);
    } catch (error: any) {
      toast.error(`Failed to create payment: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReceiptUpload = async () => {
    if (!receiptFile || !paymentId || !user) {
      toast.error("Please select a receipt file");
      return;
    }

    setIsProcessing(true);
    try {
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${user.id}/certificate-${paymentId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(fileName, receiptFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("payment-receipts")
        .getPublicUrl(fileName);

      // Update payment with receipt and mark as completed immediately
      await updatePayment.mutateAsync({
        paymentId,
        status: 'completed',
        receiptUrl: publicUrl,
      });

      // Auto-generate certificate immediately
      const verificationCode = `CYT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      await supabase
        .from("certificates")
        .upsert({
          user_id: user.id,
          course_id: courseId,
          verification_code: verificationCode,
        }, { onConflict: "user_id,course_id" });

      // Invalidate all related queries so Learn page refreshes
      queryClient.invalidateQueries({ queryKey: ["certificate"] });
      queryClient.invalidateQueries({ queryKey: ["certificate-payment"] });
      queryClient.invalidateQueries({ queryKey: ["certificates"] });

      toast.success("Payment confirmed! Your certificate is ready for download.");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (paymentMethod === 'paystack') {
      handlePaystackPayment();
    } else {
      handleBankTransferSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Unlock Your Certificate
          </DialogTitle>
          <DialogDescription>
            Complete payment to receive your certificate for {courseName}
          </DialogDescription>
        </DialogHeader>

        {!showBankDetails ? (
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Certificate Fee</p>
              <p className="text-3xl font-bold text-foreground">
                ₦{certificateFee.toLocaleString()}
              </p>
            </div>

            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="paystack" id="paystack" />
                  <Label htmlFor="paystack" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Pay with Card (Paystack)</p>
                      <p className="text-xs text-muted-foreground">Instant verification</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building2 className="w-4 h-4" />
                     <div>
                       <p className="font-medium">Bank Transfer</p>
                       <p className="text-xs text-muted-foreground">Upload receipt for instant certificate</p>
                     </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              className="w-full" 
              onClick={handleSubmit} 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Payment
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="font-medium text-sm">Bank Transfer Details</p>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Bank:</span> {bankName}</p>
                <p><span className="text-muted-foreground">Account Name:</span> {accountName}</p>
                <p><span className="text-muted-foreground">Account Number:</span> {accountNumber}</p>
                <p><span className="text-muted-foreground">Amount:</span> ₦{certificateFee.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Upload Payment Receipt</Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground">
                After making the transfer, upload your receipt for verification
              </p>
            </div>

            <Button 
              className="w-full" 
              onClick={handleReceiptUpload} 
              disabled={isProcessing || !receiptFile}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Receipt
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
