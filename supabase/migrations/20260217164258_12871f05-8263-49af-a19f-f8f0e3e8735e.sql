
-- Add duration_hours column to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration_hours integer;

-- Migrate existing duration_weeks data to hours (rough estimate: 1 week = 40 hours for intensive, but we'll set reasonable defaults)
-- We'll update specific values via data updates

-- Add unique constraint for certificate_payments if not exists (for upsert support)
-- Already exists per error message, so skip
