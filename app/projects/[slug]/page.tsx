'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { logEvent } from '@/lib/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Star, Users } from 'lucide-react';

export default function ProjectDetailPage(){
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load(){
      if (!slug) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('projects_stats_view')
        .select('*')
        .eq('url_slug', slug)
        .single();

      if (!error) setProject(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  useEffect(() => {
    if (slug) {
      logEvent({ event_type: 'pageview', page: `/projects/${slug}` });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌟</div>
          <div className="text-hoshii-ink">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😢</div>
          <div className="text-hoshii-ink mb-6">プロジェクトが見つかりませんでした</div>
          <Link href="/home">
            <Button className="bg-hoshii-green hover:bg-hoshii-green/90 text-white">ホームに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 戻る */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="border-hoshii-green text-hoshii-green hover:bg-hoshii-green hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> 戻る
          </Button>
        </div>

        <Card className="glass border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl text-hoshii-ink">{project.title}</CardTitle>
            <CardDescription className="text-hoshii-ink/70">{project.category}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-hoshii-ink/80">{project.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-hoshii-ink/70">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.start_date).toLocaleDateString('ja-JP')} - {new Date(project.end_date).toLocaleDateString('ja-JP')}</span>
              </div>
              {project.location && (
                <div className="flex items-center gap-2 text-hoshii-ink/70">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <Star className="h-5 w-5 text-hoshii-green mx-auto" />
                <div className="text-hoshii-ink font-semibold">{(project.total_supports ?? 0).toLocaleString()}</div>
                <div className="text-xs text-hoshii-ink/60">星の数</div>
              </div>
              <div>
                <Users className="h-5 w-5 text-hoshii-green mx-auto" />
                <div className="text-hoshii-ink font-semibold">{(project.participants_count ?? 0).toLocaleString()}人</div>
                <div className="text-xs text-hoshii-ink/60">参加者</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 右下 丸い外部リンクボタン */}
        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-hoshii-green to-hoshii-green2 text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform puyo"
            aria-label="プロジェクトサイトへ"
          >
            <ExternalLink className="h-6 w-6" />
          </a>
        )}
      </div>
    </div>
  );
}