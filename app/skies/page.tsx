'use client';

import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Users, Calendar, Heart } from 'lucide-react';

const skies = [
  {
    id: 'leapday',
    title: '茨城Frogs Leapday',
    description: 'Leapdayの星空を満天の星にしよう',
    url: '/leapday',
    participants: 11,
    stars: 12345,
    color: 'from-purple-500 to-pink-500',
    icon: '🐸',
  },
  {
    id: 'community',
    title: 'コミュニティ星空',
    description: '地域コミュニティの応援星空',
    url: '/community',
    participants: 0,
    stars: 0,
    color: 'from-blue-500 to-cyan-500',
    icon: '🏘️',
    comingSoon: true,
  },
  {
    id: 'environment',
    title: '環境保護星空',
    description: '地球環境を守るアクション星空',
    url: '/environment',
    participants: 0,
    stars: 0,
    color: 'from-green-500 to-emerald-500',
    icon: '🌍',
    comingSoon: true,
  },
];

export default function SkiesPage() {
  const { user, loading } = useAuth();

  // Supabaseが設定されていない場合は認証チェックをスキップ
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

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
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-hoshii-ink mb-4">ログインが必要です</h1>
          <Link href="/auth/login">
            <Button className="bg-hoshii-green hover:bg-hoshii-green/90 text-white">
              ログインページへ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-4xl font-bold text-hoshii-ink mb-4">
            星空の世界へようこそ
          </h1>
          <p className="text-xl text-hoshii-ink/70">
            {isSupabaseConfigured && user ? `${user.email} さん、` : ''}素敵な星空をお楽しみください
          </p>
        </motion.div>

        {/* 星空一覧 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skies.map((sky, index) => (
            <motion.div
              key={sky.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className={`h-full kawaii-card border-0 ${sky.comingSoon ? 'opacity-60' : ''}`}>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{sky.icon}</div>
                  <CardTitle className="text-xl font-bold text-hoshii-ink">
                    {sky.title}
                  </CardTitle>
                  <CardDescription className="text-hoshii-ink/70">
                    {sky.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* 統計情報 */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                      <Users className="h-5 w-5 text-hoshii-green mx-auto" />
                      <div className="text-sm font-medium text-hoshii-ink">
                        {sky.participants}人
                      </div>
                      <div className="text-xs text-hoshii-ink/60">参加者</div>
                    </div>
                    <div className="space-y-1">
                      <Star className="h-5 w-5 text-hoshii-green mx-auto" />
                      <div className="text-sm font-medium text-hoshii-ink">
                        {sky.stars.toLocaleString()}
                      </div>
                      <div className="text-xs text-hoshii-ink/60">星の数</div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  {sky.comingSoon ? (
                    <Button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      近日公開
                    </Button>
                  ) : (
                    <Link href={sky.url} className="block">
                      <Button className="w-full bg-hoshii-green hover:bg-hoshii-green/90 text-white">
                        <Heart className="mr-2 h-4 w-4" />
                        星空に入る
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* フッター */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-hoshii-ink/60">
            新しい星空が追加される予定です。お楽しみに！
          </p>
        </motion.div>
      </div>
    </div>
  );
}