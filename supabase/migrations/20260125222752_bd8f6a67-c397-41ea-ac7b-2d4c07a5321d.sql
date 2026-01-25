-- Create modules and sample lessons for all March 2026 cohort courses
-- Each course gets 3 modules with 2-3 lessons each (first lesson marked as free preview)

DO $$
DECLARE
  course_record RECORD;
  module_id_1 UUID;
  module_id_2 UUID;
  module_id_3 UUID;
BEGIN
  -- Loop through all courses created for the March 2026 cohort
  FOR course_record IN 
    SELECT id, title, slug, category FROM courses 
    WHERE course_type = 'cohort' 
    AND status = 'published'
    AND created_at >= '2025-01-25'
  LOOP
    -- Module 1: Introduction & Foundations
    INSERT INTO modules (course_id, title, description, order_index)
    VALUES (
      course_record.id,
      'Module 1: Introduction & Foundations',
      'Get started with the fundamental concepts and core principles of ' || course_record.title,
      0
    ) RETURNING id INTO module_id_1;

    -- Module 2: Core Concepts & Practice
    INSERT INTO modules (course_id, title, description, order_index)
    VALUES (
      course_record.id,
      'Module 2: Core Concepts & Practice',
      'Deep dive into practical applications and hands-on techniques',
      1
    ) RETURNING id INTO module_id_2;

    -- Module 3: Advanced Applications
    INSERT INTO modules (course_id, title, description, order_index)
    VALUES (
      course_record.id,
      'Module 3: Advanced Applications & Case Studies',
      'Apply your knowledge to real-world scenarios and complex situations',
      2
    ) RETURNING id INTO module_id_3;

    -- Lessons for Module 1 (Introduction)
    INSERT INTO lessons (module_id, title, content, lesson_type, order_index, is_free_preview, duration_minutes)
    VALUES 
      (module_id_1, 'Course Overview & Learning Objectives', 
       '<h2>Welcome to ' || course_record.title || '</h2>
       <p>This course is designed to provide you with comprehensive knowledge and practical skills that are directly applicable to your healthcare career.</p>
       <h3>What You Will Learn</h3>
       <ul>
       <li>Core principles and foundational concepts</li>
       <li>Evidence-based practices and guidelines</li>
       <li>Hands-on skills through case studies</li>
       <li>Professional competencies required in the field</li>
       </ul>
       <h3>Course Structure</h3>
       <p>This course is divided into 3 main modules, each building upon the previous one. You will complete quizzes and assignments to reinforce your learning.</p>',
       'text', 0, true, 15),
      
      (module_id_1, 'Key Terminology & Concepts',
       '<h2>Essential Terminology</h2>
       <p>Before we dive deeper, let''s establish a common vocabulary that will be used throughout this course.</p>
       <p>Understanding these terms is crucial for effective communication in professional settings and for comprehending the literature in this field.</p>
       <h3>Key Definitions</h3>
       <p>This lesson covers the foundational vocabulary and concepts you need to master before proceeding to more advanced topics.</p>',
       'text', 1, false, 20),
      
      (module_id_1, 'Historical Context & Current Standards',
       '<h2>Evolution of the Field</h2>
       <p>Understanding where we came from helps us appreciate current practices and anticipate future developments.</p>
       <h3>Current Guidelines & Standards</h3>
       <p>We will review the latest evidence-based guidelines and professional standards that govern practice in this area.</p>',
       'text', 2, false, 25);

    -- Lessons for Module 2 (Core Concepts)
    INSERT INTO lessons (module_id, title, content, lesson_type, order_index, is_free_preview, duration_minutes)
    VALUES 
      (module_id_2, 'Practical Techniques & Methods',
       '<h2>Hands-On Approach</h2>
       <p>This lesson focuses on the practical application of the concepts learned in Module 1.</p>
       <h3>Step-by-Step Procedures</h3>
       <p>You will learn systematic approaches to common scenarios encountered in professional practice.</p>
       <h3>Best Practices</h3>
       <p>We cover industry-standard methods and techniques that are essential for competent practice.</p>',
       'text', 0, false, 30),
      
      (module_id_2, 'Tools & Resources',
       '<h2>Essential Tools for Practice</h2>
       <p>Learn about the tools, equipment, and resources you will use in your professional practice.</p>
       <h3>Technology Integration</h3>
       <p>Modern healthcare increasingly relies on technology. We explore how digital tools enhance practice.</p>',
       'text', 1, false, 25),
      
      (module_id_2, 'Simulation Exercise: Applying Core Skills',
       '<h2>Practical Application</h2>
       <p>This lesson provides a simulated scenario where you can apply the skills you have learned.</p>
       <h3>Learning by Doing</h3>
       <p>Work through realistic case scenarios and receive feedback on your approach.</p>',
       'text', 2, false, 35);

    -- Lessons for Module 3 (Advanced)
    INSERT INTO lessons (module_id, title, content, lesson_type, order_index, is_free_preview, duration_minutes)
    VALUES 
      (module_id_3, 'Complex Case Studies',
       '<h2>Real-World Scenarios</h2>
       <p>Examine complex cases that challenge you to integrate all your learning.</p>
       <h3>Critical Thinking</h3>
       <p>Develop your analytical skills by working through multi-faceted problems.</p>',
       'text', 0, false, 40),
      
      (module_id_3, 'Professional Integration & Ethics',
       '<h2>Ethical Considerations</h2>
       <p>Explore the ethical dimensions of practice and learn frameworks for ethical decision-making.</p>
       <h3>Professional Development</h3>
       <p>Understand how to continue growing professionally beyond this course.</p>',
       'text', 1, false, 30),
      
      (module_id_3, 'Assessment Preparation & Course Summary',
       '<h2>Course Review</h2>
       <p>Consolidate your learning with a comprehensive review of all key concepts.</p>
       <h3>Preparing for Certification</h3>
       <p>Get ready for your final assessment and understand how your certificate will be awarded.</p>
       <h3>Next Steps</h3>
       <p>Learn about opportunities for continued learning and professional advancement.</p>',
       'text', 2, false, 25);

  END LOOP;
END $$;