-- Create course_reviews table for student ratings and reviews
CREATE TABLE public.course_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Enable RLS
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view approved reviews"
ON public.course_reviews FOR SELECT
USING (is_approved = true);

CREATE POLICY "Users can view their own reviews"
ON public.course_reviews FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Enrolled users can create reviews"
ON public.course_reviews FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE enrollments.user_id = auth.uid()
    AND enrollments.course_id = course_reviews.course_id
  )
);

CREATE POLICY "Users can update their own reviews"
ON public.course_reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
ON public.course_reviews FOR ALL
USING (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_course_reviews_updated_at
BEFORE UPDATE ON public.course_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes
CREATE INDEX idx_course_reviews_course_id ON public.course_reviews(course_id);
CREATE INDEX idx_course_reviews_user_id ON public.course_reviews(user_id);
CREATE INDEX idx_course_reviews_approved ON public.course_reviews(is_approved) WHERE is_approved = true;