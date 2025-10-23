'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context'; // 認証を有効化
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Star, Users, Calendar, Eye, Clock, MapPin, ExternalLink, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
// import { logEvent } from '@/lib/analytics';

// 時間帯に応じた空の色味を取得
const getSkyTheme = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 8) {
    return {
      name: '朝日',
      gradient: 'from-orange-200 via-yellow-100 to-pink-100',
      textColor: 'text-orange-800',
      accentColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      emoji: '🌅'
    };
  } else if (hour >= 8 && hour < 12) {
    return {
      name: '朝',
      gradient: 'from-blue-200 via-sky-100 to-cyan-100',
      textColor: 'text-blue-800',
      accentColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      emoji: '☀️'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      name: '昼',
      gradient: 'from-blue-300 via-blue-200 to-sky-200',
      textColor: 'text-blue-900',
      accentColor: 'text-blue-700',
      bgColor: 'bg-blue-100',
      emoji: '☀️'
    };
  } else if (hour >= 17 && hour < 19) {
    return {
      name: '夕焼け',
      gradient: 'from-orange-300 via-pink-200 to-purple-200',
      textColor: 'text-orange-900',
      accentColor: 'text-orange-700',
      bgColor: 'bg-orange-100',
      emoji: '🌇'
    };
  } else {
    return {
      name: '夜',
      gradient: 'from-purple-900 via-indigo-800 to-blue-900',
      textColor: 'text-purple-100',
      accentColor: 'text-purple-300',
      bgColor: 'bg-purple-900',
      emoji: '🌙'
    };
  }
};

// プロジェクトの型定義
interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  stars: number;
  participants: number;
  createdAt: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  url: string;
  creator: string;
  category: string;
  startDate: string;
  endDate: string;
  location?: string;
  website?: string;
}

// 初期は空。Supabaseから取得する
const initialProjects: Project[] = [];

