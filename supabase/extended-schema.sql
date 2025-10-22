-- Extended Supabase Database Schema for Hoshii Platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table (replaces sky_events)
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url_slug TEXT UNIQUE NOT NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT,
  website TEXT,
  image_url TEXT,
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'cancelled')) DEFAULT 'planning',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support actions table (user interactions with projects)
CREATE TABLE public.support_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT CHECK (action_type IN ('support', 'comment', 'star', 'participation')) NOT NULL,
  comment TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily statistics table
CREATE TABLE public.daily_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_supports INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_participations INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, date)
);

-- Project participants table (for tracking who joined each project)
CREATE TABLE public.project_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Insert default projects
INSERT INTO public.projects (title, description, url_slug, creator_id, category, start_date, end_date, location, website) VALUES
('茨城Frogs Leapday', 'Leapdayの星空を満天の星にしよう', 'leapday', 
 (SELECT id FROM auth.users LIMIT 1), 'コミュニティ', '2024-02-29', '2024-02-29', '茨城県', 'https://example.com');

-- Row Level Security (RLS) policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_participants ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view all projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = creator_id);

-- Support actions policies
CREATE POLICY "Users can view all support actions" ON public.support_actions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own support actions" ON public.support_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily stats policies
CREATE POLICY "Users can view daily stats" ON public.daily_stats
  FOR SELECT USING (true);

-- Project participants policies
CREATE POLICY "Users can view project participants" ON public.project_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join projects" ON public.project_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave projects" ON public.project_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, age, gender)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 0),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'prefer_not_to_say')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update daily stats
CREATE OR REPLACE FUNCTION public.update_daily_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.daily_stats (project_id, date, total_supports, total_comments, total_participations, unique_users)
  VALUES (
    NEW.project_id,
    CURRENT_DATE,
    CASE WHEN NEW.action_type = 'support' THEN 1 ELSE 0 END,
    CASE WHEN NEW.action_type = 'comment' THEN 1 ELSE 0 END,
    CASE WHEN NEW.action_type = 'participation' THEN 1 ELSE 0 END,
    1
  )
  ON CONFLICT (project_id, date)
  DO UPDATE SET
    total_supports = daily_stats.total_supports + CASE WHEN NEW.action_type = 'support' THEN 1 ELSE 0 END,
    total_comments = daily_stats.total_comments + CASE WHEN NEW.action_type = 'comment' THEN 1 ELSE 0 END,
    total_participations = daily_stats.total_participations + CASE WHEN NEW.action_type = 'participation' THEN 1 ELSE 0 END,
    unique_users = (
      SELECT COUNT(DISTINCT user_id) 
      FROM public.support_actions 
      WHERE project_id = NEW.project_id 
      AND DATE(created_at) = CURRENT_DATE
    ),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating daily stats
CREATE TRIGGER on_support_action_created
  AFTER INSERT ON public.support_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_daily_stats();

-- Function to get project statistics
CREATE OR REPLACE FUNCTION public.get_project_stats(project_uuid UUID)
RETURNS TABLE (
  total_stars BIGINT,
  total_participants BIGINT,
  total_comments BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN sa.action_type = 'star' THEN 1 ELSE 0 END), 0) as total_stars,
    COALESCE(COUNT(DISTINCT pp.user_id), 0) as total_participants,
    COALESCE(SUM(CASE WHEN sa.action_type = 'comment' THEN 1 ELSE 0 END), 0) as total_comments
  FROM public.projects p
  LEFT JOIN public.support_actions sa ON p.id = sa.project_id
  LEFT JOIN public.project_participants pp ON p.id = pp.project_id
  WHERE p.id = project_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table (replaces sky_events)
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url_slug TEXT UNIQUE NOT NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT,
  website TEXT,
  image_url TEXT,
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'cancelled')) DEFAULT 'planning',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support actions table (user interactions with projects)
CREATE TABLE public.support_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT CHECK (action_type IN ('support', 'comment', 'star', 'participation')) NOT NULL,
  comment TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily statistics table
CREATE TABLE public.daily_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_supports INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_participations INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, date)
);

-- Project participants table (for tracking who joined each project)
CREATE TABLE public.project_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Insert default projects
INSERT INTO public.projects (title, description, url_slug, creator_id, category, start_date, end_date, location, website) VALUES
('茨城Frogs Leapday', 'Leapdayの星空を満天の星にしよう', 'leapday', 
 (SELECT id FROM auth.users LIMIT 1), 'コミュニティ', '2024-02-29', '2024-02-29', '茨城県', 'https://example.com');

-- Row Level Security (RLS) policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_participants ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view all projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = creator_id);

-- Support actions policies
CREATE POLICY "Users can view all support actions" ON public.support_actions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own support actions" ON public.support_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily stats policies
CREATE POLICY "Users can view daily stats" ON public.daily_stats
  FOR SELECT USING (true);

-- Project participants policies
CREATE POLICY "Users can view project participants" ON public.project_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join projects" ON public.project_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave projects" ON public.project_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, age, gender)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 0),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'prefer_not_to_say')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update daily stats
CREATE OR REPLACE FUNCTION public.update_daily_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.daily_stats (project_id, date, total_supports, total_comments, total_participations, unique_users)
  VALUES (
    NEW.project_id,
    CURRENT_DATE,
    CASE WHEN NEW.action_type = 'support' THEN 1 ELSE 0 END,
    CASE WHEN NEW.action_type = 'comment' THEN 1 ELSE 0 END,
    CASE WHEN NEW.action_type = 'participation' THEN 1 ELSE 0 END,
    1
  )
  ON CONFLICT (project_id, date)
  DO UPDATE SET
    total_supports = daily_stats.total_supports + CASE WHEN NEW.action_type = 'support' THEN 1 ELSE 0 END,
    total_comments = daily_stats.total_comments + CASE WHEN NEW.action_type = 'comment' THEN 1 ELSE 0 END,
    total_participations = daily_stats.total_participations + CASE WHEN NEW.action_type = 'participation' THEN 1 ELSE 0 END,
    unique_users = (
      SELECT COUNT(DISTINCT user_id) 
      FROM public.support_actions 
      WHERE project_id = NEW.project_id 
      AND DATE(created_at) = CURRENT_DATE
    ),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating daily stats
CREATE TRIGGER on_support_action_created
  AFTER INSERT ON public.support_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_daily_stats();

-- Function to get project statistics
CREATE OR REPLACE FUNCTION public.get_project_stats(project_uuid UUID)
RETURNS TABLE (
  total_stars BIGINT,
  total_participants BIGINT,
  total_comments BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN sa.action_type = 'star' THEN 1 ELSE 0 END), 0) as total_stars,
    COALESCE(COUNT(DISTINCT pp.user_id), 0) as total_participants,
    COALESCE(SUM(CASE WHEN sa.action_type = 'comment' THEN 1 ELSE 0 END), 0) as total_comments
  FROM public.projects p
  LEFT JOIN public.support_actions sa ON p.id = sa.project_id
  LEFT JOIN public.project_participants pp ON p.id = pp.project_id
  WHERE p.id = project_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


