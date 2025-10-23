'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Heart, Users, Calendar, MapPin, ExternalLink, LogOut } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  supporters_count: number;
  likes_count: number;
  created_at: string;
  location?: string;
  is_liked?: boolean;
}

export default function MyPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [likedProjects, setLikedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 既存のプロジェクトデータを取得
    const existingProjects = [
      {
        id: '8c182150-47c5-4933-b664-c343f5703031',
        title: '茨城LeapDay2025',
        description: 'みんなで作る星空プロジェクト',
        category: '教育',
        supporters_count: 150,
        likes_count: 89,
        created_at: '2024-10-20',
        location: '茨城県',
        is_liked: true
      }
    ];

    setProjects(existingProjects);
    setLikedProjects(existingProjects.filter(p => p.is_liked));
    setLoading(false);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">ログインが必要です</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">マイページを表示するにはログインしてください。</p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              ログインページへ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {(user.nickname || user.email).charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">マイページ</h1>
          <p className="text-gray-600">{user.nickname || user.email}</p>
          {user.nickname && (
            <p className="text-sm text-gray-500">{user.email}</p>
          )}
          {(user.ageGroup || user.gender) && (
            <div className="flex gap-4 justify-center mt-2">
              {user.ageGroup && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  🎂 {user.ageGroup}
                </span>
              )}
              {user.gender && (
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                  👥 {user.gender}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{projects.length}</h3>
              <p className="text-gray-600">参加中のプロジェクト</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{likedProjects.length}</h3>
              <p className="text-gray-600">いいねしたプロジェクト</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">1</h3>
              <p className="text-gray-600">作成したプロジェクト</p>
            </CardContent>
          </Card>
        </div>

        {/* 参加中のプロジェクト */}
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              参加中のプロジェクト
            </CardTitle>
            <CardDescription>現在参加しているプロジェクト一覧</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">参加中のプロジェクトはありません</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {project.supporters_count}人
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {project.likes_count}いいね
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                          {project.location && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {project.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* いいねしたプロジェクト */}
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-red-600" />
              いいねしたプロジェクト
            </CardTitle>
            <CardDescription>お気に入りに追加したプロジェクト</CardDescription>
          </CardHeader>
          <CardContent>
            {likedProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">いいねしたプロジェクトはありません</p>
              </div>
            ) : (
              <div className="space-y-4">
                {likedProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {project.supporters_count}人
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1 text-red-500" />
                            {project.likes_count}いいね
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ログアウトボタン */}
        <div className="text-center">
          <Button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          >
            <LogOut className="w-5 h-5 mr-2" />
            ログアウト
          </Button>
        </div>
      </div>
    </div>
  );
}