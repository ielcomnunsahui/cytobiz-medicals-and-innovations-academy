-- Create storage bucket for course thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-thumbnails', 'course-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Course thumbnails are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-thumbnails');

-- Create policy for admin upload
CREATE POLICY "Admins can upload course thumbnails"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'course-thumbnails' 
  AND public.is_admin(auth.uid())
);

-- Create policy for admin update
CREATE POLICY "Admins can update course thumbnails"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'course-thumbnails' 
  AND public.is_admin(auth.uid())
);

-- Create policy for admin delete
CREATE POLICY "Admins can delete course thumbnails"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'course-thumbnails' 
  AND public.is_admin(auth.uid())
);