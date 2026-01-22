-- Create storage bucket for payment receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts', 'payment-receipts', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for payment-receipts bucket
CREATE POLICY "Users can upload their own receipts"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'payment-receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own receipts"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment-receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all receipts"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment-receipts' 
  AND public.is_admin(auth.uid())
);

-- Add receipt_url column to enrollments table (move from profiles to enrollments)
ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS receipt_url text;

-- Create a comment for the column
COMMENT ON COLUMN public.enrollments.receipt_url IS 'URL to the payment receipt uploaded by the user for bank transfer payments';