-- Create discount_codes table
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL CHECK (discount_value > 0),
  max_uses integer,
  current_uses integer NOT NULL DEFAULT 0,
  min_purchase_amount numeric DEFAULT 0,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  valid_from timestamp with time zone DEFAULT now(),
  valid_until timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

-- Add application_deadline to cohorts
ALTER TABLE public.cohorts
ADD COLUMN IF NOT EXISTS application_deadline timestamp with time zone;

-- Add discount_code_id to enrollments to track which discount was used
ALTER TABLE public.enrollments
ADD COLUMN IF NOT EXISTS discount_code_id uuid REFERENCES public.discount_codes(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_amount numeric;

-- Enable RLS on discount_codes
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for discount_codes
CREATE POLICY "Anyone can view active discount codes"
ON public.discount_codes FOR SELECT
USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

CREATE POLICY "Admins can manage discount codes"
ON public.discount_codes FOR ALL
USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER trg_discount_codes_updated_at
BEFORE UPDATE ON public.discount_codes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster code lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_course ON public.discount_codes(course_id);