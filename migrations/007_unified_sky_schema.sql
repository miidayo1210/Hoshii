-- 統一星空システムのスキーマ
-- 既存のleapdayテーブルは残しつつ、新しい統一システムを追加

-- 星空（スコープ）
create table if not exists public.skies(
  id text primary key,            -- SkyId
  title text not null,
  created_at timestamptz default now()
);

-- 行動メニュー（この星空で許容するアクション）
create table if not exists public.actions(
  id uuid primary key default gen_random_uuid(),
  sky_id text not null references public.skies(id) on delete cascade,
  key text not null,
  label text not null,
  kind text check (kind in ('in_person','online')) default 'in_person',
  weight int default 1,
  phase text check (phase in ('before','day')),
  unique(sky_id, key)
);

-- 参加（星が増えるソース）: コメント付きなら"言葉"としても扱う
create table if not exists public.participations(
  id uuid primary key default gen_random_uuid(),
  sky_id text not null references public.skies(id) on delete cascade,
  action_key text not null,   -- actions.key
  name text,
  email text,
  comment text,
  created_at timestamptz default now()
);

-- 集計ビュー（任意）
create view public.summarized_stars as
select 
  p.sky_id,
  sum(coalesce(a.weight,1))::int as total_stars,
  count(*)::int as total_actions,
  max(p.created_at) as updated_at
from participations p
left join actions a on a.sky_id = p.sky_id and a.key = p.action_key
group by p.sky_id;

-- RLS設定
alter table public.skies enable row level security;
alter table public.actions enable row level security;
alter table public.participations enable row level security;

-- 公共読み取り・投稿ポリシー
create policy "public read skies" on public.skies for select using (true);
create policy "public read actions" on public.actions for select using (true);
create policy "public read participations" on public.participations for select using (true);
create policy "public insert participations" on public.participations for insert with check (true);

-- 初期データ投入
insert into public.skies (id, title) values 
  ('LEAPDAY2025', 'LEAP DAY 2025'),
  ('member:aoi', 'あおいの星空'),
  ('member:rin', 'りんの星空'),
  ('member:sora', 'そらの星空'),
  ('member:haru', 'はるの星空'),
  ('member:kaito', 'かいとの星空'),
  ('member:mizu', 'みずの星空'),
  ('member:yume', 'ゆめの星空'),
  ('member:tsuki', 'つきの星空'),
  ('member:hikari', 'ひかりの星空'),
  ('member:hina', 'ひなの星空'),
  ('member:riku', 'りくの星空')
on conflict (id) do nothing;

-- メンバー用アクション定義
insert into public.actions (sky_id, key, label, kind, weight, phase) values 
  ('member:aoi', 'leapday_support', 'LEAP DAYを応援する', 'in_person', 1, 'before'),
  ('member:aoi', 'ibarakai_memory', '茨城の思い出を教えて', 'in_person', 1, 'before'),
  ('member:aoi', 'student_life', '学生時代はどのような子供だった？', 'in_person', 1, 'before'),
  ('member:aoi', 'parent_thanks', '両親に感謝の気持ちを伝えてみよう', 'in_person', 1, 'before'),
  ('member:aoi', 'business_card', '隣の人と名刺交換する', 'in_person', 1, 'day'),
  ('member:aoi', 'kind_heart', '優しい気持ちでいる', 'in_person', 1, 'day'),
  ('member:aoi', 'pick_trash', 'ゴミを拾う', 'in_person', 1, 'day'),
  ('member:aoi', 'vote', '投票する', 'in_person', 1, 'day')
on conflict (sky_id, key) do nothing;

-- 他のメンバーにも同じアクションを複製
do $$
declare
  member_slugs text[] := array['rin', 'sora', 'haru', 'kaito', 'mizu', 'yume', 'tsuki', 'hikari', 'hina', 'riku'];
  action_keys text[] := array['leapday_support', 'ibarakai_memory', 'student_life', 'parent_thanks', 'business_card', 'kind_heart', 'pick_trash', 'vote'];
  member_slug text;
  action_key text;
begin
  foreach member_slug in array member_slugs loop
    foreach action_key in array action_keys loop
      insert into public.actions (sky_id, key, label, kind, weight, phase)
      select 
        'member:' || member_slug,
        action_key,
        label,
        kind,
        weight,
        phase
      from public.actions 
      where sky_id = 'member:aoi' and key = action_key
      on conflict (sky_id, key) do nothing;
    end loop;
  end loop;
end $$;
