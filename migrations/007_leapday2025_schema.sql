-- Leapday 2025 Members Schema
-- Run this in Supabase SQL Editor

-- Members table (extend existing if needed)
CREATE TABLE IF NOT EXISTS public.leapday_members_2025(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  nickname text NOT NULL,
  avatar_url text,
  cohort text DEFAULT 'IBK2025',
  challenge_domains text,
  interest_tags text[] DEFAULT '{}',
  activities text,
  want_to_meet text,
  self_tags text[] DEFAULT '{}',
  enthusiasm text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Member supports table
CREATE TABLE IF NOT EXISTS public.leapday_supports_2025(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES public.leapday_members_2025(id) ON DELETE CASCADE,
  supporter_name text NOT NULL,
  supporter_email text,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leapday_members_2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leapday_supports_2025 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "public read members 2025" ON public.leapday_members_2025 FOR SELECT USING (true);
CREATE POLICY "public read supports 2025" ON public.leapday_supports_2025 FOR SELECT USING (true);
CREATE POLICY "public insert supports 2025" ON public.leapday_supports_2025 FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leapday_members_2025_slug ON public.leapday_members_2025(slug);
CREATE INDEX IF NOT EXISTS idx_leapday_members_2025_cohort ON public.leapday_members_2025(cohort);
CREATE INDEX IF NOT EXISTS idx_leapday_supports_2025_member_id ON public.leapday_supports_2025(member_id);
CREATE INDEX IF NOT EXISTS idx_leapday_supports_2025_created_at ON public.leapday_supports_2025(created_at DESC);

-- Function to get member support count
CREATE OR REPLACE FUNCTION get_member_support_count(member_slug text)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.leapday_supports_2025 s
    JOIN public.leapday_members_2025 m ON s.member_id = m.id
    WHERE m.slug = member_slug
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;




