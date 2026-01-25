-- Add module locking setting to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS modules_locked_until_assessment boolean DEFAULT false;

-- Add time tracking to lesson_progress
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS time_spent_seconds integer DEFAULT 0;

-- Create assessments table
CREATE TABLE public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  pass_percentage integer NOT NULL DEFAULT 70,
  is_required boolean NOT NULL DEFAULT true,
  time_limit_minutes integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create assessment questions table
CREATE TABLE public.assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'multiple_choice',
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer text NOT NULL,
  points integer NOT NULL DEFAULT 1,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create assessment attempts table
CREATE TABLE public.assessment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  max_score integer NOT NULL DEFAULT 0,
  percentage numeric NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Create indexes for performance
CREATE INDEX idx_assessments_module_id ON public.assessments(module_id);
CREATE INDEX idx_assessment_questions_assessment_id ON public.assessment_questions(assessment_id);
CREATE INDEX idx_assessment_attempts_user_id ON public.assessment_attempts(user_id);
CREATE INDEX idx_assessment_attempts_assessment_id ON public.assessment_attempts(assessment_id);

-- Enable RLS on new tables
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;

-- RLS policies for assessments
CREATE POLICY "Admins can manage all assessments" 
  ON public.assessments FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Enrolled users can view assessments" 
  ON public.assessments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN enrollments e ON e.course_id = m.course_id
      WHERE m.id = assessments.module_id AND e.user_id = auth.uid()
    )
  );

-- RLS policies for assessment_questions
CREATE POLICY "Admins can manage all questions" 
  ON public.assessment_questions FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Enrolled users can view questions" 
  ON public.assessment_questions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM assessments a
      JOIN modules m ON m.id = a.module_id
      JOIN enrollments e ON e.course_id = m.course_id
      WHERE a.id = assessment_questions.assessment_id AND e.user_id = auth.uid()
    )
  );

-- RLS policies for assessment_attempts
CREATE POLICY "Admins can view all attempts" 
  ON public.assessment_attempts FOR SELECT 
  USING (is_admin(auth.uid()));

CREATE POLICY "Users can manage their own attempts" 
  ON public.assessment_attempts FOR ALL 
  USING (auth.uid() = user_id);

-- Update trigger for assessments
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if user has passed module assessment
CREATE OR REPLACE FUNCTION public.has_passed_module_assessment(_user_id uuid, _module_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM assessment_attempts aa
    JOIN assessments a ON a.id = aa.assessment_id
    WHERE aa.user_id = _user_id 
      AND a.module_id = _module_id 
      AND aa.passed = true
  )
$$;