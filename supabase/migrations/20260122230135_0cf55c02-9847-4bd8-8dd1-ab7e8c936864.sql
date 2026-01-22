-- ============================================
-- PART 1: Sample Course Modules and Lessons
-- ============================================

-- Insert modules for Healthcare Innovation Fundamentals
INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Introduction to Healthcare Innovation', 'Understanding the landscape of healthcare innovation and its importance', 0),
  ('11111111-1111-1111-1111-111111111102', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Design Thinking in Healthcare', 'Apply human-centered design principles to healthcare challenges', 1),
  ('11111111-1111-1111-1111-111111111103', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Digital Health Technologies', 'Explore modern digital health tools and platforms', 2),
  ('11111111-1111-1111-1111-111111111104', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Regulatory and Compliance', 'Navigate healthcare regulations and compliance requirements', 3)
ON CONFLICT DO NOTHING;

-- Insert modules for Clinical Data Analytics
INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Data Fundamentals', 'Introduction to clinical data types and sources', 0),
  ('22222222-2222-2222-2222-222222222202', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Statistical Methods', 'Core statistical techniques for healthcare data analysis', 1),
  ('22222222-2222-2222-2222-222222222203', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Machine Learning in Healthcare', 'Applying ML algorithms to clinical datasets', 2),
  ('22222222-2222-2222-2222-222222222204', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Data Visualization', 'Creating impactful clinical data visualizations', 3)
ON CONFLICT DO NOTHING;

-- Insert modules for Digital Health Leadership
INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES
  ('33333333-3333-3333-3333-333333333301', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'Leadership Foundations', 'Core leadership principles for digital health', 0),
  ('33333333-3333-3333-3333-333333333302', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'Change Management', 'Leading organizational change in healthcare settings', 1),
  ('33333333-3333-3333-3333-333333333303', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'Strategic Planning', 'Developing digital health strategies', 2)
ON CONFLICT DO NOTHING;

-- Insert lessons for Healthcare Innovation Fundamentals
INSERT INTO public.lessons (id, module_id, title, content, duration_minutes, order_index, is_free_preview)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa101', '11111111-1111-1111-1111-111111111101', 'Welcome to Healthcare Innovation', 'Introduction to the course objectives and structure', 15, 0, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa102', '11111111-1111-1111-1111-111111111101', 'The Innovation Imperative', 'Why healthcare needs innovation now more than ever', 30, 1, false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa103', '11111111-1111-1111-1111-111111111102', 'Design Thinking Overview', 'Introduction to design thinking methodology', 45, 0, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa104', '11111111-1111-1111-1111-111111111102', 'Empathy Mapping', 'Understanding patient and provider needs', 40, 1, false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa105', '11111111-1111-1111-1111-111111111103', 'Telemedicine Trends', 'Current state and future of telemedicine', 35, 0, false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa106', '11111111-1111-1111-1111-111111111104', 'FDA Digital Health', 'Understanding FDA regulations for digital health', 50, 0, false)
ON CONFLICT DO NOTHING;

-- Insert lessons for Clinical Data Analytics
INSERT INTO public.lessons (id, module_id, title, content, duration_minutes, order_index, is_free_preview)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb201', '22222222-2222-2222-2222-222222222201', 'Clinical Data Sources', 'Understanding EHR, claims, and research data', 40, 0, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb202', '22222222-2222-2222-2222-222222222201', 'Data Quality', 'Ensuring data integrity in clinical analysis', 35, 1, false),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb203', '22222222-2222-2222-2222-222222222202', 'Descriptive Statistics', 'Core statistical measures for clinical data', 45, 0, false),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb204', '22222222-2222-2222-2222-222222222203', 'Predictive Modeling', 'Building predictive models for patient outcomes', 60, 0, false)
ON CONFLICT DO NOTHING;

-- Insert lessons for Digital Health Leadership
INSERT INTO public.lessons (id, module_id, title, content, duration_minutes, order_index, is_free_preview)
VALUES
  ('cccccccc-cccc-cccc-cccc-ccccccccc301', '33333333-3333-3333-3333-333333333301', 'Leadership Styles', 'Understanding different leadership approaches', 30, 0, true),
  ('cccccccc-cccc-cccc-cccc-ccccccccc302', '33333333-3333-3333-3333-333333333302', 'Managing Resistance', 'Strategies for overcoming change resistance', 45, 0, false),
  ('cccccccc-cccc-cccc-cccc-ccccccccc303', '33333333-3333-3333-3333-333333333303', 'Building a Digital Roadmap', 'Creating actionable digital transformation plans', 50, 0, false)
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 2: Registration Forms for Each Course
-- ============================================

-- Create registration form for Healthcare Innovation Fundamentals
INSERT INTO public.registration_forms (id, name, course_id, course_type, is_active)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'Healthcare Innovation Registration', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cohort', true)
ON CONFLICT DO NOTHING;

-- Create registration form for Clinical Data Analytics
INSERT INTO public.registration_forms (id, name, course_id, course_type, is_active)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'Clinical Data Analytics Registration', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'self_paced', true)
ON CONFLICT DO NOTHING;

-- Create registration form for Digital Health Leadership
INSERT INTO public.registration_forms (id, name, course_id, course_type, is_active)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'Digital Health Leadership Registration', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'cohort', true)
ON CONFLICT DO NOTHING;

-- Registration form fields for Healthcare Innovation
INSERT INTO public.registration_form_fields (form_id, field_key, field_type, label, placeholder, help_text, required, options, order_index)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'full_name', 'text', 'Full Name', 'Enter your full legal name', 'As it appears on official documents', true, NULL, 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'email', 'email', 'Email Address', 'you@example.com', 'We will use this for course communications', true, NULL, 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'phone', 'phone', 'Phone Number', '+1 (555) 000-0000', 'For urgent course notifications', true, NULL, 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'organization', 'text', 'Organization', 'Hospital, clinic, or company name', NULL, false, NULL, 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'role', 'select', 'Current Role', NULL, 'Select your current position', true, '{"items": ["Physician", "Nurse", "Administrator", "Researcher", "Student", "Other"]}', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'experience', 'select', 'Years of Experience', NULL, NULL, true, '{"items": ["0-2 years", "3-5 years", "6-10 years", "10+ years"]}', 5),
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'motivation', 'textarea', 'Why do you want to take this course?', 'Share your goals and what you hope to achieve...', 'Minimum 50 words recommended', true, NULL, 6)
ON CONFLICT DO NOTHING;

