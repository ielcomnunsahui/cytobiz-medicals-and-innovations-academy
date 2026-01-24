-- Add original_price and discounted_price columns to courses table
ALTER TABLE public.courses
ADD COLUMN original_price numeric DEFAULT NULL,
ADD COLUMN discounted_price numeric DEFAULT NULL;

-- Migrate existing price data: set original_price to current price value
UPDATE public.courses
SET original_price = price
WHERE price IS NOT NULL AND price > 0;

-- Add a comment for clarity
COMMENT ON COLUMN public.courses.original_price IS 'The standard/slashed price shown as crossed out';
COMMENT ON COLUMN public.courses.discounted_price IS 'The actual discounted price customers pay';