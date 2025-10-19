-- Migration: Add community module features
-- Date: $(date)
-- Description: Add product column to organizations, public_id to events, and public scan RPC

-- 1) organizations に product 列（business|community）を追加
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS product text
  CHECK (product in ('business','community'))
  DEFAULT 'business';

-- 2) events に public_id（公開用ID）を追加（なければ）
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS public_id text UNIQUE;

-- 既存データで null の場合は UUID を仮発番
UPDATE public.events
SET public_id = COALESCE(public_id, encode(gen_random_bytes(8), 'hex'))
WHERE public_id IS NULL;

-- 3) 公開スキャンRPC（未定義なら）
CREATE OR REPLACE FUNCTION public.add_action_and_star(
  p_public_id text,
  p_package_key text,
  p_value int,
  p_meta jsonb
) RETURNS TABLE (action_id uuid, star_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE v_event_id uuid;
BEGIN
  SELECT id INTO v_event_id FROM events WHERE public_id = p_public_id;
  IF v_event_id IS NULL THEN
    RAISE EXCEPTION 'invalid public id';
  END IF;

  INSERT INTO actions(event_id, package_key, meta)
  VALUES (v_event_id, p_package_key, p_meta)
  RETURNING id INTO action_id;

  INSERT INTO stars(event_id, value, source_action_id)
  VALUES (v_event_id, action_id, action_id)
  RETURNING id INTO star_id;

  RETURN NEXT;
END $$;

-- 権限設定
GRANT EXECUTE ON FUNCTION public.add_action_and_star(text,text,int,jsonb) TO anon, authenticated;
