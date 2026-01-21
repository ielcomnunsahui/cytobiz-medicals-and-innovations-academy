-- Enums
DO $$ BEGIN
  CREATE TYPE public.enrollment_status AS ENUM ('pending', 'confirmed', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('stripe', 'paystack', 'bank_transfer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.form_field_type AS ENUM ('text', 'textarea', 'email', 'phone', 'number', 'select', 'multiselect', 'checkbox');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================
-- Enrollments additions
-- =========================
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS status public.enrollment_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_method public.payment_method,
  ADD COLUMN IF NOT EXISTS payment_provider_ref text,
  ADD COLUMN IF NOT EXISTS payment_amount numeric,
  ADD COLUMN IF NOT EXISTS payment_currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS payment_submitted_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS rejected_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS rejection_reason text;

CREATE UNIQUE INDEX IF NOT EXISTS enrollments_unique_selfpaced
  ON public.enrollments (user_id, course_id)
  WHERE cohort_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS enrollments_unique_cohort
  ON public.enrollments (user_id, cohort_id)
  WHERE cohort_id IS NOT NULL;

-- =========================
-- Registration Forms
-- =========================
CREATE TABLE IF NOT EXISTS public.registration_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  course_id uuid,
  course_type public.course_type,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.registration_form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES public.registration_forms(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  label text NOT NULL,
  field_type public.form_field_type NOT NULL DEFAULT 'text',
  required boolean NOT NULL DEFAULT false,
  placeholder text,
  help_text text,
  options jsonb,
  validation jsonb,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (form_id, field_key)
);

CREATE TABLE IF NOT EXISTS public.registration_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES public.registration_forms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  course_id uuid NOT NULL,
  cohort_id uuid,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Uniqueness across optional cohort (via unique index)
CREATE UNIQUE INDEX IF NOT EXISTS registration_submissions_unique_idx
  ON public.registration_submissions (user_id, course_id, COALESCE(cohort_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- Link submission to enrollment
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS registration_submission_id uuid REFERENCES public.registration_submissions(id) ON DELETE SET NULL;

-- =========================
-- updated_at triggers
-- =========================
DROP TRIGGER IF EXISTS trg_registration_forms_updated_at ON public.registration_forms;
CREATE TRIGGER trg_registration_forms_updated_at
BEFORE UPDATE ON public.registration_forms
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_registration_form_fields_updated_at ON public.registration_form_fields;
CREATE TRIGGER trg_registration_form_fields_updated_at
BEFORE UPDATE ON public.registration_form_fields
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_registration_submissions_updated_at ON public.registration_submissions;
CREATE TRIGGER trg_registration_submissions_updated_at
BEFORE UPDATE ON public.registration_submissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Prevent non-admins from changing enrollment status/admin fields
CREATE OR REPLACE FUNCTION public.validate_enrollment_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF public.is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Only admins can change enrollment status';
  END IF;

  IF NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
     OR NEW.rejected_at IS DISTINCT FROM OLD.rejected_at
     OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason THEN
    RAISE EXCEPTION 'Only admins can approve/reject enrollments';
  END IF;

  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Cannot change enrollment owner';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_enrollment_update ON public.enrollments;
CREATE TRIGGER trg_validate_enrollment_update
BEFORE UPDATE ON public.enrollments
FOR EACH ROW
EXECUTE FUNCTION public.validate_enrollment_update();

-- =========================
-- RLS
-- =========================
ALTER TABLE public.registration_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_submissions ENABLE ROW LEVEL SECURITY;

-- registration_forms
DROP POLICY IF EXISTS "Anyone can view active registration forms" ON public.registration_forms;
CREATE POLICY "Anyone can view active registration forms"
ON public.registration_forms
FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage registration forms" ON public.registration_forms;
CREATE POLICY "Admins can manage registration forms"
ON public.registration_forms
FOR ALL
USING (public.is_admin(auth.uid()));

-- registration_form_fields
DROP POLICY IF EXISTS "Anyone can view fields for active forms" ON public.registration_form_fields;
CREATE POLICY "Anyone can view fields for active forms"
ON public.registration_form_fields
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.registration_forms f
    WHERE f.id = registration_form_fields.form_id AND f.is_active = true
  )
);

DROP POLICY IF EXISTS "Admins can manage registration form fields" ON public.registration_form_fields;
CREATE POLICY "Admins can manage registration form fields"
ON public.registration_form_fields
FOR ALL
USING (public.is_admin(auth.uid()));

-- registration_submissions
DROP POLICY IF EXISTS "Users can create their own registration submissions" ON public.registration_submissions;
CREATE POLICY "Users can create their own registration submissions"
ON public.registration_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own registration submissions" ON public.registration_submissions;
CREATE POLICY "Users can view their own registration submissions"
ON public.registration_submissions
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own registration submissions" ON public.registration_submissions;
CREATE POLICY "Users can update their own registration submissions"
ON public.registration_submissions
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all registration submissions" ON public.registration_submissions;
CREATE POLICY "Admins can manage all registration submissions"
ON public.registration_submissions
FOR ALL
USING (public.is_admin(auth.uid()));

-- enrollments: tighten insert + allow update (payment submission)
DROP POLICY IF EXISTS "Users can insert their own enrollments" ON public.enrollments;
CREATE POLICY "Users can insert their own enrollments"
ON public.enrollments
FOR INSERT
WITH CHECK (auth.uid() = user_id AND status = 'pending');

DROP POLICY IF EXISTS "Users can update their own enrollments" ON public.enrollments;
CREATE POLICY "Users can update their own enrollments"
ON public.enrollments
FOR UPDATE
USING (auth.uid() = user_id);

-- =========================
-- Seed defaults
-- =========================
INSERT INTO public.site_settings (setting_key, setting_type, setting_value, description)
SELECT v.setting_key, v.setting_type, v.setting_value, v.description
FROM (
  VALUES
    ('payment.bank.account_name', 'text', 'Cytobiz Academy', 'Bank transfer account name'),
    ('payment.bank.account_number', 'text', '0000000000', 'Bank transfer account number'),
    ('payment.bank.bank_name', 'text', 'Your Bank', 'Bank name for transfers'),
    ('payment.currency', 'text', 'USD', 'Default payment currency')
) AS v(setting_key, setting_type, setting_value, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_settings s WHERE s.setting_key = v.setting_key
);

INSERT INTO public.registration_forms (name, course_type, is_active)
SELECT 'Cohort Registration (Default)', 'cohort', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.registration_forms f WHERE f.course_type = 'cohort' AND f.course_id IS NULL
);

DO $$
DECLARE
  _form_id uuid;
  _field_count int;
BEGIN
  SELECT id INTO _form_id
  FROM public.registration_forms
  WHERE course_type = 'cohort' AND course_id IS NULL
  ORDER BY created_at ASC
  LIMIT 1;

  IF _form_id IS NULL THEN
    RETURN;
  END IF;

  SELECT count(*) INTO _field_count
  FROM public.registration_form_fields
  WHERE form_id = _form_id;

  IF _field_count = 0 THEN
    INSERT INTO public.registration_form_fields (form_id, field_key, label, field_type, required, placeholder, order_index)
    VALUES
      (_form_id, 'full_name', 'Full Name', 'text', true, 'e.g., Dr. Jane Smith', 1),
      (_form_id, 'phone', 'Phone Number', 'phone', true, 'e.g., +234...', 2),
      (_form_id, 'profession', 'Profession', 'select', true, NULL, 3),
      (_form_id, 'organization', 'Organization', 'text', false, 'Hospital / Clinic / Company', 4);

    UPDATE public.registration_form_fields
    SET options = jsonb_build_object('choices', jsonb_build_array(
      'Doctor','Nurse','Pharmacist','Public Health','Researcher','Other'
    ))
    WHERE form_id = _form_id AND field_key = 'profession';
  END IF;
END $$;
