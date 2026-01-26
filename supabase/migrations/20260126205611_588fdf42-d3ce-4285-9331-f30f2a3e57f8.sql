-- Create enums for access control modes
CREATE TYPE public.content_access_mode AS ENUM ('free', 'paid_before_access');
CREATE TYPE public.assessment_access_mode AS ENUM ('free', 'paid', 'locked');
CREATE TYPE public.certificate_access_mode AS ENUM ('free', 'paid', 'disabled');

-- Create platform-level default settings table
CREATE TABLE public.platform_access_defaults (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_access content_access_mode NOT NULL DEFAULT 'free',
  assessment_access assessment_access_mode NOT NULL DEFAULT 'free',
  certificate_access certificate_access_mode NOT NULL DEFAULT 'paid',
  default_certificate_fee numeric DEFAULT 5000,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Insert platform defaults
INSERT INTO public.platform_access_defaults (content_access, assessment_access, certificate_access, default_certificate_fee)
VALUES ('free', 'free', 'paid', 5000);

-- Create course access settings table
CREATE TABLE public.course_access_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE UNIQUE,
  content_access content_access_mode NOT NULL DEFAULT 'free',
  assessment_access assessment_access_mode NOT NULL DEFAULT 'free',
  certificate_access certificate_access_mode NOT NULL DEFAULT 'paid',
  certificate_fee numeric DEFAULT 5000,
  promo_enabled boolean DEFAULT false,
  promo_expiry timestamp with time zone,
  is_legacy boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create cohort access overrides table
CREATE TABLE public.cohort_access_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE UNIQUE,
  content_access content_access_mode,
  assessment_access assessment_access_mode,
  certificate_access certificate_access_mode,
  certificate_fee numeric,
  promo_enabled boolean,
  promo_expiry timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create certificate payments table
CREATE TABLE public.certificate_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'NGN',
  payment_method public.payment_method,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_provider_ref text,
  receipt_url text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create access unlock records for manual overrides
CREATE TABLE public.access_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE SET NULL,
  unlock_type text NOT NULL CHECK (unlock_type IN ('content', 'assessment', 'certificate')),
  unlocked_by uuid REFERENCES auth.users(id),
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.platform_access_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_access_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_access_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_unlocks ENABLE ROW LEVEL SECURITY;

-- Platform access defaults policies
CREATE POLICY "Anyone can view platform defaults"
  ON public.platform_access_defaults FOR SELECT USING (true);

CREATE POLICY "Admins can manage platform defaults"
  ON public.platform_access_defaults FOR ALL USING (is_admin(auth.uid()));

-- Course access settings policies
CREATE POLICY "Anyone can view course access settings"
  ON public.course_access_settings FOR SELECT USING (true);

CREATE POLICY "Admins can manage course access settings"
  ON public.course_access_settings FOR ALL USING (is_admin(auth.uid()));

-- Cohort access overrides policies
CREATE POLICY "Anyone can view cohort access overrides"
  ON public.cohort_access_overrides FOR SELECT USING (true);

CREATE POLICY "Admins can manage cohort access overrides"
  ON public.cohort_access_overrides FOR ALL USING (is_admin(auth.uid()));

-- Certificate payments policies
CREATE POLICY "Users can view their own certificate payments"
  ON public.certificate_payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all certificate payments"
  ON public.certificate_payments FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Users can create their own certificate payments"
  ON public.certificate_payments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all certificate payments"
  ON public.certificate_payments FOR ALL USING (is_admin(auth.uid()));

-- Access unlocks policies
CREATE POLICY "Users can view their own unlocks"
  ON public.access_unlocks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all unlocks"
  ON public.access_unlocks FOR ALL USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_course_access_settings_updated_at
  BEFORE UPDATE ON public.course_access_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cohort_access_overrides_updated_at
  BEFORE UPDATE ON public.cohort_access_overrides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificate_payments_updated_at
  BEFORE UPDATE ON public.certificate_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get effective access settings for a course (with cohort override support)
CREATE OR REPLACE FUNCTION public.get_course_access_settings(
  _course_id uuid,
  _cohort_id uuid DEFAULT NULL
)
RETURNS TABLE (
  content_access content_access_mode,
  assessment_access assessment_access_mode,
  certificate_access certificate_access_mode,
  certificate_fee numeric,
  promo_enabled boolean,
  promo_expiry timestamp with time zone,
  is_legacy boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _platform platform_access_defaults%ROWTYPE;
  _course course_access_settings%ROWTYPE;
  _cohort cohort_access_overrides%ROWTYPE;
BEGIN
  -- Get platform defaults
  SELECT * INTO _platform FROM platform_access_defaults LIMIT 1;
  
  -- Get course settings
  SELECT * INTO _course FROM course_access_settings WHERE course_id = _course_id;
  
  -- Get cohort overrides if cohort_id provided
  IF _cohort_id IS NOT NULL THEN
    SELECT * INTO _cohort FROM cohort_access_overrides WHERE cohort_id = _cohort_id;
  END IF;
  
  -- Return effective settings with cohort > course > platform priority
  RETURN QUERY SELECT
    COALESCE(_cohort.content_access, _course.content_access, _platform.content_access),
    COALESCE(_cohort.assessment_access, _course.assessment_access, _platform.assessment_access),
    COALESCE(_cohort.certificate_access, _course.certificate_access, _platform.certificate_access),
    COALESCE(_cohort.certificate_fee, _course.certificate_fee, _platform.default_certificate_fee),
    COALESCE(_cohort.promo_enabled, _course.promo_enabled, false),
    COALESCE(_cohort.promo_expiry, _course.promo_expiry),
    COALESCE(_course.is_legacy, false);
END;
$$;

-- Function to check if user has unlocked specific access
CREATE OR REPLACE FUNCTION public.has_access_unlock(
  _user_id uuid,
  _course_id uuid,
  _unlock_type text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM access_unlocks
    WHERE user_id = _user_id
      AND course_id = _course_id
      AND unlock_type = _unlock_type
  )
$$;

-- Function to check if user has paid for certificate
CREATE OR REPLACE FUNCTION public.has_paid_certificate(
  _user_id uuid,
  _course_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM certificate_payments
    WHERE user_id = _user_id
      AND course_id = _course_id
      AND payment_status = 'completed'
  )
$$;

-- Mark existing courses as legacy
INSERT INTO public.course_access_settings (course_id, is_legacy, content_access, assessment_access, certificate_access)
SELECT id, true, 'free', 'free', 'paid'
FROM public.courses
ON CONFLICT (course_id) DO NOTHING;