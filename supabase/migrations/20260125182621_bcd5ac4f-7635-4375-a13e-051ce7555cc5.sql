-- Add columns for external URLs and document URLs to lessons table
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS external_url TEXT,
ADD COLUMN IF NOT EXISTS document_url TEXT,
ADD COLUMN IF NOT EXISTS lesson_type TEXT DEFAULT 'text';

-- Create Module 1: Introduction to Public Health Analytics
INSERT INTO public.modules (course_id, title, description, order_index)
VALUES 
  ('6094ed78-a41d-4e94-99ce-7ad0d93df4c2', 'Introduction to Public Health Analytics', 'Fundamentals of public health data and analytics principles', 0),
  ('6094ed78-a41d-4e94-99ce-7ad0d93df4c2', 'Statistical Methods', 'Core statistical techniques for health data analysis', 1),
  ('6094ed78-a41d-4e94-99ce-7ad0d93df4c2', 'Data Visualization', 'Creating compelling visualizations for public health data', 2);

-- Insert lessons for Module 1 (Introduction)
INSERT INTO public.lessons (module_id, title, content, video_url, duration_minutes, order_index, is_free_preview, lesson_type)
SELECT m.id, 'Welcome to the Course', 
   'Welcome to Public Health Data Analytics! In this course, you will learn to analyze population health data and drive evidence-based public health interventions.

This comprehensive program covers:
- Understanding health data sources and types
- Statistical analysis methods
- Data visualization techniques
- Communicating findings to stakeholders

By the end of this course, you will be equipped with the skills to perform advanced epidemiological analyses and design data-driven intervention strategies.',
   'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 15, 0, true, 'video'
FROM modules m WHERE m.course_id = '6094ed78-a41d-4e94-99ce-7ad0d93df4c2' AND m.title = 'Introduction to Public Health Analytics';

INSERT INTO public.lessons (module_id, title, content, video_url, duration_minutes, order_index, is_free_preview, lesson_type)
SELECT m.id, 'Understanding Health Data Sources',
   'Public health data comes from various sources:

1. Administrative Data: Hospital records, insurance claims, vital statistics
2. Survey Data: NHANES, BRFSS, demographic health surveys
3. Surveillance Data: Disease reporting systems, syndromic surveillance
4. Electronic Health Records: Clinical data from healthcare providers
5. Environmental Data: Air quality, water quality, climate data

Each source has its strengths and limitations. Understanding these helps you choose the right data for your research questions.',
   NULL, 25, 1, false, 'text'
FROM modules m WHERE m.course_id = '6094ed78-a41d-4e94-99ce-7ad0d93df4c2' AND m.title = 'Introduction to Public Health Analytics';

INSERT INTO public.lessons (module_id, title, content, duration_minutes, order_index, is_free_preview, lesson_type)
SELECT m.id, 'Data Quality Assessment',
   'Before any analysis, assess your data quality:

Completeness: Are there missing values?
Accuracy: Does the data reflect reality?
Consistency: Are values logically consistent?
Timeliness: Is the data current enough?
Validity: Does the data measure what it claims to?

Use descriptive statistics and visualization to identify data quality issues early in your analysis.',
   20, 2, false, 'text'
FROM modules m WHERE m.course_id = '6094ed78-a41d-4e94-99ce-7ad0d93df4c2' AND m.title = 'Introduction to Public Health Analytics';

-- Insert lessons for Module 2 (Statistical Methods)
INSERT INTO public.lessons (module_id, title, content, video_url, duration_minutes, order_index, is_free_preview, lesson_type)
SELECT m.id, 'Descriptive Statistics for Health Data',
   'Descriptive statistics summarize your data:

Measures of Central Tendency:
- Mean: Average value
- Median: Middle value
- Mode: Most frequent value

Measures of Dispersion:
- Range: Difference between max and min
- Standard Deviation: Average distance from mean
- Interquartile Range: Middle 50% of data

For health data, always consider the distribution shape when choosing appropriate measures.',
   'https://www.youtube.com/watch?v=xxpc-HPKN28', 30, 0, false, 'video'