export default function HomePage() {
  const { user, loading } = useAuth(); // 認証を有効化
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skyTheme, setSkyTheme] = useState(getSkyTheme());
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const primaryBtnClass = (() => {
    switch (skyTheme.name) {
      case '朝日':
        return 'bg-gradient-to-r from-orange-400 to-pink-300 hover:from-orange-500 hover:to-pink-400 text-white';
      case '朝':
        return 'bg-gradient-to-r from-sky-400 to-blue-300 hover:from-sky-500 hover:to-blue-400 text-white';
      case '昼':
        return 'bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white';
      case '夕焼け':
        return 'bg-gradient-to-r from-pink-400 to-purple-300 hover:from-pink-500 hover:to-purple-400 text-white';
      case '夜':
      default:
        return 'bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 text-white';
    }
  })();

  // 時間に合わせてテーマを更新
  useEffect(() => {
    const updateTheme = () => {
      setSkyTheme(getSkyTheme());
    };
    
    updateTheme();
    const interval = setInterval(updateTheme, 60000); // 1分ごとに更新
    
    return () => clearInterval(interval);
  }, []);

  // プロジェクトをSupabaseから取得
  useEffect(() => {
    async function loadProjects(){
      try{
        // projects_stats_view を使用して集計値も取得
        const { data, error } = await supabase
          .from('projects_stats_view')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length){
          const mapped: Project[] = data.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            imageUrl: p.image_url || '/api/placeholder/400/200',
            stars: p.total_supports ?? 0,
            participants: p.participants_count ?? 0,
            createdAt: p.created_at,
            status: p.status || 'planning',
            url: p.url_slug === 'leapday' ? '/leapday' : `/projects/${p.url_slug}`,
            creator: p.creator_name || '—',
            category: p.category || '—',
            startDate: p.start_date,
            endDate: p.end_date,
            location: p.location || '',
            website: p.website || ''
          }));

          setProjects(mapped);
          return;
        }

        // 後方互換: sky_events がある環境用（最小限）
        const legacy = await supabase
          .from('sky_events')
          .select('name, description, url_slug, created_at')
          .order('created_at', { ascending: false });
        if (!legacy.error && legacy.data){
          const mappedLegacy: Project[] = legacy.data.map((e: any) => ({
            id: e.url_slug === 'leapday' ? '8c182150-47c5-4933-b664-c343f5703031' : e.url_slug, // 茨城Leapday2025の正しいプロジェクトID
            title: e.name,
            description: e.description || '',
            imageUrl: '/api/placeholder/400/200',
            stars: 0,
            participants: 0,
            createdAt: e.created_at || new Date().toISOString(),
            status: 'active',
            url: e.url_slug === 'leapday' ? '/leapday' : `/projects/${e.url_slug}`,
            creator: '—',
            category: '—',
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            location: '',
            website: ''
          }));
          setProjects(mappedLegacy);
        }
      }catch(_e){
        // 失敗時は何もしない（空のまま）
      }
    }
    loadProjects();
    
    // 30秒ごとにプロジェクト一覧を更新
    const interval = setInterval(loadProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  // いいねしたプロジェクトを取得
  useEffect(() => {
    async function fetchLikedProjects() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('project_likes')
          .select('project_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('いいね取得エラー:', error);
          return;
        }

        if (data) {
          setLikedProjects(new Set(data.map(item => item.project_id)));
        }
      } catch (error) {
        console.error('いいね取得エラー:', error);
      }
    }

    fetchLikedProjects();
  }, [user]);

  useEffect(() => {
    // pageview analytics
    // logEvent({ event_type: 'pageview', page: '/home' });
  }, []);

  const handleLike = async (projectId: string) => {
    if (!user) return;

    try {
      const isLiked = likedProjects.has(projectId);
      
      if (isLiked) {
        // いいねを削除
        const { error } = await supabase
          .from('project_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', projectId);

        if (error) throw error;
        
        setLikedProjects(prev => {
          const newSet = new Set(prev);
          newSet.delete(projectId);
          return newSet;
        });
      } else {
        // いいねを追加
        const { error } = await supabase
          .from('project_likes')
          .insert({
            user_id: user.id,
            project_id: projectId
          });

        if (error) throw error;
        
        setLikedProjects(prev => new Set([...prev, projectId]));
      }

      // アナリティクスに記録
      // logEvent({ 
      //   event_type: 'click', 
      //   page: '/home', 
      //   project_id: projectId, 
      //   metadata: { cta: isLiked ? 'unlike' : 'like' } 
      // });
    } catch (error) {
      console.error('いいねエラー:', error);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${skyTheme.gradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-4">{skyTheme.emoji}</div>
          <div className={skyTheme.textColor}>読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${skyTheme.gradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className={`text-2xl font-bold ${skyTheme.textColor} mb-4`}>ログインが必要です</h1>
          <Link href="/">
            <Button className="bg-hoshii-green hover:bg-hoshii-green/90 text-white">
              ログインページへ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${skyTheme.gradient}`}>
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{skyTheme.emoji}</span>
              <h1 className={`text-4xl font-bold ${skyTheme.textColor}`}>
                Hoshii Projects
              </h1>
            </div>
            <p className={`text-xl ${skyTheme.textColor}`}>
              {user.user_metadata?.name || 'ユーザー'} さん、おかえりなさい！
            </p>
          </div>
          
          {/* プロジェクト作成ボタン */}
          <Link href="/projects/create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className={`${primaryBtnClass} px-6 py-3 rounded-2xl shadow-soft hover:shadow-card puyo`}>
                <Plus className="mr-2 h-5 w-5" />
                プロジェクトを立ち上げる
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* プロジェクト一覧 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className={`h-full glass rounded-2xl overflow-hidden shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-1`}>
                {/* プロジェクト画像 */}
                <div className="relative h-48 bg-gradient-to-br from-hoshii-green/20 to-hoshii-green2/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-50">
                      {project.id === 'leapday' ? '🐸' : '🌟'}
                    </div>
                  </div>
                  {/* ステータスバッジ */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-700' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      project.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.status === 'active' ? '進行中' :
                       project.status === 'completed' ? '完了' :
                       project.status === 'cancelled' ? '中止' : '計画中'}
                    </span>
                  </div>
                  {/* カテゴリタグ */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${skyTheme.bgColor} ${skyTheme.textColor}`}>
                      {project.category}
                    </span>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className={`text-xl font-bold text-hoshii-ink`}>
                    {project.title}
                  </CardTitle>
                  <CardDescription className={`text-hoshii-ink/80`}>
                    {project.description}
                  </CardDescription>
                  <div className={`text-sm text-hoshii-ink/70`}>
                    作成者: {project.creator}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* 統計情報 */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                      <Star className="h-5 w-5 text-hoshii-green mx-auto" />
                      <div className={`text-sm font-medium text-hoshii-ink`}>
                        {project.stars.toLocaleString()}
                      </div>
                      <div className={`text-xs text-hoshii-ink/70`}>星の数</div>
                    </div>
                    <div className="space-y-1">
                      <Users className="h-5 w-5 text-hoshii-green mx-auto" />
                      <div className={`text-sm font-medium text-hoshii-ink`}>
                        {project.participants}人
                      </div>
                      <div className={`text-xs text-hoshii-ink/70`}>参加者</div>
                    </div>
                  </div>

                  {/* 期間と場所 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className={`h-4 w-4 text-hoshii-green`} />
                      <span className="text-hoshii-ink/80">
                        {new Date(project.startDate).toLocaleDateString('ja-JP')} - {new Date(project.endDate).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    {project.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className={`h-4 w-4 text-hoshii-green`} />
                        <span className="text-hoshii-ink/80">{project.location}</span>
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div className="space-y-2">
                    <Link href={project.url} className="block">
                      <Button onClick={() => {/* logEvent({ event_type: 'click', page: '/home', project_id: project.id, metadata: { cta: 'open_project' } }); */}} className={`w-full ${primaryBtnClass} puyo`}>
                        <Eye className="mr-2 h-4 w-4" />
                        プロジェクトへ
                      </Button>
                    </Link>
                    
                    {/* いいねボタン */}
                    <Button
                      onClick={() => handleLike(project.id)}
                      variant="outline"
                      className={`w-full border-2 transition-all duration-200 puyo ${
                        likedProjects.has(project.id) 
                          ? 'border-red-400 bg-red-50 text-red-500 hover:bg-red-100' 
                          : 'border-gray-200 hover:border-red-300 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`mr-2 h-4 w-4 ${likedProjects.has(project.id) ? 'fill-current' : ''}`} />
                      {likedProjects.has(project.id) ? 'いいね済み' : 'いいね'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 空の状態 */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">{skyTheme.emoji}</div>
            <h2 className={`text-2xl font-bold ${skyTheme.textColor} mb-4`}>
              プロジェクトがありません
            </h2>
            <p className={`${skyTheme.textColor} mb-8`}>
              最初のプロジェクトを作成して、星空を始めましょう！
            </p>
            <Link href="/projects/create">
              <Button className="glass text-hoshii-ink px-8 py-3 rounded-2xl shadow-soft hover:shadow-card">
                <Plus className="mr-2 h-5 w-5" />
                プロジェクトを作成
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}