-- Delete old unwanted site settings
DELETE FROM public.site_settings 
WHERE setting_key IN (
  'hero_headline', 
  'hero_subheadline', 
  'instagram_url', 
  'nursing_anthem_audio_url', 
  'nursing_anthem_lyrics', 
  'tiktok_url', 
  'twitter_url'
);

-- Insert sample courses with valid UUIDs
INSERT INTO public.courses (id, title, slug, description, short_description, category, level, course_type, status, price, duration_weeks, effort_hours_per_week, learning_outcomes, prerequisites, target_audience)
VALUES 
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'Healthcare Innovation Fundamentals',
    'healthcare-innovation-fundamentals',
    'Master the foundations of healthcare innovation. This comprehensive course covers design thinking, digital health trends, regulatory considerations, and practical implementation strategies for modern healthcare settings.',
    'Learn the essentials of healthcare innovation and digital transformation',
    'Healthcare Innovation',
    'beginner',
    'cohort',
    'published',
    299.00,
    8,
    5,
    ARRAY['Understand core healthcare innovation principles', 'Apply design thinking to health challenges', 'Navigate regulatory frameworks', 'Develop innovation proposals'],
    ARRAY['Basic understanding of healthcare systems', 'No prior innovation experience required'],
    ARRAY['Healthcare professionals', 'Hospital administrators', 'Health tech entrepreneurs', 'Medical students']
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f23456789012'::uuid,
    'Clinical Data Analytics',
    'clinical-data-analytics',
    'Dive deep into clinical data analytics and learn to extract actionable insights from healthcare data. Covers statistical methods, visualization, and machine learning applications in clinical settings.',
    'Transform clinical data into actionable healthcare insights',
    'Data Science',
    'intermediate',
    'self_paced',
    'published',
    399.00,
    12,
    6,
    ARRAY['Master clinical data analysis techniques', 'Build predictive models for patient outcomes', 'Create compelling data visualizations', 'Implement data-driven decision making'],
    ARRAY['Basic statistics knowledge', 'Familiarity with spreadsheets or databases'],
    ARRAY['Clinical researchers', 'Healthcare analysts', 'Quality improvement specialists', 'Public health professionals']
  ),
  (
    'c3d4e5f6-a7b8-9012-cdef-345678901234'::uuid,
    'Digital Health Leadership',
    'digital-health-leadership',
    'Develop leadership skills for the digital health era. Learn to lead digital transformation initiatives, manage cross-functional teams, and drive organizational change in healthcare settings.',
    'Lead digital transformation in healthcare organizations',
    'Leadership',
    'advanced',
    'cohort',
    'published',
    599.00,
    10,
    8,
    ARRAY['Lead digital health initiatives', 'Manage healthcare technology teams', 'Drive organizational change', 'Develop strategic digital roadmaps'],
    ARRAY['5+ years healthcare experience', 'Current or aspiring leadership role'],
    ARRAY['Healthcare executives', 'Department heads', 'Digital health managers', 'Chief medical officers']
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample cohorts
INSERT INTO public.cohorts (id, course_id, title, start_date, end_date, max_students, is_active)
VALUES
  (
    'd4e5f6a7-b8c9-0123-def0-456789012345'::uuid,
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'Spring 2026 Cohort',
    '2026-03-01',
    '2026-04-30',
    30,
    true
  ),
  (
    'e5f6a7b8-c9d0-1234-ef01-567890123456'::uuid,
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'Summer 2026 Cohort',
    '2026-06-01',
    '2026-07-31',
    30,
    true
  ),
  (
    'f6a7b8c9-d0e1-2345-f012-678901234567'::uuid,
    'c3d4e5f6-a7b8-9012-cdef-345678901234'::uuid,
    'Q2 2026 Leadership Cohort',
    '2026-04-15',
    '2026-06-30',
    20,
    true
  )
ON CONFLICT DO NOTHING;

-- Insert payment method settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description)
VALUES
  ('payment_stripe_enabled', 'true', 'boolean', 'Enable Stripe payments'),
  ('payment_paystack_enabled', 'true', 'boolean', 'Enable Paystack payments'),
  ('payment_bank_transfer_enabled', 'true', 'boolean', 'Enable bank transfer payments'),
  ('payment_bank_name', 'First National Bank', 'text', 'Bank name for wire transfers'),
  ('payment_bank_account', '1234567890', 'text', 'Bank account number'),
  ('payment_bank_routing', '021000021', 'text', 'Bank routing number'),
  ('payment_instructions', 'Please include your full name and course title in the payment reference.', 'text', 'Instructions shown for bank transfers')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample registration forms
INSERT INTO public.registration_forms (id, name, course_type, is_active)
VALUES
  (
    'a7b8c9d0-e1f2-3456-0123-789012345678'::uuid,
    'Cohort Course Registration',
    'cohort',
    true
  ),
  (
    'b8c9d0e1-f2a3-4567-1234-890123456789'::uuid,
    'Self-Paced Course Registration',
    'self_paced',
    true
  )
ON CONFLICT DO NOTHING;

-- Insert form fields for cohort registration
INSERT INTO public.registration_form_fields (form_id, field_key, field_type, label, placeholder, help_text, required, options, order_index)
VALUES
  ('a7b8c9d0-e1f2-3456-0123-789012345678'::uuid, 'full_name', 'text', 'Full Name', 'Enter your full legal name', 'As it appears on official documents', true, NULL, 0),
  ('a7b8c9d0-e1f2-3456-0123-789012345678'::uuid, 'email', 'email', 'Email Address', 'you@example.com', 'We will use this email for course communications', true, NULL, 1),
  ('a7b8c9d0-e1f2-3456-0123-789012345678'::uuid, 'phone', 'phone', 'Phone Number', '+1 (555) 000-0000', 'For urgent course notifications only', true, NULL, 2),
  ('a7b8c9d0-e1f2-3456-0123-789012345678'::uuid, 'organization', 'text', 'Organization / Employer', 'Hospital, clinic, or company name', NULL, false, NULL, 3),
  ('a7b8c9d0-e1f2-3456-0123-789012345678'::uuid, 'role', 'select', 'Current Role', NULL, 'Select the option that best describes your position', true, '{"items": ["Physician", "Nurse", "Administrator", "Researcher", "Student", "Other"]}', 4),
  ('a7b8c9d0-e1f2-3456-0123-789012345678'::uuid, 'motivation', 'textarea', 'Why do you want to take this course?', 'Tell us about your goals...', 'Minimum 50 words recommended', true, NULL, 5)
ON CONFLICT DO NOTHING;

-- Insert form fields for self-paced registration  
INSERT INTO public.registration_form_fields (form_id, field_key, field_type, label, placeholder, help_text, required, options, order_index)
VALUES
  ('b8c9d0e1-f2a3-4567-1234-890123456789'::uuid, 'full_name', 'text', 'Full Name', 'Enter your full name', NULL, true, NULL, 0),
  ('b8c9d0e1-f2a3-4567-1234-890123456789'::uuid, 'email', 'email', 'Email Address', 'you@example.com', NULL, true, NULL, 1),
  ('b8c9d0e1-f2a3-4567-1234-890123456789'::uuid, 'learning_goals', 'multiselect', 'What are your learning goals?', NULL, 'Select all that apply', true, '{"items": ["Career advancement", "Skill development", "Professional certification", "Personal interest"]}', 2)
ON CONFLICT DO NOTHING;