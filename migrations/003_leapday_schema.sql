-- LEAP DAY microsite tables

-- Actions table
CREATE TABLE IF NOT EXISTS leapday_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  phase TEXT CHECK (phase IN ('before', 'day')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participations table
CREATE TABLE IF NOT EXISTS leapday_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  action_key TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies
ALTER TABLE leapday_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leapday_participations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to actions
CREATE POLICY "Allow public read access to actions" ON leapday_actions
  FOR SELECT USING (true);

-- Allow public insert access to participations
CREATE POLICY "Allow public insert access to participations" ON leapday_participations
  FOR INSERT WITH CHECK (true);

-- Allow public read access to participations (for stats)
CREATE POLICY "Allow public read access to participations" ON leapday_participations
  FOR SELECT USING (true);