-- Registration form fields for Clinical Data Analytics
INSERT INTO public.registration_form_fields (form_id, field_key, field_type, label, placeholder, help_text, required, options, order_index)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'full_name', 'text', 'Full Name', 'Enter your full name', NULL, true, NULL, 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'email', 'email', 'Email Address', 'you@example.com', NULL, true, NULL, 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'background', 'select', 'Technical Background', NULL, 'Your experience with data analysis', true, '{"items": ["Beginner - No coding experience", "Intermediate - Basic programming", "Advanced - Statistical software experience", "Expert - ML/AI experience"]}', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'goals', 'multiselect', 'Learning Goals', NULL, 'Select all that apply', true, '{"items": ["Career advancement", "Skill development", "Research capabilities", "Job requirement", "Personal interest"]}', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'terms', 'checkbox', 'I agree to the terms and conditions', NULL, 'You must accept to continue', true, NULL, 4)
ON CONFLICT DO NOTHING;

-- Registration form fields for Digital Health Leadership
INSERT INTO public.registration_form_fields (form_id, field_key, field_type, label, placeholder, help_text, required, options, order_index)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'full_name', 'text', 'Full Name', 'Enter your full legal name', NULL, true, NULL, 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'email', 'email', 'Email Address', 'you@example.com', NULL, true, NULL, 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'phone', 'phone', 'Phone Number', '+1 (555) 000-0000', NULL, true, NULL, 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'current_title', 'text', 'Current Job Title', 'e.g., Chief Medical Officer', NULL, true, NULL, 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'organization', 'text', 'Organization', 'Your healthcare organization', NULL, true, NULL, 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'org_size', 'select', 'Organization Size', NULL, 'Number of employees', true, '{"items": ["1-50", "51-200", "201-1000", "1000+"]}', 5),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'leadership_exp', 'select', 'Leadership Experience', NULL, 'Years in leadership roles', true, '{"items": ["1-3 years", "4-7 years", "8-15 years", "15+ years"]}', 6),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'challenges', 'textarea', 'Current Digital Health Challenges', 'Describe the main challenges you face...', 'This helps us tailor the experience', true, NULL, 7),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'linkedin', 'text', 'LinkedIn Profile URL', 'https://linkedin.com/in/yourprofile', 'Optional - helps facilitators', false, NULL, 8)
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 3: Payment Settings Configuration
-- ============================================

-- Insert/Update payment method settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description)
VALUES
  ('payment_stripe_enabled', 'false', 'boolean', 'Enable Stripe payment gateway'),
  ('payment_paystack_enabled', 'false', 'boolean', 'Enable Paystack payment gateway'),
  ('payment_bank_transfer_enabled', 'true', 'boolean', 'Enable bank transfer payments'),
  ('bank_transfer_bank_name', 'First National Bank', 'text', 'Bank name for transfers'),
  ('bank_transfer_account_name', 'Cytobiz Academy', 'text', 'Account holder name'),
  ('bank_transfer_account_number', '1234567890', 'text', 'Bank account number'),
  ('bank_transfer_routing_number', '021000021', 'text', 'Bank routing number'),
  ('bank_transfer_swift_code', 'FNBAUS33', 'text', 'SWIFT code for international transfers'),
  ('bank_transfer_payment_instructions', 'Please include your full name and course title in the payment reference. Allow 2-3 business days for payment verification.', 'text', 'Instructions for bank transfers')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

-- Clean up old/deprecated settings
DELETE FROM public.site_settings WHERE setting_key IN (
  'hero_title',
  'hero_subtitle', 
  'hero_cta_text',
  'hero_image_url',
  'instagram_handle',
  'instagram_url',
  'nursing_title',
  'nursing_description',
  'tiktok_handle',
  'tiktok_url',
  'twitter_handle',
  'twitter_url',
  'payment_bank_name',
  'payment_bank_account',
  'payment_bank_routing',
  'payment_bank_swift',
  'payment_instructions'
);