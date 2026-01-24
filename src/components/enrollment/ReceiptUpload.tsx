import { useState, useEffect } from "react";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReceiptUploadProps {
  userId?: string;
  enrollmentId?: string;
  existingUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export function ReceiptUpload({
  userId,
  enrollmentId,
  existingUrl,
  onUploadComplete,
}: ReceiptUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  // Get the authenticated user's ID for RLS-compliant file paths
  useEffect(() => {
    const getAuthUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAuthUserId(user.id);
      }
    };
    getAuthUser();
  }, []);

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, WebP, or PDF file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Must have authenticated user for RLS
    const currentAuthUserId = authUserId || userId;
    if (!currentAuthUserId) {
      // Try to get user ID one more time
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to upload a receipt");
        return;
      }
      setAuthUserId(user.id);
    }

    const effectiveUserId = authUserId || userId;
    if (!effectiveUserId) {
      toast.error("Unable to verify user. Please refresh and try again.");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      // IMPORTANT: Use the authenticated user's ID as the folder name to comply with RLS
      const folder = effectiveUserId;
      const identifier = enrollmentId || `pending-${Date.now()}`;
      const fileName = `${folder}/${identifier}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("payment-receipts")
        .getPublicUrl(fileName);

      // If we have an enrollmentId, update the enrollment record
      if (enrollmentId) {
        const { error: updateError } = await supabase
          .from("enrollments")
          .update({ receipt_url: publicUrl })
          .eq("id", enrollmentId);

        if (updateError) throw updateError;
      }

      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
      toast.success("Receipt uploaded successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload receipt");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const displayUrl = existingUrl || previewUrl;

  if (displayUrl) {
    return (
      <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Receipt uploaded
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              Awaiting admin review
            </p>
          </div>
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 dark:text-green-400 hover:underline"
          >
            View
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed p-6 transition-colors",
        dragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
      />
      
      <div className="flex flex-col items-center text-center">
        {uploading ? (
          <>
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Upload payment receipt
            </p>
            <p className="text-xs text-muted-foreground">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, WebP, or PDF (max 5MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
}
