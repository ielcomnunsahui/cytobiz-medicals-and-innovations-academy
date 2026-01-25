-- Insert all March Cohort courses
-- A. Emergency & Clinical Skills
INSERT INTO courses (title, slug, description, short_description, course_type, status, category, level, duration_weeks, effort_hours_per_week, price, original_price)
VALUES
('Basic Life Support (BLS)', 'basic-life-support-bls', 'Learn essential life-saving skills for cardiac arrest, choking, and emergency response in adults. This comprehensive course covers chest compressions, rescue breathing, and the chain of survival.', 'Essential life-saving skills for cardiac arrest and emergency response.', 'cohort', 'published', 'Emergency & Clinical Skills', 'beginner', 2, 4, 25000, 35000),
('Advanced Cardiac Life Support (ACLS)', 'advanced-cardiac-life-support-acls', 'Advanced management of cardiac emergencies including ECG interpretation, airway management, pharmacology, and team leadership during resuscitation efforts.', 'Advanced cardiac emergency management and resuscitation protocols.', 'cohort', 'published', 'Emergency & Clinical Skills', 'advanced', 3, 6, 45000, 60000),
('Pediatric Advanced Life Support (PALS)', 'pediatric-advanced-life-support-pals', 'Specialized emergency care for infants and children focusing on pediatric resuscitation protocols, airway management, and recognition of life-threatening conditions.', 'Pediatric emergency care and resuscitation protocols.', 'cohort', 'published', 'Emergency & Clinical Skills', 'advanced', 3, 6, 45000, 60000),
('First Aid + CPR/AED', 'first-aid-cpr-aed', 'Immediate response skills for injuries, sudden illness, and cardiac emergencies using CPR and AED. Learn to handle bleeding, fractures, burns, and medical emergencies.', 'First aid and CPR/AED certification training.', 'cohort', 'published', 'Emergency & Clinical Skills', 'beginner', 2, 3, 20000, 30000),
('Emergency Triage Assessment & Treatment (ETAT)', 'emergency-triage-assessment-treatment', 'Rapid assessment and prioritization of critically ill patients in emergency and acute care settings using WHO-endorsed ETAT protocols.', 'Emergency triage and rapid patient assessment skills.', 'cohort', 'published', 'Emergency & Clinical Skills', 'intermediate', 2, 5, 35000, 45000),
('Infection Prevention & Control (IPC)', 'infection-prevention-control', 'Comprehensive training on preventing healthcare-associated infections, hand hygiene, PPE use, sterilization, and outbreak management in clinical settings.', 'Healthcare infection prevention and control protocols.', 'cohort', 'published', 'Emergency & Clinical Skills', 'intermediate', 3, 4, 30000, 40000),
('Antimicrobial Stewardship (AMS)', 'antimicrobial-stewardship', 'Learn principles of rational antibiotic use, resistance patterns, prescribing guidelines, and implementing stewardship programs in healthcare facilities.', 'Rational antibiotic use and stewardship principles.', 'cohort', 'published', 'Emergency & Clinical Skills', 'intermediate', 3, 4, 35000, 45000),
('Patient Safety & Quality Improvement', 'patient-safety-quality-improvement', 'Evidence-based approaches to patient safety, error prevention, quality metrics, root cause analysis, and implementing improvement initiatives in healthcare.', 'Patient safety and healthcare quality improvement.', 'cohort', 'published', 'Emergency & Clinical Skills', 'intermediate', 4, 5, 40000, 55000),

