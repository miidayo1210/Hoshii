-- Additional schema for member support and voting system
-- Run this in Supabase SQL Editor after the main member schema

-- Member support/votes table
CREATE TABLE IF NOT EXISTS leapday_member_support (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES leapday_members(id) ON DELETE CASCADE,
  supporter_name TEXT NOT NULL,
  supporter_email TEXT,
  comment TEXT,
  support_type TEXT DEFAULT 'general' CHECK (support_type IN ('general', 'audience_award')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audience award votes table (separate from general support)
CREATE TABLE IF NOT EXISTS leapday_audience_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES leapday_members(id) ON DELETE CASCADE,
  voter_name TEXT NOT NULL,
  voter_email TEXT,
  vote_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for new tables
ALTER TABLE leapday_member_support ENABLE ROW LEVEL SECURITY;
ALTER TABLE leapday_audience_votes ENABLE ROW LEVEL SECURITY;

-- Public read access for support
CREATE POLICY "public read support" ON leapday_member_support FOR SELECT USING (true);

-- Public insert for support (anyone can support)
CREATE POLICY "public insert support" ON leapday_member_support FOR INSERT WITH CHECK (true);

-- Public read access for votes
CREATE POLICY "public read votes" ON leapday_audience_votes FOR SELECT USING (true);

-- Public insert for votes (anyone can vote)
CREATE POLICY "public insert votes" ON leapday_audience_votes FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leapday_member_support_member_id ON leapday_member_support(member_id);
CREATE INDEX IF NOT EXISTS idx_leapday_member_support_created_at ON leapday_member_support(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leapday_audience_votes_member_id ON leapday_audience_votes(member_id);
CREATE INDEX IF NOT EXISTS idx_leapday_audience_votes_created_at ON leapday_audience_votes(created_at DESC);

-- Function to get member support count
CREATE OR REPLACE FUNCTION get_member_support_count(member_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM leapday_member_support 
    WHERE member_id = member_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get member audience vote count
CREATE OR REPLACE FUNCTION get_member_vote_count(member_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM leapday_audience_votes 
    WHERE member_id = member_uuid
  );
END;
$$ LANGUAGE plpgsql;

