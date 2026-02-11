
-- Create storage bucket for lesson images
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-images', 'lesson-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS: Anyone can view lesson images (public bucket)
CREATE POLICY "Anyone can view lesson images"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-images');

-- RLS: Admins can upload lesson images
CREATE POLICY "Admins can upload lesson images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-images' AND public.is_admin(auth.uid()));

-- RLS: Admins can update lesson images
CREATE POLICY "Admins can update lesson images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lesson-images' AND public.is_admin(auth.uid()));

-- RLS: Admins can delete lesson images
CREATE POLICY "Admins can delete lesson images"
ON storage.objects FOR DELETE
USING (bucket_id = 'lesson-images' AND public.is_admin(auth.uid()));

-- Create storage bucket for SCORM packages
INSERT INTO storage.buckets (id, name, public)
VALUES ('scorm-packages', 'scorm-packages', true)
ON CONFLICT (id) DO NOTHING;

-- RLS: Anyone can view SCORM packages
CREATE POLICY "Anyone can view scorm packages"
ON storage.objects FOR SELECT
USING (bucket_id = 'scorm-packages');

-- RLS: Admins can manage SCORM packages
CREATE POLICY "Admins can upload scorm packages"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'scorm-packages' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete scorm packages"
ON storage.objects FOR DELETE
USING (bucket_id = 'scorm-packages' AND public.is_admin(auth.uid()));
