-- Insert the new Public Health Project Management course
INSERT INTO public.courses (
  title,
  slug,
  short_description,
  description,
  course_type,
  status,
  level,
  original_price,
  discounted_price,
  price,
  category,
  duration_weeks,
  effort_hours_per_week,
  learning_outcomes,
  target_audience
) VALUES (
  'Public Health Project Management',
  'public-health-project-management',
  'For students and professionals looking to master project management in public health through practical, real-world applications.',
  'For students and professionals looking to master project management in public health through practical, real-world applications. This course provides comprehensive training on project management tools tailored specifically for public health settings.',
  'cohort',
  'published',
  'intermediate',
  25000,
  0,
  25000,
  'Public Health',
  8,
  4,
  ARRAY[
    'Master project management tools tailored for public health',
    'Hands-on experience with real-world public health projects',
    'Learn project planning and budget management',
    'Stakeholder management and project evaluation',
    'Expert mentorship from seasoned public health project managers'
  ],
  ARRAY[
    'Students',
    'Professionals',
    'Aspiring public health professionals',
    'Program managers',
    'Public health practitioners'
  ]
)
RETURNING id;

-- We will create the cohort and access settings after getting the course ID