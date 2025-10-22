'use client';

import Link from "next/link";
import StarSky from "@/components/leapday/StarSky";
import DreamButton from "@/components/leapday/DreamButton";
import FloatingComments from "@/components/leapday/FloatingComments";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useEffect } from "react";
import { logEvent } from "@/lib/analytics";

interface ProjectPageProps {
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  supportUrl: string;
  memberUrl: string;
  starsCount: number;
}

export default function ProjectPageTemplate({
  projectId,
  projectTitle,
  projectDescription,
  supportUrl,
  memberUrl,
  starsCount
}: ProjectPageProps) {
  const { user, loading } = useAuth();

  // Supabaseが設定されていない場合は認証チェックをスキップ
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  // アナリティクス: ページビューを記録
  useEffect(() => {
    logEvent({ 
      event_type: 'pageview', 
      page: `/projects/${projectId}`,
      project_id: projectId
    });
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hoshii-green mx-auto mb-4"></div>
          <p className="text-hoshii-ink">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user && isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-hoshii-ink">ログインが必要です</h1>
          <p className="text-hoshii-ink/70">プロジェクトに参加するにはログインしてください</p>
          <Link href="/auth/login">
            <Button className="bg-hoshii-green text-white hover:bg-hoshii-green/90">
              <LogIn className="mr-2 h-4 w-4" />
              ログイン
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <header className="text-center space-y-3">
        <div className="inline-block px-3 py-1 rounded-full bg-white/70 text-sm text-[var(--yk-ink)] shadow">みんなの景色</div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: '筑紫A丸ゴシック, Hiragino Maru Gothic ProN, ヒラギノ丸ゴ ProN W4, Comic Sans MS, cursive' }}>{projectTitle}</h1>
        <p className="text-[15px] text-gray-600">{projectDescription}</p>
        {!isSupabaseConfigured && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              ⚠️ Supabaseが設定されていません。認証機能を使用するには設定が必要です。
            </p>
          </div>
        )}
      </header>

      <StarSky />

      {/* Floating comments timeline */}
      <section>
        <h2 className="text-lg font-semibold mb-2">みんなの声</h2>
        <FloatingComments projectId={projectId} />
      </section>

      <section className="yk-card rounded-2xl p-6 space-y-4">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-[var(--yk-accent)]">現在の星の数</div>
          <div className="flex justify-center">
            <div className="text-6xl font-bold text-[var(--yk-accent)]">{starsCount.toLocaleString()}</div>
          </div>
        </div>
        <p className="text-[15px] text-gray-600 text-center">会場やオンラインからアクションが実行されると、星が増えていきます。</p>
        <div className="text-center space-y-3">
          <DreamButton as="a" href={supportUrl} className="inline-block">💖 参加する</DreamButton>
          <div>
            <Link 
              href={memberUrl} 
              className="inline-block px-4 py-2 bg-white/70 text-[var(--yk-ink)] rounded-full text-sm hover:bg-white/90 transition-colors duration-200"
            >
              🌟 みんなの景色
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}