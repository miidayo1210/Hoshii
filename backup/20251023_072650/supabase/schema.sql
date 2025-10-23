-- Supabase Database Schema for Hoshii Platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  age_group TEXT CHECK (age_group IN ('10代', '20代', '30代', '40代', '50代', '60代以上')),
  gender TEXT CHECK (gender IN ('男性', '女性', 'その他', '回答しない')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sky events table (different starry sky events)
CREATE TABLE public.sky_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url_slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support actions table (user interactions with sky events)
CREATE TABLE public.support_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sky_event_id UUID REFERENCES public.sky_events(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT CHECK (action_type IN ('support', 'comment', 'star')) NOT NULL,
  comment TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily statistics table
CREATE TABLE public.daily_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sky_event_id UUID REFERENCES public.sky_events(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_supports INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sky_event_id, date)
);

-- Insert default sky events (idempotent)
INSERT INTO public.sky_events (name, description, url_slug) VALUES
('茨城Leapday2025', 'Leapdayの星空を満天の星にしよう', 'leapday'),
('コミュニティ星空', '地域コミュニティの応援星空', 'community'),
('環境保護星空', '地球環境を守るアクション星空', 'environment')
ON CONFLICT (url_slug) DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can view all support actions
CREATE POLICY "Users can view all support actions" ON public.support_actions
  FOR SELECT USING (true);

-- Users can insert their own support actions
CREATE POLICY "Users can insert own support actions" ON public.support_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view daily stats
CREATE POLICY "Users can view daily stats" ON public.daily_stats
  FOR SELECT USING (true);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, nickname, age_group, gender)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'nickname', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'age_group', ''),
    COALESCE(NEW.raw_user_meta_data->>'gender', '回答しない')
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
  INSERT INTO public.daily_stats (sky_event_id, date, total_supports, total_comments, unique_users)
  VALUES (
    NEW.sky_event_id,
    CURRENT_DATE,
    1,
    CASE WHEN NEW.action_type = 'comment' THEN 1 ELSE 0 END,
    1
  )
  ON CONFLICT (sky_event_id, date)
  DO UPDATE SET
    total_supports = daily_stats.total_supports + 1,
    total_comments = daily_stats.total_comments + CASE WHEN NEW.action_type = 'comment' THEN 1 ELSE 0 END,
    unique_users = (
      SELECT COUNT(DISTINCT user_id) 
      FROM public.support_actions 
      WHERE sky_event_id = NEW.sky_event_id 
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

-- =====================================================================
-- Projects and Participants (for Hoshii Projects feature)
-- =====================================================================

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url_slug TEXT UNIQUE NOT NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT,
  start_date DATE,
  end_date DATE,
  location TEXT,
  website TEXT,
  image_url TEXT,
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'cancelled')) DEFAULT 'planning',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Idempotent policy creation for projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='projects' AND policyname='Users can view all projects'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view all projects" ON public.projects FOR SELECT USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='projects' AND policyname='Users can create projects'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = creator_id)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='projects' AND policyname='Users can update own projects'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = creator_id)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='projects' AND policyname='Users can delete own projects'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = creator_id)';
  END IF;
END $$;

-- Project participants (unique per project/user)
CREATE TABLE IF NOT EXISTS public.project_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE public.project_participants ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='project_participants' AND policyname='Users can view project participants'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view project participants" ON public.project_participants FOR SELECT USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='project_participants' AND policyname='Users can join projects'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can join projects" ON public.project_participants FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='project_participants' AND policyname='Users can leave projects'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can leave projects" ON public.project_participants FOR DELETE USING (auth.uid() = user_id)';
  END IF;
END $$;

-- Convenience view to include creator nickname
DROP VIEW IF EXISTS public.projects_view CASCADE;
CREATE VIEW public.projects_view AS
SELECT
  p.id,
  p.title,
  p.description,
  p.url_slug,
  p.creator_id,
  COALESCE(up.nickname, up.name) AS creator_name,
  p.category,
  p.start_date,
  p.end_date,
  p.location,
  p.website,
  p.image_url,
  p.status,
  p.created_at,
  p.updated_at
