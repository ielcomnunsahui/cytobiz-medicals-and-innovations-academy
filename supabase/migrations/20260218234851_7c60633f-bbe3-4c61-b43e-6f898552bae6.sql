-- Update all courses to self_paced
UPDATE courses SET course_type = 'self_paced' WHERE course_type = 'cohort';
