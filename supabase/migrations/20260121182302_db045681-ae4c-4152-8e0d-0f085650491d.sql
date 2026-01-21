-- Insert sample cohort courses
INSERT INTO public.courses (title, slug, short_description, description, course_type, status, level, price, duration_weeks, effort_hours_per_week, category, learning_outcomes, prerequisites, target_audience, thumbnail_url)
VALUES 
(
  'Digital Health Innovation Leadership',
  'digital-health-innovation-leadership',
  'Master the strategic and operational skills needed to lead digital transformation in healthcare organizations.',
  'This comprehensive cohort-based program equips healthcare leaders with the knowledge and practical skills to drive digital health initiatives. Learn from industry experts, engage with peers across the globe, and develop actionable strategies for your organization. The program covers digital health strategy, implementation frameworks, change management, and measuring digital health ROI.',
  'cohort',
  'published',
  'advanced',
  499,
  8,
  5,
  'Digital Health & Technology',
  ARRAY['Develop comprehensive digital health strategies', 'Lead organizational change for technology adoption', 'Evaluate and implement health IT solutions', 'Measure and optimize digital health ROI', 'Build cross-functional teams for innovation'],
  ARRAY['3+ years healthcare experience', 'Basic technology literacy', 'Leadership or management role preferred'],
  ARRAY['Healthcare executives', 'Digital health managers', 'Clinical informaticists', 'Health IT directors'],
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop'
),
(
  'Public Health Data Analytics',
  'public-health-data-analytics',
  'Learn to analyze population health data and drive evidence-based public health interventions.',
  'This cohort program provides hands-on training in public health data analytics using real-world datasets. You will learn statistical methods, data visualization, epidemiological analysis, and how to communicate findings to stakeholders. Perfect for public health professionals looking to enhance their analytical capabilities.',
  'cohort',
  'published',
  'intermediate',
  399,
  6,
  4,
  'Public Health & Epidemiology',
  ARRAY['Perform advanced epidemiological analyses', 'Create compelling data visualizations', 'Use statistical software for public health research', 'Interpret and communicate health data findings', 'Design data-driven intervention strategies'],
  ARRAY['Basic statistics knowledge', 'Public health background', 'Familiarity with Excel or spreadsheets'],
  ARRAY['Public health professionals', 'Epidemiologists', 'Health researchers', 'Policy analysts'],
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
),
(
  'Healthcare AI Implementation',
  'healthcare-ai-implementation',
  'A comprehensive guide to implementing artificial intelligence solutions in clinical and operational healthcare settings.',
  'This cutting-edge cohort program explores the practical aspects of AI implementation in healthcare. From understanding machine learning fundamentals to navigating regulatory requirements and ethical considerations, this course prepares you to lead AI initiatives in your organization. Includes case studies from leading health systems.',
  'cohort',
  'published',
  'advanced',
  599,
  10,
  6,
  'Healthcare Innovation',
  ARRAY['Evaluate AI solutions for healthcare applications', 'Navigate regulatory and ethical AI frameworks', 'Lead AI implementation projects', 'Assess AI vendor capabilities', 'Measure AI impact on clinical outcomes'],
  ARRAY['Healthcare leadership experience', 'Basic understanding of AI concepts', 'Project management skills'],
  ARRAY['Healthcare executives', 'Chief medical officers', 'Innovation directors', 'Clinical operations leaders'],
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop'
),
-- Insert sample self-paced courses
(
  'Medical Research Methodology',
  'medical-research-methodology',
  'Build a strong foundation in research design, data collection, and analysis for clinical and health services research.',
  'This self-paced course covers the essential principles of medical research methodology. Learn about study design, sampling methods, data collection techniques, statistical analysis, and ethical considerations in research. Complete at your own pace with lifetime access to materials.',
  'self_paced',
  'published',
  'beginner',
  199,
  NULL,
  3,
  'Research Methodology',
  ARRAY['Design rigorous research studies', 'Select appropriate research methods', 'Collect and manage research data', 'Perform basic statistical analyses', 'Navigate research ethics requirements'],
  ARRAY['Healthcare or life sciences background', 'Basic math skills'],
  ARRAY['Medical students', 'Residents', 'Clinical researchers', 'Healthcare professionals'],
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop'
),
(
  'Telemedicine Excellence',
  'telemedicine-excellence',
  'Master the art of delivering exceptional patient care through virtual consultations and remote monitoring.',
  'This comprehensive self-paced course prepares healthcare providers for success in telemedicine. Learn technical skills, communication techniques, and best practices for virtual patient encounters. Includes practical exercises and real-world scenarios.',
  'self_paced',
  'published',
  'intermediate',
  149,
  NULL,
  2,
  'Digital Health & Technology',
  ARRAY['Conduct effective virtual consultations', 'Use telemedicine technology platforms', 'Ensure patient privacy in telehealth', 'Manage technical issues during consultations', 'Document telehealth encounters properly'],
  ARRAY['Clinical licensure', 'Basic computer skills'],
  ARRAY['Physicians', 'Nurse practitioners', 'Physician assistants', 'Mental health providers'],
  'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=600&fit=crop'
),
(
  'Healthcare Quality Improvement',
  'healthcare-quality-improvement',
  'Learn proven methodologies to improve patient outcomes, reduce errors, and enhance healthcare delivery.',
  'This self-paced program introduces you to the principles and tools of healthcare quality improvement. From Lean and Six Sigma to PDSA cycles, you will learn practical approaches to identifying problems, implementing solutions, and measuring impact. Ideal for quality professionals and clinical leaders.',
  'self_paced',
  'published',
  'intermediate',
  249,
  NULL,
  4,
  'Clinical Leadership',
  ARRAY['Apply quality improvement methodologies', 'Lead quality improvement projects', 'Use data for performance monitoring', 'Engage teams in improvement initiatives', 'Sustain quality gains over time'],
  ARRAY['Healthcare experience', 'Interest in quality and safety'],
  ARRAY['Quality managers', 'Clinical leaders', 'Patient safety officers', 'Healthcare administrators'],
  'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop'
);

