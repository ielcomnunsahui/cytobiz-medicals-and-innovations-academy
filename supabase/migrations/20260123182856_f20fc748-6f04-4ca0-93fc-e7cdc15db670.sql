-- Create storage bucket for testimonial images
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view testimonial images (public bucket)
CREATE POLICY "Testimonial images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonials');

-- Allow admins to upload testimonial images
CREATE POLICY "Admins can upload testimonial images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'testimonials' 
  AND public.is_admin(auth.uid())
);

-- Allow admins to update testimonial images
CREATE POLICY "Admins can update testimonial images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'testimonials' 
  AND public.is_admin(auth.uid())
);

-- Allow admins to delete testimonial images
CREATE POLICY "Admins can delete testimonial images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'testimonials' 
  AND public.is_admin(auth.uid())
);