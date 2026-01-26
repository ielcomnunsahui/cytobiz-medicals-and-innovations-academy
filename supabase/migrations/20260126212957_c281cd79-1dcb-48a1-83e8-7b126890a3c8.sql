-- Create the Special Cohort for Public Health Project Management
INSERT INTO public.cohorts (
  course_id,
  title,
  start_date,
  end_date,
  max_students,
  is_active,
  application_deadline
) VALUES (
  '966f0d0c-0855-4aa2-821d-3c023d883cd0',
  'Public Health Project Management – Special Cohort',
  '2026-03-01',
  '2026-05-01',
  50,
  true,
  '2026-02-28 23:59:59+00'
);

-- Create access settings for the course
-- Content Access: FREE, Assessment Access: FREE, Certificate Access: PAID (₦3000)
-- Promotional Access: FREE (promo enabled)
INSERT INTO public.course_access_settings (
  course_id,
  content_access,
  assessment_access,
  certificate_access,
  certificate_fee,
  promo_enabled,
  is_legacy
) VALUES (
  '966f0d0c-0855-4aa2-821d-3c023d883cd0',
  'free',
  'free',
  'paid',
  3000,
  true,
  false
);