FROM modules m WHERE m.course_id = '6094ed78-a41d-4e94-99ce-7ad0d93df4c2' AND m.title = 'Statistical Methods';

INSERT INTO public.lessons (module_id, title, content, duration_minutes, order_index, is_free_preview, lesson_type)
SELECT m.id, 'Inferential Statistics Basics',
   'Inferential statistics help you draw conclusions about populations from samples.

Key Concepts:
- Hypothesis Testing
- Confidence Intervals
- P-values and Statistical Significance
- Effect Sizes

Common Tests in Public Health:
- Chi-square test for categorical data
- T-tests for comparing means
- ANOVA for multiple groups
- Regression for relationships',
   35, 1, false, 'text'
FROM modules m WHERE m.course_id = '6094ed78-a41d-4e94-99ce-7ad0d93df4c2' AND m.title = 'Statistical Methods';

INSERT INTO public.lessons (module_id, title, content, duration_minutes, order_index, is_free_preview, lesson_type)
SELECT m.id, 'Epidemiological Measures',
   'Key epidemiological measures you must understand:

Incidence: New cases in a population over time
- Incidence Rate = (New Cases / Person-Time at Risk)

Prevalence: Existing cases at a point in time
- Point Prevalence = (Existing Cases / Total Population)

Risk Measures:
- Relative Risk (RR)
- Odds Ratio (OR)
- Attributable Risk (AR)

These measures help quantify disease burden and intervention impact.',
   40, 2, false, 'text'
FROM modules m WHERE m.course_id = '6094ed78-a41d-4e94-99ce-7ad0d93df4c2' AND m.title = 'Statistical Methods';

-- Insert lessons for Module 3 (Data Visualization)
INSERT INTO public.lessons (module_id, title, content, video_url, duration_minutes, order_index, is_free_preview, lesson_type)
SELECT m.id, 'Principles of Health Data Visualization',
   'Effective visualization communicates complex data clearly.

Core Principles:
1. Clarity: Remove unnecessary elements
2. Accuracy: Represent data truthfully
3. Efficiency: Maximize data-ink ratio
4. Accessibility: Consider color blindness and readability

Chart Selection Guide:
- Trends over time: Line charts
- Comparisons: Bar charts
- Parts of whole: Pie/donut charts
- Relationships: Scatter plots
- Geographic data: Maps',
   'https://www.youtube.com/watch?v=5Zg-C8AAIGg', 25, 0, false, 'video'
FROM modules m WHERE m.course_id = '6094ed78-a41d-4e94-99ce-7ad0d93df4c2' AND m.title = 'Data Visualization';

INSERT INTO public.lessons (module_id, title, content, duration_minutes, order_index, is_free_preview, lesson_type)
SELECT m.id, 'Creating Epidemiological Curves',
   'Epidemic curves (epi curves) are fundamental to outbreak investigation.

Components of an Epi Curve:
- X-axis: Time (days, weeks, months)
- Y-axis: Number of cases
- Each case represented as a block

Interpretation:
- Shape reveals transmission pattern
- Point source: Sharp peak
- Propagated: Multiple peaks
- Continuous: Plateau pattern

Practice creating epi curves for different outbreak scenarios.',
   30, 1, false, 'text'
FROM modules m WHERE m.course_id = '6094ed78-a41d-4e94-99ce-7ad0d93df4c2' AND m.title = 'Data Visualization';

INSERT INTO public.lessons (module_id, title, content, duration_minutes, order_index, is_free_preview, lesson_type)
SELECT m.id, 'Mapping Health Data',
   'Geographic visualization reveals spatial patterns in health data.

Types of Health Maps:
- Choropleth maps: Color-coded regions
- Point maps: Individual case locations
- Heat maps: Density visualization
- Cluster maps: Disease clustering

Best Practices:
- Use appropriate geographic boundaries
- Normalize by population for rates
- Consider privacy when mapping individual cases
- Include clear legends and scale bars',
   35, 2, false, 'text'
FROM modules m WHERE m.course_id = '6094ed78-a41d-4e94-99ce-7ad0d93df4c2' AND m.title = 'Data Visualization';