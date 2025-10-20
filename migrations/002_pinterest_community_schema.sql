-- Pinterest-style Community Module Database Schema
-- Extends existing tables minimally

-- Communities table (if not exists)
CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  creator_id UUID NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Actions table (extend existing if exists)
-- If actions table already exists, add missing columns:
ALTER TABLE actions ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE actions ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE actions ADD COLUMN IF NOT EXISTS community_id UUID;
ALTER TABLE actions ADD COLUMN IF NOT EXISTS stars_count INTEGER DEFAULT 0;
ALTER TABLE actions ADD COLUMN IF NOT EXISTS creator_id UUID;

-- Stars table (if not exists)
CREATE TABLE IF NOT EXISTS stars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, action_id)
);

-- Profiles table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon_url TEXT,
  stars_total INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table (optional, placeholder)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_communities_creator_id ON communities(creator_id);
CREATE INDEX IF NOT EXISTS idx_communities_tags ON communities USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_actions_community_id ON actions(community_id);
CREATE INDEX IF NOT EXISTS idx_actions_creator_id ON actions(creator_id);
CREATE INDEX IF NOT EXISTS idx_actions_tags ON actions USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_actions_stars_count ON actions(stars_count DESC);
CREATE INDEX IF NOT EXISTS idx_stars_user_id ON stars(user_id);
CREATE INDEX IF NOT EXISTS idx_stars_action_id ON stars(action_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_action_id ON comments(action_id);

-- RLS Policies (Row Level Security)
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Communities policies
CREATE POLICY "Communities are viewable by everyone" ON communities
  FOR SELECT USING (true);

CREATE POLICY "Users can create communities" ON communities
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own communities" ON communities
  FOR UPDATE USING (auth.uid() = creator_id);

-- Actions policies
CREATE POLICY "Actions are viewable by everyone" ON actions
  FOR SELECT USING (true);

CREATE POLICY "Users can create actions" ON actions
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own actions" ON actions
  FOR UPDATE USING (auth.uid() = creator_id);

-- Stars policies
CREATE POLICY "Users can view all stars" ON stars
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own stars" ON stars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stars" ON stars
  FOR DELETE USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Functions for updating counts
CREATE OR REPLACE FUNCTION update_action_stars_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE actions 
    SET stars_count = stars_count + 1 
    WHERE id = NEW.action_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE actions 
    SET stars_count = stars_count - 1 
    WHERE id = OLD.action_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stars count
CREATE TRIGGER update_action_stars_count_trigger
  AFTER INSERT OR DELETE ON stars
  FOR EACH ROW EXECUTE FUNCTION update_action_stars_count();

-- Function to update user's total stars
CREATE OR REPLACE FUNCTION update_user_stars_total()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET stars_total = stars_total + 1 
    WHERE user_id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles 
    SET stars_total = stars_total - 1 
    WHERE user_id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user's total stars
CREATE TRIGGER update_user_stars_total_trigger
  AFTER INSERT OR DELETE ON stars
  FOR EACH ROW EXECUTE FUNCTION update_user_stars_total();