FROM public.projects p
LEFT JOIN public.user_profiles up ON up.id = p.creator_id;

-- Allow public read on the view (respect RLS of base tables)
GRANT SELECT ON public.projects_view TO anon, authenticated;

-- ---------------------------------------------------------------------
-- Per-project supports (stars / supports / comments)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_supports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT CHECK (action_type IN ('support', 'comment', 'star', 'action_before', 'action_day')) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.project_supports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='project_supports' AND policyname='Users can view project supports'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view project supports" ON public.project_supports FOR SELECT USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='project_supports' AND policyname='Users can insert own project supports'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert own project supports" ON public.project_supports FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- Aggregated stats per project
-- ---------------------------------------------------------------------
DROP VIEW IF EXISTS public.projects_stats_view CASCADE;
CREATE VIEW public.projects_stats_view AS
SELECT
  p.id,
  p.title,
  p.description,
  p.url_slug,
  p.creator_id,
  COALESCE(up.nickname, up.name) AS creator_name,
  p.category,
  p.start_date,
  p.end_date,
  p.location,
  p.website,
  p.image_url,
  p.status,
  p.created_at,
  p.updated_at,
  COALESCE(ps.supports_count, 0) AS total_supports,
  COALESCE(ps.comments_count, 0) AS total_comments,
  COALESCE(pp.participants_count, 0) AS participants_count
FROM public.projects p
LEFT JOIN public.user_profiles up ON up.id = p.creator_id
LEFT JOIN (
  SELECT
    project_id,
    COUNT(*) FILTER (WHERE action_type IN ('support','star')) AS supports_count,
    COUNT(*) FILTER (WHERE action_type = 'comment') AS comments_count
  FROM public.project_supports
  GROUP BY project_id
) ps ON ps.project_id = p.id
LEFT JOIN (
  SELECT project_id, COUNT(*) AS participants_count
  FROM public.project_participants
  GROUP BY project_id
) pp ON pp.project_id = p.id;

GRANT SELECT ON public.projects_stats_view TO anon, authenticated;

-- Analytics: basic event logging
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  project_id UUID NULL REFERENCES public.projects(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  page TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (we accept anon traffic); user_id will be NULL if not logged in
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='analytics_events' AND policyname='Anyone can insert analytics') THEN EXECUTE 'CREATE POLICY "Anyone can insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true)'; END IF; END $$;

-- Helper: check admin flag on profile
CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT (raw_user_meta_data->>'is_admin')::BOOLEAN FROM auth.users WHERE id = uid), false);
$$ LANGUAGE sql STABLE;

-- Allow select only for project creators for their project events, or admins
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='analytics_events' AND policyname='Creators or admins can select analytics') THEN EXECUTE 'CREATE POLICY "Creators or admins can select analytics" ON public.analytics_events FOR SELECT USING (
  public.is_admin(auth.uid()) OR (
    project_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.projects p WHERE p.id = analytics_events.project_id AND p.creator_id = auth.uid()
    )
  )
)'; END IF; END $$;

-- =====================================================================
-- Project Likes (いいね機能)
-- =====================================================================

-- Project likes table
CREATE TABLE IF NOT EXISTS public.project_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;

-- Users can view all project likes
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='project_likes' AND policyname='Users can view project likes') THEN EXECUTE 'CREATE POLICY "Users can view project likes" ON public.project_likes FOR SELECT USING (true)'; END IF; END $$;

-- Users can insert their own likes
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='project_likes' AND policyname='Users can insert own likes') THEN EXECUTE 'CREATE POLICY "Users can insert own likes" ON public.project_likes FOR INSERT WITH CHECK (auth.uid() = user_id)'; END IF; END $$;

-- Users can delete their own likes
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='project_likes' AND policyname='Users can delete own likes') THEN EXECUTE 'CREATE POLICY "Users can delete own likes" ON public.project_likes FOR DELETE USING (auth.uid() = user_id)'; END IF; END $$;




