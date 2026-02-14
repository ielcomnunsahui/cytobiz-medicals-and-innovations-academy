
-- Alumni Network table
CREATE TABLE public.alumni (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  phone text,
  email text NOT NULL,
  linkedin_url text,
  location text,
  course_completed text,
  certificate_url text,
  photo_url text,
  field_of_practice text,
  area_of_expertise text,
  testimonial text,
  would_recommend boolean DEFAULT true,
  is_approved boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved alumni
CREATE POLICY "Anyone can view approved alumni"
ON public.alumni FOR SELECT
USING (is_approved = true);

-- Users can create their own alumni profile
CREATE POLICY "Users can create their own alumni profile"
ON public.alumni FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own alumni profile
CREATE POLICY "Users can update their own alumni profile"
ON public.alumni FOR UPDATE
USING (auth.uid() = user_id);

-- Users can view their own alumni profile
CREATE POLICY "Users can view own alumni profile"
ON public.alumni FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage all alumni
CREATE POLICY "Admins can manage all alumni"
ON public.alumni FOR ALL
USING (is_admin(auth.uid()));

-- Create alumni-photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('alumni-photos', 'alumni-photos', true);

-- Storage policies for alumni photos
CREATE POLICY "Anyone can view alumni photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'alumni-photos');

CREATE POLICY "Authenticated users can upload alumni photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'alumni-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own alumni photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'alumni-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger for updated_at
CREATE TRIGGER update_alumni_updated_at
BEFORE UPDATE ON public.alumni
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
