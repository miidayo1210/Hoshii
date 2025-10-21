-- Add action and weight columns to leapday_supports table
ALTER TABLE public.leapday_supports 
ADD COLUMN IF NOT EXISTS action text,
ADD COLUMN IF NOT EXISTS weight integer DEFAULT 1;

-- Add sky_id and weight columns to leapday_participations table
ALTER TABLE public.leapday_participations 
ADD COLUMN IF NOT EXISTS sky_id text,
ADD COLUMN IF NOT EXISTS weight integer DEFAULT 1;

-- Update RLS policy if needed
-- (The existing policies should work fine with the new columns)
