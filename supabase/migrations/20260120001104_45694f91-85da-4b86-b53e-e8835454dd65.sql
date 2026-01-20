-- =============================================
-- CYTOBIZ ACADEMY LMS DATABASE SCHEMA
-- =============================================

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'facilitator', 'learner');

-- 2. Create course_type enum
CREATE TYPE public.course_type AS ENUM ('cohort', 'self_paced');

-- 3. Create course_status enum  
CREATE TYPE public.course_status AS ENUM ('draft', 'published', 'archived');

-- =============================================
-- CORE TABLES
-- =============================================

-- 4. Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 5. User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'learner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- 6. Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  course_type course_type NOT NULL DEFAULT 'self_paced',
  status course_status NOT NULL DEFAULT 'draft',
  price DECIMAL(10, 2) DEFAULT 0,
  duration_weeks INTEGER,
  effort_hours_per_week INTEGER,
  level TEXT DEFAULT 'beginner',
  category TEXT,
  learning_outcomes TEXT[],
  prerequisites TEXT[],
  target_audience TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 7. Cohorts table
CREATE TABLE public.cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_students INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 8. Facilitator cohorts (many-to-many)
CREATE TABLE public.facilitator_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE NOT NULL,
  facilitator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(cohort_id, facilitator_id)
);

-- 9. Modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 10. Lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 11. Assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_days INTEGER,
  max_points INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 12. Enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  cohort_id UUID REFERENCES public.cohorts(id) ON DELETE SET NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- 13. Submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  learner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  file_url TEXT,
  grade INTEGER,
  feedback TEXT,
  graded_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  graded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(assignment_id, learner_id)
);

-- 14. Lesson progress table
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- 15. Certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  verification_code TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, course_id)
);

-- 16. Facilitators table (for public display)
CREATE TABLE public.facilitators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  expertise TEXT[],
  linkedin_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 17. FAQs table
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- =============================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Function to check if user is facilitator for a course
CREATE OR REPLACE FUNCTION public.is_facilitator_for_course(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.facilitator_cohorts fc
    JOIN public.cohorts c ON c.id = fc.cohort_id
    WHERE fc.facilitator_id = _user_id AND c.course_id = _course_id
  )
$$;

-- Function to check if user is enrolled in course
CREATE OR REPLACE FUNCTION public.is_enrolled_in_course(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = _user_id AND course_id = _course_id
  )
$$;

-- Function to check cohort time window
CREATE OR REPLACE FUNCTION public.is_within_cohort_window(_cohort_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cohorts
    WHERE id = _cohort_id
    AND CURRENT_DATE BETWEEN start_date AND end_date
  )
$$;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilitator_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilitators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin(auth.uid()));

-- USER ROLES POLICIES (admin only for modifications)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- COURSES POLICIES
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage all courses"
  ON public.courses FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Facilitators can view assigned courses"
  ON public.courses FOR SELECT
  USING (public.is_facilitator_for_course(auth.uid(), id));

-- COHORTS POLICIES
CREATE POLICY "Anyone can view active cohorts of published courses"
  ON public.cohorts FOR SELECT
  USING (
    is_active = true 
    AND EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND status = 'published')
  );

CREATE POLICY "Admins can manage all cohorts"
  ON public.cohorts FOR ALL
  USING (public.is_admin(auth.uid()));

-- FACILITATOR COHORTS POLICIES
CREATE POLICY "Admins can manage facilitator assignments"
  ON public.facilitator_cohorts FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Facilitators can view their assignments"
  ON public.facilitator_cohorts FOR SELECT
  USING (auth.uid() = facilitator_id);

-- MODULES POLICIES
CREATE POLICY "Anyone can view modules of published courses"
  ON public.modules FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND status = 'published'));

CREATE POLICY "Admins can manage all modules"
  ON public.modules FOR ALL
  USING (public.is_admin(auth.uid()));

-- LESSONS POLICIES
CREATE POLICY "Enrolled users can view lessons"
  ON public.lessons FOR SELECT
  USING (
    is_free_preview = true
    OR EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.enrollments e ON e.course_id = m.course_id
      WHERE m.id = module_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all lessons"
  ON public.lessons FOR ALL
  USING (public.is_admin(auth.uid()));

-- ASSIGNMENTS POLICIES
CREATE POLICY "Enrolled users can view assignments"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      JOIN public.modules m ON m.id = l.module_id
      JOIN public.enrollments e ON e.course_id = m.course_id
      WHERE l.id = lesson_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all assignments"
  ON public.assignments FOR ALL
  USING (public.is_admin(auth.uid()));

-- ENROLLMENTS POLICIES
CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrollments"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all enrollments"
  ON public.enrollments FOR ALL
  USING (public.is_admin(auth.uid()));

-- SUBMISSIONS POLICIES
CREATE POLICY "Learners can view their own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = learner_id);

CREATE POLICY "Learners can create their own submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = learner_id);

CREATE POLICY "Learners can update ungraded submissions"
  ON public.submissions FOR UPDATE
  USING (auth.uid() = learner_id AND grade IS NULL);

CREATE POLICY "Admins and facilitators can view course submissions"
  ON public.submissions FOR SELECT
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.lessons l ON l.id = a.lesson_id
      JOIN public.modules m ON m.id = l.module_id
      WHERE a.id = assignment_id
      AND public.is_facilitator_for_course(auth.uid(), m.course_id)
    )
  );

CREATE POLICY "Admins can manage all submissions"
  ON public.submissions FOR ALL
  USING (public.is_admin(auth.uid()));

-- LESSON PROGRESS POLICIES
CREATE POLICY "Users can manage their own progress"
  ON public.lesson_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON public.lesson_progress FOR SELECT
  USING (public.is_admin(auth.uid()));

-- CERTIFICATES POLICIES
CREATE POLICY "Users can view their own certificates"
  ON public.certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can verify certificates"
  ON public.certificates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage all certificates"
  ON public.certificates FOR ALL
  USING (public.is_admin(auth.uid()));

-- FACILITATORS POLICIES (public display)
CREATE POLICY "Anyone can view facilitators"
  ON public.facilitators FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage facilitators"
  ON public.facilitators FOR ALL
  USING (public.is_admin(auth.uid()));

-- FAQS POLICIES
CREATE POLICY "Anyone can view FAQs"
  ON public.faqs FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage FAQs"
  ON public.faqs FOR ALL
  USING (public.is_admin(auth.uid()));

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  -- Assign default learner role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'learner');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at
  BEFORE UPDATE ON public.cohorts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_cohorts_course_id ON public.cohorts(course_id);
CREATE INDEX idx_modules_course_id ON public.modules(course_id);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_assignments_lesson_id ON public.assignments(lesson_id);
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_submissions_learner_id ON public.submissions(learner_id);
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX idx_certificates_verification_code ON public.certificates(verification_code);