-- B. Public Health & Health Systems
('Fundamentals of Public Health', 'fundamentals-public-health', 'Introduction to core public health concepts including epidemiology, health promotion, disease prevention, and health systems organization.', 'Core public health concepts and principles.', 'cohort', 'published', 'Public Health & Health Systems', 'beginner', 4, 4, 30000, 40000),
('Applied Epidemiology', 'applied-epidemiology', 'Practical epidemiological methods for disease surveillance, outbreak investigation, study design, and data analysis for public health decision-making.', 'Practical epidemiological methods and disease surveillance.', 'cohort', 'published', 'Public Health & Health Systems', 'intermediate', 4, 5, 40000, 55000),
('Outbreak Investigation', 'outbreak-investigation', 'Step-by-step training on detecting, investigating, and responding to disease outbreaks using field epidemiology methods and laboratory coordination.', 'Disease outbreak detection and investigation methods.', 'cohort', 'published', 'Public Health & Health Systems', 'intermediate', 3, 5, 35000, 50000),
('Health Policy & Health Systems', 'health-policy-health-systems', 'Understanding health policy formulation, health systems strengthening, financing mechanisms, and governance in low and middle-income settings.', 'Health policy and systems strengthening.', 'cohort', 'published', 'Public Health & Health Systems', 'intermediate', 4, 5, 40000, 55000),
('Monitoring & Evaluation (M&E)', 'monitoring-evaluation', 'Design and implement M&E frameworks for health programs, including indicator development, data collection, analysis, and reporting for program improvement.', 'Health program monitoring and evaluation.', 'cohort', 'published', 'Public Health & Health Systems', 'intermediate', 4, 5, 40000, 55000),
('Health Promotion & Behaviour Change', 'health-promotion-behaviour-change', 'Theories and strategies for health promotion, behavior change communication, community engagement, and designing effective health interventions.', 'Health promotion and behavior change strategies.', 'cohort', 'published', 'Public Health & Health Systems', 'intermediate', 3, 4, 30000, 40000),

-- C. Clinical Research & Data
('Research Methods for Health Professionals', 'research-methods-health-professionals', 'Comprehensive training on research design, methodology, ethics, proposal writing, and conducting health research in clinical and community settings.', 'Health research design and methodology.', 'cohort', 'published', 'Clinical Research & Data', 'intermediate', 4, 5, 40000, 55000),
('Biostatistics for Health Professionals', 'biostatistics-health-professionals', 'Statistical methods for health research including descriptive statistics, hypothesis testing, regression analysis, and using statistical software.', 'Statistical methods for health research.', 'cohort', 'published', 'Clinical Research & Data', 'intermediate', 4, 6, 45000, 60000),
('Evidence-Based Medicine (EBM)', 'evidence-based-medicine', 'Skills for finding, appraising, and applying clinical evidence to patient care, including systematic reviews and clinical practice guidelines.', 'Evidence-based clinical decision making.', 'cohort', 'published', 'Clinical Research & Data', 'intermediate', 3, 4, 35000, 45000),
('Clinical Audit & Root Cause Analysis', 'clinical-audit-root-cause-analysis', 'Methods for conducting clinical audits, identifying quality gaps, performing root cause analysis, and implementing corrective actions.', 'Clinical audit and quality analysis methods.', 'cohort', 'published', 'Clinical Research & Data', 'intermediate', 3, 4, 35000, 45000),
('Good Clinical Practice (GCP)', 'good-clinical-practice', 'International standards for conducting clinical trials including ethics, informed consent, data management, and regulatory compliance.', 'Clinical trial ethics and regulatory standards.', 'cohort', 'published', 'Clinical Research & Data', 'intermediate', 2, 4, 30000, 40000),
('Grant Writing for Health Research', 'grant-writing-health-research', 'Practical skills for writing competitive grant proposals, understanding funder requirements, budgeting, and project management.', 'Health research grant proposal writing.', 'cohort', 'published', 'Clinical Research & Data', 'intermediate', 3, 5, 35000, 50000),

