
-- Update all courses to discounted_price 15000 except Public Health Project Management
UPDATE public.courses SET discounted_price = 15000 WHERE slug != 'public-health-project-management';

-- Make Public Health Project Management free
UPDATE public.courses SET discounted_price = 0, price = 0 WHERE slug = 'public-health-project-management';

-- Set duration_hours based on duration_weeks
UPDATE public.courses SET duration_hours = CASE
  WHEN duration_weeks = 1 THEN 8
  WHEN duration_weeks = 2 THEN 16
  WHEN duration_weeks = 3 THEN 24
  WHEN duration_weeks = 4 THEN 32
  WHEN duration_weeks = 8 THEN 64
  ELSE COALESCE(duration_weeks, 1) * 8
END;

-- Set default thumbnail for courses missing one
UPDATE public.courses SET thumbnail_url = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop'
WHERE thumbnail_url IS NULL OR thumbnail_url = '';
