'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, BarChart2 } from 'lucide-react';

export default function ProjectInsightsPage(){
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  // authorization: admin or project creator
  useEffect(() => {
    async function check(){
      if (!user || !slug) return;
      const projectRes = await supabase.from('projects').select('id, creator_id').eq('url_slug', slug).single();
      if (projectRes.error || !projectRes.data){ setAuthorized(false); return; }
      const pid = projectRes.data.id as string;
      setProjectId(pid);

      // admin via user meta
      const isAdmin = Boolean((user.user_metadata as any)?.is_admin);
      if (isAdmin || projectRes.data.creator_id === user.id){
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    }
    if (!loading && user) check();
  }, [loading, user, slug]);

  useEffect(() => {
    async function load(){
      if (!projectId || authorized !== true) return;
      const { data } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(200);
      setEvents(data || []);
    }
    load();
  }, [projectId, authorized]);

  if (loading || authorized === null){
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌟</div>
          <div className="text-hoshii-ink">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!user || authorized === false){
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-hoshii-ink mb-2">閲覧権限がありません</h1>
          <p className="text-hoshii-ink/70">主催者または管理者のみが閲覧できます。</p>
          <Link href={`/projects/${slug}`}>
            <Button className="mt-4 bg-hoshii-green hover:bg-hoshii-green/90 text-white">プロジェクトへ戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Simple aggregates
  const totals = useMemo(() => {
    const pageviews = events.filter(e => e.event_type === 'pageview').length;
    const clicks = events.filter(e => e.event_type === 'click').length;
    return { pageviews, clicks };
  }, [events]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href={`/projects/${slug}`}>
            <Button variant="outline" className="border-hoshii-green text-hoshii-green hover:bg-hoshii-green hover:text-white"><ArrowLeft className="mr-2 h-4 w-4"/>戻る</Button>
          </Link>
          <h1 className="text-2xl font-bold text-hoshii-ink flex items-center gap-2"><BarChart2 className="h-5 w-5"/> インサイト</h1>
        </div>

        <Card className="kawaii-card border-0">
          <CardHeader>
            <CardTitle className="text-hoshii-ink">概要</CardTitle>
            <CardDescription className="text-hoshii-ink/70">基本的なイベント数の集計</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-hoshii-ink">{totals.pageviews}</div>
                <div className="text-sm text-hoshii-ink/70">ページビュー</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-hoshii-ink">{totals.clicks}</div>
                <div className="text-sm text-hoshii-ink/70">クリック</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="kawaii-card border-0">
          <CardHeader>
            <CardTitle className="text-hoshii-ink">最近のイベント</CardTitle>
            <CardDescription className="text-hoshii-ink/70">最新200件まで表示</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {events.length === 0 && <div className="text-hoshii-ink/60">まだイベントが記録されていません</div>}
              {events.map((e) => (
                <div key={e.id} className="py-2 text-sm text-hoshii-ink/80 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{e.event_type}</span>
                    {e.page && <span className="ml-2">{e.page}</span>}
                    {e.metadata && <span className="ml-2 text-hoshii-ink/60">{JSON.stringify(e.metadata)}</span>}
                  </div>
                  <div className="text-hoshii-ink/50">{new Date(e.created_at).toLocaleString('ja-JP')}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