-- D. Digital Health, IT & Innovation
('Health IT Project Management', 'health-it-project-management', 'Managing health technology projects from planning to implementation, including stakeholder management, risk assessment, and change management.', 'Health IT project planning and implementation.', 'cohort', 'published', 'Digital Health & Innovation', 'intermediate', 4, 5, 40000, 55000),
('Electronic Health Records (EHR)', 'electronic-health-records', 'Implementation and optimization of EHR systems, including workflow analysis, data standards, interoperability, and user training.', 'EHR implementation and optimization.', 'cohort', 'published', 'Digital Health & Innovation', 'intermediate', 4, 5, 40000, 55000),
('Telemedicine & Digital Health', 'telemedicine-digital-health', 'Designing and implementing telemedicine programs, virtual care delivery, remote patient monitoring, and digital health regulations.', 'Telemedicine implementation and virtual care.', 'cohort', 'published', 'Digital Health & Innovation', 'intermediate', 3, 4, 35000, 50000),
('Healthcare Data Analytics', 'healthcare-data-analytics', 'Data analytics techniques for healthcare including visualization, predictive modeling, population health analytics, and decision support.', 'Healthcare data analysis and visualization.', 'cohort', 'published', 'Digital Health & Innovation', 'intermediate', 4, 6, 45000, 60000),
('AI in Healthcare', 'ai-in-healthcare', 'Applications of artificial intelligence in clinical decision support, diagnostics, drug discovery, and healthcare operations optimization.', 'Artificial intelligence applications in healthcare.', 'cohort', 'published', 'Digital Health & Innovation', 'advanced', 4, 6, 50000, 70000),
('Generative AI for Clinicians', 'generative-ai-clinicians', 'Practical applications of generative AI in clinical documentation, patient communication, medical education, and workflow automation.', 'Generative AI tools for clinical practice.', 'cohort', 'published', 'Digital Health & Innovation', 'intermediate', 3, 4, 40000, 55000),
('Healthcare Cybersecurity', 'healthcare-cybersecurity', 'Protecting healthcare data and systems from cyber threats, including risk assessment, incident response, and compliance with security standards.', 'Healthcare data security and cyber protection.', 'cohort', 'published', 'Digital Health & Innovation', 'intermediate', 3, 5, 40000, 55000),
('Healthcare Data Privacy', 'healthcare-data-privacy', 'Understanding data protection regulations, patient consent, privacy-by-design, and implementing privacy programs in healthcare organizations.', 'Healthcare data protection and privacy compliance.', 'cohort', 'published', 'Digital Health & Innovation', 'intermediate', 2, 4, 30000, 40000),
('Digital Health Entrepreneurship', 'digital-health-entrepreneurship', 'Building and scaling digital health ventures including business models, funding, regulatory pathways, and go-to-market strategies.', 'Digital health startup and innovation.', 'cohort', 'published', 'Digital Health & Innovation', 'intermediate', 4, 5, 45000, 60000),

-- E. Diagnostics & Allied Health Skills
('Ultrasound Training', 'ultrasound-training', 'Foundational ultrasound imaging techniques including physics, image optimization, and basic scanning protocols for various body systems.', 'Basic ultrasound imaging techniques.', 'cohort', 'published', 'Diagnostics & Allied Health', 'intermediate', 4, 6, 60000, 80000),
('Point-of-Care Ultrasound (POCUS)', 'point-of-care-ultrasound', 'Bedside ultrasound applications for rapid clinical assessment including FAST exam, cardiac views, and procedural guidance.', 'Bedside ultrasound for clinical assessment.', 'cohort', 'published', 'Diagnostics & Allied Health', 'intermediate', 3, 6, 55000, 75000),
('ECG Interpretation', 'ecg-interpretation', 'Systematic approach to ECG reading, recognizing normal and abnormal patterns, arrhythmias, and clinical correlation.', 'ECG reading and cardiac rhythm analysis.', 'cohort', 'published', 'Diagnostics & Allied Health', 'intermediate', 3, 4, 35000, 45000),
('Basic Radiology Interpretation', 'basic-radiology-interpretation', 'Reading common radiological images including chest X-rays, abdominal films, and skeletal imaging for clinical decision-making.', 'Basic radiological image interpretation.', 'cohort', 'published', 'Diagnostics & Allied Health', 'intermediate', 4, 5, 40000, 55000),
('Phlebotomy & Specimen Handling', 'phlebotomy-specimen-handling', 'Venipuncture techniques, specimen collection, handling, transport, and quality assurance in laboratory diagnostics.', 'Blood collection and specimen management.', 'cohort', 'published', 'Diagnostics & Allied Health', 'beginner', 2, 4, 25000, 35000),
('Wound Care & Basic Suturing', 'wound-care-basic-suturing', 'Assessment and management of wounds, suturing techniques, wound closure options, and post-procedure care.', 'Wound management and suturing skills.', 'cohort', 'published', 'Diagnostics & Allied Health', 'intermediate', 2, 4, 30000, 40000);

