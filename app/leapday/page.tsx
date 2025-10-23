'use client';

import Link from "next/link";
import StarSky from "@/components/leapday/StarSky";
import DreamButton from "@/components/leapday/DreamButton";
import FloatingComments from "@/components/leapday/FloatingComments";
import { useAuth } from "@/lib/auth-context"; // 認証を有効化
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
// import { logEvent } from "@/lib/analytics";

export default function Page(){
  // 一時的に認証を無効化（デバッグ用）
  const { user, loading } = useAuth(); // 認証を有効化
  const [starsCount, setStarsCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);

  // Supabaseが設定されていない場合は認証チェックをスキップ
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  // 認証チェックを有効化
  const isAuthDisabled = false;

  // プロジェクトID
  const projectId = '8c182150-47c5-4933-b664-c343f5703031';


  // アナリティクス: ページビューを記録
  useEffect(() => {
    // logEvent({ 
    //   event_type: 'pageview', 
    //   page: '/leapday',
    //   project_id: '8c182150-47c5-4933-b664-c343f5703031' // 茨城Leapday2025のプロジェクトID
    // });
  }, []);

  // 実際の星の数を取得
  useEffect(() => {
    async function fetchStarsCount() {
      try {
        const response = await fetch('/api/leapday/stats');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStarsCount(data.starsCount || 42); // デフォルト値を42に設定
      } catch (error) {
        console.error('星の数取得エラー:', error);
        // エラーが発生した場合はデフォルト値を設定
        setStarsCount(42);
      }
    }
    fetchStarsCount();
    
    // 30秒ごとに更新
    const interval = setInterval(fetchStarsCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // コメントを取得
  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`/api/projects/comments?projectId=${projectId}&limit=10`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setComments(data.comments || []);
      } catch (error) {
        console.error('コメント取得エラー:', error);
        setComments([]);
      }
    }
    fetchComments();
    
    // 30秒ごとに更新
    const interval = setInterval(fetchComments, 30000);
    return () => clearInterval(interval);
  }, [projectId]);

  // 認証チェックを無効化
  if (isAuthDisabled) {
    // 認証チェックを完全にスキップ
  } else if (!isSupabaseConfigured) {
    // Supabaseが設定されていない場合は認証チェックを完全にスキップ
    console.log('Supabase not configured, skipping all auth checks');
  } else if (loading) {
    // Supabaseが設定されている場合のみ読み込み中を表示（タイムアウト後は表示しない）
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌟</div>
          <div className="text-hoshii-ink">読み込み中...</div>
        </div>
      </div>
    );
  }

  // Supabaseが設定されている場合のみ認証チェック（認証が無効化されていない場合のみ）
  if (!isAuthDisabled && isSupabaseConfigured && !loading && !user) {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <header className="text-center space-y-6">
        <div className="inline-block px-3 py-1 rounded-full bg-white/70 text-sm text-[var(--yk-ink)] shadow">みんなの景色</div>
        
        {/* ポップで目立つタイトル */}
        <div className="relative">
          <h1 
            className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-bounce"
            style={{ 
              fontFamily: '筑紫A丸ゴシック, Hiragino Maru Gothic ProN, ヒラギノ丸ゴ ProN W4, Comic Sans MS, cursive',
              textShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            茨城Leapday2025
          </h1>
          <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
          <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">🌟</div>
        </div>
        
        <p className="text-lg text-gray-600 font-medium">プロジェクトに参加して、星を届けよう</p>
        {!isSupabaseConfigured && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              ⚠️ Supabaseが設定されていません。認証機能を使用するには設定が必要です。
            </p>
          </div>
        )}
      </header>

      {/* みんなで作る星空セクション */}
      <section className="relative z-10">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">みんなで作る星空</h2>
        <div className="relative w-full h-[400px] bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <StarSky starsCount={starsCount} />
          <FloatingComments projectId={projectId} />
        </div>
        <div className="mt-4 text-center text-lg font-semibold text-gray-800">
          現在の星の数: {starsCount}個
        </div>
      </section>

      {/* バーンと目立つ星の数表示 */}
      <section className="text-center py-12">
        <div className="relative inline-block">
          <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-pulse">
            {starsCount}
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-700 mt-2">個の星</div>
          <div className="absolute -top-4 -left-4 text-3xl animate-bounce">⭐</div>
          <div className="absolute -top-4 -right-4 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>⭐</div>
        </div>
        
        <div className="mt-8">
          <Link href="/leapday/support">
            <button className="inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full shadow-2xl hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 animate-pulse">
              <span className="mr-2">💖</span>
              アクションを起こして星を届けよう！
            </button>
          </Link>
        </div>
      </section>

      {/* コメントセクション */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">みんなの声</h2>
        <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            {/* コメント入力フォーム */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="コメントを入力..."
                className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                id="commentInput"
              />
              <button
                onClick={async () => {
                  const input = document.getElementById('commentInput') as HTMLInputElement;
                  const comment = input.value.trim();
                  if (comment) {
                    // コメントを投稿
                    try {
                      const response = await fetch('/api/projects/comments', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          projectId: projectId,
                          content: comment,
                          userId: user?.id || 'anonymous'
                        }),
                      });
                      
                      if (response.ok) {
                        input.value = '';
                        // コメントリストを更新
                        const commentsResponse = await fetch(`/api/projects/comments?projectId=${projectId}&limit=10`);
                        if (commentsResponse.ok) {
                          const commentsData = await commentsResponse.json();
                          setComments(commentsData.comments || []);
                        }
                      }
                    } catch (error) {
                      console.error('コメント投稿エラー:', error);
                    }
                  }
                }}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
              >
                投稿
              </button>
            </div>
            
            {/* コメント一覧 */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-600 text-center">まだコメントがありません</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={comment.id || index} className="bg-white/50 rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-700">{comment.name || '匿名'}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{comment.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      </div>
      
      {/* CSS アニメーション */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
