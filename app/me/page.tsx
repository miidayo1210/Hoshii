'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Eye, Star, Users, Clock, Plus, BarChart3, Heart } from 'lucide-react';

interface ProjectRow {
  id: string;
  title: string;
  url_slug: string;
  description?: string;
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  participants_count?: number;
  total_supports?: number;
}

export default function MePage(){
  const { user, loading } = useAuth();
  const [created, setCreated] = useState<ProjectRow[]>([]);
  const [joined, setJoined] = useState<ProjectRow[]>([]);
  const [liked, setLiked] = useState<ProjectRow[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageViews, setPageViews] = useState<Record<string, number>>({});

  useEffect(() => {
    async function load(){
      if (!user) return;
      setIsLoading(true);

      const createdRes = await supabase
        .from('projects_stats_view')
        .select('id, title, url_slug, description, status, start_date, end_date, participants_count, total_supports')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
      if (!createdRes.error && createdRes.data) setCreated(createdRes.data as any);

      const partIds = (await supabase.from('project_participants').select('project_id').eq('user_id', user.id)).data?.map((r: any) => r.project_id) || [];
      const joinedRes = partIds.length ? await supabase
        .from('projects_stats_view')
        .select('id, title, url_slug, description, status, start_date, end_date, participants_count, total_supports')
        .in('id', partIds) : { data: [], error: null } as any;
      if (!joinedRes.error && joinedRes.data) setJoined(joinedRes.data as any);

      // いいねしたプロジェクトを取得
      const likedIds = (await supabase.from('project_likes').select('project_id').eq('user_id', user.id)).data?.map((r: any) => r.project_id) || [];
      const likedRes = likedIds.length ? await supabase
        .from('projects_stats_view')
        .select('id, title, url_slug, description, status, start_date, end_date, participants_count, total_supports')
        .in('id', likedIds) : { data: [], error: null } as any;
      if (!likedRes.error && likedRes.data) setLiked(likedRes.data as any);

      const actionsRes = await supabase
        .from('project_supports')
        .select('project_id, action_type, comment, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!actionsRes.error && actionsRes.data) setActions(actionsRes.data);

      // ページビュー数を取得（管理者またはプロジェクト作成者のみ）
      const isAdmin = Boolean((user.user_metadata as any)?.is_admin);
      console.log('isAdmin:', isAdmin, 'created.length:', created.length);
      
      if (isAdmin || created.length > 0) {
        const projectIds = created.map(p => p.id);
        console.log('projectIds:', projectIds);
        
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('analytics_events')
          .select('project_id, event_type')
          .eq('event_type', 'pageview')
          .in('project_id', projectIds);

        console.log('analyticsData:', analyticsData, 'error:', analyticsError);

        if (analyticsData) {
          const views: Record<string, number> = {};
          analyticsData.forEach(event => {
            if (event.project_id) {
              views[event.project_id] = (views[event.project_id] || 0) + 1;
            }
          });
          console.log('views:', views);
          setPageViews(views);
        }
      }

      setIsLoading(false);
    }
    if (!loading && user) load();
  }, [loading, user]);

  if (loading || isLoading){
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌟</div>
          <div className="text-hoshii-ink">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!user){
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-hoshii-ink">ログインが必要です</p>
          <Link href="/">
            <Button className="mt-4 bg-hoshii-green hover:bg-hoshii-green/90 text-white">ログインページへ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-hoshii-ink">マイページ</h1>
            <p className="text-hoshii-ink/70">{user.user_metadata?.name || user.email} さんのダッシュボード</p>
          </div>
          <Link href="/projects/create">
            <Button className="bg-white text-hoshii-ink border border-white/70 shadow-soft hover:shadow-card">
              <Plus className="h-4 w-4 mr-2"/> プロジェクトを立ち上げる
            </Button>
          </Link>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-hoshii-ink mb-3">自分が立ち上げたプロジェクト</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {created.map((p) => (
              <Card key={p.id} className="bg-white border border-white/70 rounded-2xl shadow-soft">
                <CardHeader>
                  <CardTitle className="text-hoshii-ink">{p.title}</CardTitle>
                  <CardDescription className="text-hoshii-ink/70">{p.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex gap-6 text-sm text-hoshii-ink/70">
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4"/>{p.start_date}〜{p.end_date}</div>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4"/>{p.total_supports ?? 0}</div>
                    <div className="flex items-center gap-1"><Users className="h-4 w-4"/>{p.participants_count ?? 0}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/projects/${p.url_slug}`}>
                      <Button size="sm" className="bg-white text-hoshii-ink border border-white/70"> <Eye className="h-4 w-4 mr-1"/> 見る</Button>
                    </Link>
                    <Link href={`/projects/${p.url_slug}/edit`}>
                      <Button size="sm" variant="outline" className="border-hoshii-green text-hoshii-green"> <Edit3 className="h-4 w-4 mr-1"/> 編集</Button>
                    </Link>
                    <div className="flex items-center gap-1 text-sm text-hoshii-ink/70">
                      <Eye className="h-4 w-4"/>
                      <span>{pageViews[p.id] || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {created.length === 0 && (
              <div className="text-hoshii-ink/60">まだありません</div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-hoshii-ink mb-3">参加したプロジェクト</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {joined.map((p) => (
              <Card key={p.id} className="bg-white border border-white/70 rounded-2xl shadow-soft">
                <CardHeader>
                  <CardTitle className="text-hoshii-ink">{p.title}</CardTitle>
                  <CardDescription className="text-hoshii-ink/70">{p.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex gap-6 text-sm text-hoshii-ink/70">
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4"/>{p.start_date}〜{p.end_date}</div>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4"/>{p.total_supports ?? 0}</div>
                    <div className="flex items-center gap-1"><Users className="h-4 w-4"/>{p.participants_count ?? 0}</div>
                  </div>
                  <Link href={`/projects/${p.url_slug}`}>
                    <Button size="sm" className="bg-white text-hoshii-ink border border-white/70"> <Eye className="h-4 w-4 mr-1"/> 見る</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {joined.length === 0 && (
              <div className="text-hoshii-ink/60">まだありません</div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-hoshii-ink mb-3">いいねしたプロジェクト</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {liked.map((p) => (
              <Card key={p.id} className="bg-white border border-white/70 rounded-2xl shadow-soft">
                <CardHeader>
                  <CardTitle className="text-hoshii-ink">{p.title}</CardTitle>
                  <CardDescription className="text-hoshii-ink/70">{p.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex gap-6 text-sm text-hoshii-ink/70">
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4"/>{p.start_date}〜{p.end_date}</div>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4"/>{p.total_supports ?? 0}</div>
                    <div className="flex items-center gap-1"><Users className="h-4 w-4"/>{p.participants_count ?? 0}</div>
                  </div>
                  <Link href={`/projects/${p.url_slug}`}>
                    <Button size="sm" className="bg-white text-hoshii-ink border border-white/70"> <Eye className="h-4 w-4 mr-1"/> 見る</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {liked.length === 0 && (
              <div className="text-hoshii-ink/60">まだありません</div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-hoshii-ink mb-3">コレクション</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {joined.filter(p => p.status === 'completed').map((p) => (
              <Card key={p.id} className="bg-white border border-white/70 rounded-2xl shadow-soft">
                <CardHeader>
                  <CardTitle className="text-hoshii-ink flex items-center gap-2">
                    <span className="text-2xl">🌟</span>
                    {p.title}
                  </CardTitle>
                  <CardDescription className="text-hoshii-ink/70">{p.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex gap-6 text-sm text-hoshii-ink/70">
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4"/>{p.start_date}〜{p.end_date}</div>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4"/>{p.total_supports ?? 0}</div>
                    <div className="flex items-center gap-1"><Users className="h-4 w-4"/>{p.participants_count ?? 0}</div>
                  </div>
                  <Link href={`/projects/${p.url_slug}`}>
                    <Button size="sm" className="bg-white text-hoshii-ink border border-white/70"> <Eye className="h-4 w-4 mr-1"/> 見る</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {joined.filter(p => p.status === 'completed').length === 0 && (
              <div className="text-hoshii-ink/60">完成した作品はまだありません</div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-hoshii-ink mb-3">自分の行動</h2>
          <Card className="bg-white border border-white/70 rounded-2xl shadow-soft">
            <CardContent className="divide-y divide-gray-100 p-0">
              {actions.length === 0 && (
                <div className="p-4 text-hoshii-ink/60">まだありません</div>
              )}
              {actions.map((a, idx) => (
                <div key={idx} className="p-4 text-sm text-hoshii-ink/80 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{a.action_type}</span>
                    {a.comment ? <span className="ml-2">「{a.comment}」</span> : null}
                  </div>
                  <div className="text-hoshii-ink/50">{new Date(a.created_at).toLocaleString('ja-JP')}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}