-- Create March 2026 Cohort for all new courses
INSERT INTO cohorts (course_id, title, start_date, end_date, application_deadline, is_active, max_students)
SELECT 
  id,
  'March 2026 Cohort',
  '2026-03-02'::date,
  '2026-04-30'::date,
  '2026-02-25 23:59:59'::timestamp,
  true,
  50
FROM courses 
WHERE slug IN (
  'basic-life-support-bls', 'advanced-cardiac-life-support-acls', 'pediatric-advanced-life-support-pals',
  'first-aid-cpr-aed', 'emergency-triage-assessment-treatment', 'infection-prevention-control',
  'antimicrobial-stewardship', 'patient-safety-quality-improvement', 'fundamentals-public-health',
  'applied-epidemiology', 'outbreak-investigation', 'health-policy-health-systems',
  'monitoring-evaluation', 'health-promotion-behaviour-change', 'research-methods-health-professionals',
  'biostatistics-health-professionals', 'evidence-based-medicine', 'clinical-audit-root-cause-analysis',
  'good-clinical-practice', 'grant-writing-health-research', 'health-it-project-management',
  'electronic-health-records', 'telemedicine-digital-health', 'healthcare-data-analytics',
  'ai-in-healthcare', 'generative-ai-clinicians', 'healthcare-cybersecurity',
  'healthcare-data-privacy', 'digital-health-entrepreneurship', 'ultrasound-training',
  'point-of-care-ultrasound', 'ecg-interpretation', 'basic-radiology-interpretation',
  'phlebotomy-specimen-handling', 'wound-care-basic-suturing'
);

-- Create February 2026 Cohort for Emergency & Life-Saving Skills courses
INSERT INTO cohorts (course_id, title, start_date, end_date, application_deadline, is_active, max_students)
SELECT 
  id,
  'February 2026 Cohort - Emergency & Life-Saving Skills',
  '2026-02-02'::date,
  '2026-03-15'::date,
  '2026-01-28 23:59:59'::timestamp,
  true,
  40
FROM courses 
WHERE slug IN (
  'basic-life-support-bls', 'advanced-cardiac-life-support-acls', 'pediatric-advanced-life-support-pals',
  'first-aid-cpr-aed', 'emergency-triage-assessment-treatment'
);

-- Add learning outcomes to courses
UPDATE courses SET learning_outcomes = ARRAY[
  'Perform high-quality CPR on adults',
  'Use an AED effectively',
  'Recognize cardiac arrest and respond appropriately',
  'Work as part of a resuscitation team'
] WHERE slug = 'basic-life-support-bls';

UPDATE courses SET learning_outcomes = ARRAY[
  'Manage cardiac arrest algorithms',
  'Interpret cardiac rhythms',
  'Lead a resuscitation team',
  'Administer emergency cardiac medications'
] WHERE slug = 'advanced-cardiac-life-support-acls';

UPDATE courses SET learning_outcomes = ARRAY[
  'Recognize pediatric emergencies',
  'Perform pediatric resuscitation',
  'Manage pediatric airways',
  'Apply PALS algorithms'
] WHERE slug = 'pediatric-advanced-life-support-pals';