-- Insert sample cohorts for cohort-based courses
INSERT INTO public.cohorts (course_id, title, start_date, end_date, max_students, is_active)
SELECT 
  id,
  'March 2026 Cohort',
  '2026-03-01',
  '2026-04-26',
  30,
  true
FROM public.courses WHERE slug = 'digital-health-innovation-leadership';

INSERT INTO public.cohorts (course_id, title, start_date, end_date, max_students, is_active)
SELECT 
  id,
  'April 2026 Cohort',
  '2026-04-15',
  '2026-05-31',
  25,
  true
FROM public.courses WHERE slug = 'public-health-data-analytics';

INSERT INTO public.cohorts (course_id, title, start_date, end_date, max_students, is_active)
SELECT 
  id,
  'May 2026 Cohort',
  '2026-05-01',
  '2026-07-10',
  20,
  true
FROM public.courses WHERE slug = 'healthcare-ai-implementation';

-- Insert sample modules for courses
INSERT INTO public.modules (course_id, title, description, order_index)
SELECT id, 'Introduction to Digital Health', 'Understanding the digital health landscape and key trends', 1
FROM public.courses WHERE slug = 'digital-health-innovation-leadership'
UNION ALL
SELECT id, 'Strategic Planning for Digital Transformation', 'Developing your digital health roadmap', 2
FROM public.courses WHERE slug = 'digital-health-innovation-leadership'
UNION ALL
SELECT id, 'Change Management & Adoption', 'Leading organizational change for technology adoption', 3
FROM public.courses WHERE slug = 'digital-health-innovation-leadership'
UNION ALL
SELECT id, 'Measuring Digital Health Success', 'Frameworks for ROI and outcome measurement', 4
FROM public.courses WHERE slug = 'digital-health-innovation-leadership';

-- Insert sample FAQs
INSERT INTO public.faqs (question, answer, is_global, order_index) VALUES
('How long do I have access to course materials?', 'For self-paced courses, you have lifetime access to all course materials. For cohort-based courses, you have access during the program and for 6 months after completion.', true, 1),
('Are certificates provided upon completion?', 'Yes, all courses provide a verified certificate of completion that you can share on LinkedIn and with employers.', true, 2),
('What if I need to miss a cohort session?', 'All cohort sessions are recorded and available within 24 hours. You can catch up on any sessions you miss.', true, 3),
('Can I get a refund if the course is not right for me?', 'We offer a 14-day money-back guarantee for all courses. If you are not satisfied, contact our support team.', true, 4);

-- Insert sample site settings for stats
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description) VALUES
('stat_learners_count', '2500', 'number', 'Total number of learners'),
('stat_courses_count', '48', 'number', 'Total number of courses'),
('stat_countries_count', '85', 'number', 'Number of countries represented'),
('stat_completion_rate', '94', 'number', 'Course completion rate percentage')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;