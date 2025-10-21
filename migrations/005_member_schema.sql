-- Member invite system schema
-- Run this in Supabase SQL Editor

-- Invites table
CREATE TABLE IF NOT EXISTS leapday_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members table
CREATE TABLE IF NOT EXISTS leapday_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  sns TEXT[] DEFAULT '{}',
  challenge_domains TEXT,
  interest_tags TEXT[] DEFAULT '{}',
  activities TEXT,
  want_to_meet TEXT,
  self_tags TEXT[] DEFAULT '{}',
  enthusiasm TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE leapday_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE leapday_members ENABLE ROW LEVEL SECURITY;

-- Public read access for members
CREATE POLICY "public read members" ON leapday_members FOR SELECT USING (true);

-- Public read access for invites (to check if token exists)
CREATE POLICY "public read invites" ON leapday_invites FOR SELECT USING (true);

-- Admin insert for invites (you may need to adjust this based on your auth setup)
CREATE POLICY "admin insert invites" ON leapday_invites FOR INSERT WITH CHECK (true);

-- Members can insert themselves (for signup)
CREATE POLICY "public insert members" ON leapday_members FOR INSERT WITH CHECK (true);

-- Members can update themselves (by slug matching, you may want to add auth later)
CREATE POLICY "public update members" ON leapday_members FOR UPDATE USING (true);

-- Update invite as used
CREATE POLICY "public update invites" ON leapday_invites FOR UPDATE USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leapday_members_slug ON leapday_members(slug);
CREATE INDEX IF NOT EXISTS idx_leapday_members_created_at ON leapday_members(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leapday_invites_token ON leapday_invites(token);
CREATE INDEX IF NOT EXISTS idx_leapday_invites_used ON leapday_invites(used);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_leapday_members_updated_at 
    BEFORE UPDATE ON leapday_members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