UPDATE courses SET learning_outcomes = ARRAY[
  'Provide first aid for common injuries',
  'Perform CPR and use AED',
  'Respond to medical emergencies',
  'Manage bleeding and shock'
] WHERE slug = 'first-aid-cpr-aed';

UPDATE courses SET learning_outcomes = ARRAY[
  'Apply ETAT protocols',
  'Prioritize critically ill patients',
  'Recognize danger signs',
  'Initiate emergency treatments'
] WHERE slug = 'emergency-triage-assessment-treatment';

UPDATE courses SET learning_outcomes = ARRAY[
  'Implement infection control measures',
  'Use PPE correctly',
  'Manage outbreaks',
  'Conduct surveillance'
] WHERE slug = 'infection-prevention-control';

UPDATE courses SET learning_outcomes = ARRAY[
  'Apply antimicrobial stewardship principles',
  'Interpret resistance patterns',
  'Develop prescribing guidelines',
  'Implement stewardship programs'
] WHERE slug = 'antimicrobial-stewardship';

UPDATE courses SET learning_outcomes = ARRAY[
  'Identify patient safety risks',
  'Conduct root cause analysis',
  'Implement quality improvements',
  'Measure and report quality metrics'
] WHERE slug = 'patient-safety-quality-improvement';

UPDATE courses SET learning_outcomes = ARRAY[
  'Understand public health principles',
  'Apply epidemiological concepts',
  'Design health promotion interventions',
  'Analyze health data'
] WHERE slug = 'fundamentals-public-health';

UPDATE courses SET learning_outcomes = ARRAY[
  'Design epidemiological studies',
  'Analyze disease patterns',
  'Conduct surveillance',
  'Interpret epidemiological data'
] WHERE slug = 'applied-epidemiology';

UPDATE courses SET learning_outcomes = ARRAY[
  'Detect outbreaks early',
  'Investigate disease clusters',
  'Implement control measures',
  'Communicate findings'
] WHERE slug = 'outbreak-investigation';

UPDATE courses SET learning_outcomes = ARRAY[
  'Analyze health policies',
  'Understand health financing',
  'Strengthen health systems',
  'Engage stakeholders'
] WHERE slug = 'health-policy-health-systems';

UPDATE courses SET learning_outcomes = ARRAY[
  'Design M&E frameworks',
  'Develop indicators',
  'Collect and analyze data',
  'Report program outcomes'
] WHERE slug = 'monitoring-evaluation';

UPDATE courses SET learning_outcomes = ARRAY[
  'Apply behavior change theories',
  'Design health promotion campaigns',
  'Engage communities',
  'Evaluate interventions'
] WHERE slug = 'health-promotion-behaviour-change';

UPDATE courses SET learning_outcomes = ARRAY[
  'Design research studies',
  'Write research proposals',
  'Apply ethical principles',
  'Collect and analyze data'
] WHERE slug = 'research-methods-health-professionals';

UPDATE courses SET learning_outcomes = ARRAY[
  'Apply statistical methods',
  'Use statistical software',
  'Interpret results',
  'Present findings'
] WHERE slug = 'biostatistics-health-professionals';

UPDATE courses SET learning_outcomes = ARRAY[
  'Find clinical evidence',
  'Appraise research quality',
  'Apply evidence to practice',
  'Use clinical guidelines'
] WHERE slug = 'evidence-based-medicine';

UPDATE courses SET learning_outcomes = ARRAY[
  'Conduct clinical audits',
  'Perform root cause analysis',
  'Identify improvement opportunities',
  'Implement corrective actions'
] WHERE slug = 'clinical-audit-root-cause-analysis';

UPDATE courses SET learning_outcomes = ARRAY[
  'Apply GCP standards',
  'Ensure ethical conduct',
  'Manage trial data',
  'Maintain regulatory compliance'
] WHERE slug = 'good-clinical-practice';

