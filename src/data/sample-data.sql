-- Sample data for courses, cohorts, and registration forms
-- This populates the database with demo data to showcase the enrollment flow

-- Insert sample courses
INSERT INTO public.courses (id, title, slug, description, short_description, category, level, course_type, status, price, duration_weeks, effort_hours_per_week, learning_outcomes, prerequisites, target_audience)
VALUES 
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
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
    'c3d4e5f6-a7b8-9012-cdef-345678901234',
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
    'd4e5f6a7-b8c9-0123-defg-456789012345',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Spring 2026 Cohort',
    '2026-03-01',
    '2026-04-30',
    30,
    true
  ),
  (
    'e5f6a7b8-c9d0-1234-efgh-567890123456',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Summer 2026 Cohort',
    '2026-06-01',
    '2026-07-31',
    30,
    true
  ),
  (
    'f6a7b8c9-d0e1-2345-fghi-678901234567',
    'c3d4e5f6-a7b8-9012-cdef-345678901234',
    'Q2 2026 Leadership Cohort',
    '2026-04-15',
    '2026-06-30',
    20,
    true
  )
ON CONFLICT DO NOTHING;

-- Insert sample registration forms
INSERT INTO public.registration_forms (id, name, course_type, is_active)
VALUES
  (
    'g7b8c9d0-e1f2-3456-ghij-789012345678',
    'Cohort Course Registration',
    'cohort',
    true
  ),
  (
    'h8c9d0e1-f2a3-4567-hijk-890123456789',
    'Self-Paced Course Registration',
    'self_paced',
    true
  )
ON CONFLICT DO NOTHING;

-- Insert sample form fields for cohort registration
INSERT INTO public.registration_form_fields (form_id, field_key, field_type, label, placeholder, help_text, required, options, order_index)
VALUES
  (
    'g7b8c9d0-e1f2-3456-ghij-789012345678',
    'full_name',
    'text',
    'Full Name',
    'Enter your full legal name',
    'As it appears on official documents',
    true,
    NULL,
    0
  ),
  (
    'g7b8c9d0-e1f2-3456-ghij-789012345678',
    'email',
    'email',
    'Email Address',
    'you@example.com',
    'We will use this email for course communications',
    true,
    NULL,
    1
  ),
  (
    'g7b8c9d0-e1f2-3456-ghij-789012345678',
    'phone',
    'phone',
    'Phone Number',
    '+1 (555) 000-0000',
    'For urgent course notifications only',
    true,
    NULL,
    2
  ),
  (
    'g7b8c9d0-e1f2-3456-ghij-789012345678',
    'organization',
    'text',
    'Organization / Employer',
    'Hospital, clinic, or company name',
    NULL,
    false,
    NULL,
    3
  ),
  (
    'g7b8c9d0-e1f2-3456-ghij-789012345678',
    'role',
    'select',
    'Current Role',
    NULL,
    'Select the option that best describes your position',
    true,
    '{"items": ["Physician", "Nurse", "Administrator", "Researcher", "Student", "Other"]}',
    4
  ),
  (
    'g7b8c9d0-e1f2-3456-ghij-789012345678',
    'experience_years',
    'select',
    'Years of Healthcare Experience',
    NULL,
    NULL,
    true,
    '{"items": ["0-2 years", "3-5 years", "6-10 years", "10+ years"]}',
    5
  ),
  (
    'g7b8c9d0-e1f2-3456-ghij-789012345678',
    'motivation',
    'textarea',
    'Why do you want to take this course?',
    'Tell us about your goals and what you hope to achieve...',
    'Minimum 50 words recommended',
    true,
    NULL,
    6
  ),
  (
    'g7b8c9d0-e1f2-3456-ghij-789012345678',
    'linkedin_url',
    'text',
    'LinkedIn Profile URL',
    'https://linkedin.com/in/yourprofile',
    'Optional - helps facilitators learn about your background',
    false,
    NULL,
    7
  )
ON CONFLICT DO NOTHING;

-- Insert sample form fields for self-paced registration
INSERT INTO public.registration_form_fields (form_id, field_key, field_type, label, placeholder, help_text, required, options, order_index)
VALUES
  (
    'h8c9d0e1-f2a3-4567-hijk-890123456789',
    'full_name',
    'text',
    'Full Name',
    'Enter your full name',
    NULL,
    true,
    NULL,
    0
  ),
  (
    'h8c9d0e1-f2a3-4567-hijk-890123456789',
    'email',
    'email',
    'Email Address',
    'you@example.com',
    NULL,
    true,
    NULL,
    1
  ),
  (
    'h8c9d0e1-f2a3-4567-hijk-890123456789',
    'learning_goals',
    'multiselect',
    'What are your learning goals?',
    NULL,
    'Select all that apply',
    true,
    '{"items": ["Career advancement", "Skill development", "Professional certification", "Personal interest", "Research purposes"]}',
    2
  ),
  (
    'h8c9d0e1-f2a3-4567-hijk-890123456789',
    'terms_accepted',
    'checkbox',
    'I agree to the terms and conditions',
    NULL,
    'You must accept the terms to enroll',
    true,
    NULL,
    3
  )
ON CONFLICT DO NOTHING;

-- Insert sample site settings for payment
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description)
VALUES
  ('payment_bank_name', 'First National Bank', 'text', 'Bank name for wire transfers'),
  ('payment_bank_account', '1234567890', 'text', 'Bank account number'),
  ('payment_bank_routing', '021000021', 'text', 'Bank routing number'),
  ('payment_bank_swift', 'FNBAUS33', 'text', 'SWIFT code for international transfers'),
  ('payment_instructions', 'Please include your full name and course title in the payment reference. Allow 2-3 business days for payment verification.', 'text', 'Instructions shown to users paying via bank transfer'),
  ('stat_total_learners', '5000', 'number', 'Total number of learners'),
  ('stat_courses_count', '50', 'number', 'Total number of courses'),
  ('stat_success_rate', '98', 'number', 'Course completion success rate'),
  ('site_tagline', 'Transforming Healthcare Education', 'text', 'Site tagline shown in various places')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample facilitators
INSERT INTO public.facilitators (id, name, title, bio, expertise, linkedin_url, display_order)
VALUES
  (
    'i9d0e1f2-a3b4-5678-ijkl-901234567890',
    'Dr. Sarah Chen',
    'Director of Digital Health Innovation',
    'Dr. Chen brings 15 years of experience in healthcare technology and innovation leadership. She has led digital transformation initiatives at three major health systems.',
    ARRAY['Digital Health', 'Healthcare Innovation', 'Leadership'],
    'https://linkedin.com/in/sarahchen',
    1
  ),
  (
    'j0e1f2a3-b4c5-6789-jklm-012345678901',
    'Prof. Michael Roberts',
    'Clinical Data Science Lead',
    'Professor Roberts is a leading expert in clinical data analytics with publications in JAMA and NEJM. He directs the Clinical AI Lab at University Medical Center.',
    ARRAY['Data Science', 'Machine Learning', 'Clinical Research'],
    'https://linkedin.com/in/michaelroberts',
    2
  ),
  (
    'k1f2a3b4-c5d6-7890-klmn-123456789012',
    'Dr. Amara Okonkwo',
    'Healthcare Policy Advisor',
    'Dr. Okonkwo advises healthcare organizations on regulatory compliance and policy. Former FDA reviewer with expertise in digital health regulations.',
    ARRAY['Healthcare Policy', 'Regulatory Affairs', 'Compliance'],
    'https://linkedin.com/in/amaraokonkwo',
    3
  )
ON CONFLICT DO NOTHING;
