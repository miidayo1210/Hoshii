'use client';

import Link from "next/link";
import StarSky from "@/components/leapday/StarSky";
import DreamButton from "@/components/leapday/DreamButton";
import FloatingComments from "@/components/leapday/FloatingComments";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { logEvent } from "@/lib/analytics";

export default function Page(){
  const { user, loading } = useAuth();
  const [starsCount, setStarsCount] = useState(0);

  // Supabaseが設定されていない場合は認証チェックをスキップ
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  // アナリティクス: ページビューを記録
  useEffect(() => {
    logEvent({ 
      event_type: 'pageview', 
      page: '/leapday',
      project_id: '8c182150-47c5-4933-b664-c343f5703031' // 茨城Leapday2025のプロジェクトID
    });
  }, []);

  // 実際の星の数を取得
  useEffect(() => {
    async function fetchStarsCount() {
      try {
        const response = await fetch('/api/leapday/stats');
        const data = await response.json();
        setStarsCount(data.starsCount || 0);
      } catch (error) {
        console.error('星の数取得エラー:', error);
      }
    }
    fetchStarsCount();
    
    // 30秒ごとに更新
    const interval = setInterval(fetchStarsCount, 30000);
    return () => clearInterval(interval);
  }, []);

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

  // Supabaseが設定されている場合のみ認証チェック
  if (isSupabaseConfigured && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-hoshii-ink mb-4">
            ログインが必要です
          </h1>
          <p className="text-hoshii-ink/70 mb-8">
            茨城Frogs Leapdayの星空を楽しむには、ログインしてください
          </p>
          <Link href="/">
            <Button className="bg-hoshii-green hover:bg-hoshii-green/90 text-white px-8 py-3 text-lg">
              <LogIn className="mr-2 h-5 w-5" />
              ログインページへ
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: '筑紫A丸ゴシック, Hiragino Maru Gothic ProN, ヒラギノ丸ゴ ProN W4, Comic Sans MS, cursive' }}>茨城Leapday2025</h1>
        <p className="text-[15px] text-gray-600">プロジェクトに参加して、星を届けよう</p>
        {!isSupabaseConfigured && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              ⚠️ Supabaseが設定されていません。認証機能を使用するには設定が必要です。
            </p>
          </div>
        )}
      </header>

      <StarSky />

      {/* みんなの声セクション */}
      <section className="yk-card rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-4 text-center">みんなの声</h2>
        <FloatingComments />
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
          <DreamButton as="a" href="/leapday/support" className="inline-block">💖 参加する</DreamButton>
          <div>
            <Link 
              href="/leapday/member" 
              className="inline-block px-4 py-2 bg-white/70 text-[var(--yk-ink)] rounded-full text-sm hover:bg-white/90 transition-colors duration-200"
            >
              🌟 登壇11名のメンバー一覧
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