UPDATE courses SET learning_outcomes = ARRAY[
  'Write compelling proposals',
  'Develop research budgets',
  'Navigate funder requirements',
  'Manage funded projects'
] WHERE slug = 'grant-writing-health-research';

UPDATE courses SET learning_outcomes = ARRAY[
  'Plan health IT projects',
  'Manage stakeholders',
  'Implement change management',
  'Evaluate project success'
] WHERE slug = 'health-it-project-management';

UPDATE courses SET learning_outcomes = ARRAY[
  'Implement EHR systems',
  'Optimize clinical workflows',
  'Ensure data quality',
  'Train end users'
] WHERE slug = 'electronic-health-records';

UPDATE courses SET learning_outcomes = ARRAY[
  'Design telemedicine programs',
  'Deliver virtual care',
  'Implement remote monitoring',
  'Navigate regulations'
] WHERE slug = 'telemedicine-digital-health';

UPDATE courses SET learning_outcomes = ARRAY[
  'Analyze healthcare data',
  'Create visualizations',
  'Build predictive models',
  'Support decision-making'
] WHERE slug = 'healthcare-data-analytics';

UPDATE courses SET learning_outcomes = ARRAY[
  'Apply AI in clinical settings',
  'Evaluate AI tools',
  'Implement AI solutions',
  'Address ethical considerations'
] WHERE slug = 'ai-in-healthcare';

UPDATE courses SET learning_outcomes = ARRAY[
  'Use generative AI tools',
  'Automate documentation',
  'Enhance patient communication',
  'Improve clinical workflows'
] WHERE slug = 'generative-ai-clinicians';

UPDATE courses SET learning_outcomes = ARRAY[
  'Assess cybersecurity risks',
  'Implement security controls',
  'Respond to incidents',
  'Ensure compliance'
] WHERE slug = 'healthcare-cybersecurity';

UPDATE courses SET learning_outcomes = ARRAY[
  'Apply privacy regulations',
  'Implement privacy controls',
  'Manage patient consent',
  'Design privacy programs'
] WHERE slug = 'healthcare-data-privacy';

UPDATE courses SET learning_outcomes = ARRAY[
  'Develop digital health ventures',
  'Create business models',
  'Navigate regulations',
  'Scale health innovations'
] WHERE slug = 'digital-health-entrepreneurship';

UPDATE courses SET learning_outcomes = ARRAY[
  'Perform basic ultrasound scans',
  'Optimize image quality',
  'Interpret findings',
  'Document examinations'
] WHERE slug = 'ultrasound-training';

UPDATE courses SET learning_outcomes = ARRAY[
  'Perform bedside ultrasound',
  'Apply FAST protocol',
  'Guide procedures',
  'Make rapid assessments'
] WHERE slug = 'point-of-care-ultrasound';

UPDATE courses SET learning_outcomes = ARRAY[
  'Read ECGs systematically',
  'Recognize arrhythmias',
  'Identify cardiac abnormalities',
  'Correlate findings clinically'
] WHERE slug = 'ecg-interpretation';

UPDATE courses SET learning_outcomes = ARRAY[
  'Read chest X-rays',
  'Interpret abdominal films',
  'Recognize abnormalities',
  'Support clinical decisions'
] WHERE slug = 'basic-radiology-interpretation';

UPDATE courses SET learning_outcomes = ARRAY[
  'Perform venipuncture safely',
  'Handle specimens correctly',
  'Ensure quality standards',
  'Manage complications'
] WHERE slug = 'phlebotomy-specimen-handling';

UPDATE courses SET learning_outcomes = ARRAY[
  'Assess wounds properly',
  'Perform suturing techniques',
  'Select closure methods',
  'Provide post-procedure care'
] WHERE slug = 'wound-care-basic-suturing';