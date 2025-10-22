'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Image, Users, Calendar, MapPin, Link as LinkIcon, Clock, Camera, Upload, FolderOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// 時間帯に応じた空の色味を取得（ホームページと同じ）
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

export default function CreateProjectPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [skyTheme, setSkyTheme] = useState(getSkyTheme());
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    location: '',
    website: '',
    imageUrl: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 時間に合わせてテーマを更新
  useEffect(() => {
    const updateTheme = () => {
      setSkyTheme(getSkyTheme());
    };
    
    updateTheme();
    const interval = setInterval(updateTheme, 60000); // 1分ごとに更新
    
    return () => clearInterval(interval);
  }, []);

  // 画像選択のハンドラー
  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoLibrary = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageSelect(file);
    };
    input.click();
  };

  const handleCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // カメラを起動
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageSelect(file);
    };
    input.click();
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageSelect(file);
    };
    input.click();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    setSuccess('');

    if (!user) {
      setError('ログインが必要です。');
      setIsCreating(false);
      return;
    }

    // 必須項目のバリデーション
    if (!projectData.title || !projectData.description || !projectData.category || !projectData.startDate || !projectData.endDate) {
      setError('必須項目をすべて入力してください。');
      setIsCreating(false);
      return;
    }

    // 日付のバリデーション
    if (new Date(projectData.startDate) >= new Date(projectData.endDate)) {
      setError('終了日は開始日より後に設定してください。');
      setIsCreating(false);
      return;
    }

    try {
      // URLスラッグを生成（タイトルから）
      const urlSlug = projectData.title
        .toLowerCase()
        .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, '-')
        .replace(/^-*|-*$/g, '');

      const { data, error } = await supabase.from('projects').insert([
        {
          title: projectData.title,
          description: projectData.description,
          url_slug: urlSlug,
          creator_id: user.id,
          category: projectData.category,
          start_date: projectData.startDate,
          end_date: projectData.endDate,
          location: projectData.location || null,
          website: projectData.website || null,
          image_url: projectData.imageUrl || null,
          status: 'planning',
        },
      ]).select();

      if (error) {
        throw error;
      }

      setSuccess('プロジェクトが正常に作成されました！');
      
      // 少し待ってからホームページにリダイレクト
      setTimeout(() => {
        router.push('/home');
      }, 1500);

    } catch (err: any) {
      console.error('プロジェクト作成エラー:', err);
      setError(`プロジェクト作成に失敗しました: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${skyTheme.gradient}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/home">
            <Button variant="outline" className="border-hoshii-green text-hoshii-green hover:bg-hoshii-green hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
          </Link>
          <div>
            <h1 className={`text-3xl font-bold ${skyTheme.textColor}`}>
              新しいプロジェクトを作成
            </h1>
            <p className={`${skyTheme.accentColor}`}>
              素敵な星空プロジェクトを始めましょう
            </p>
          </div>
        </motion.div>

        {/* フォーム */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="kawaii-card border-0">
            <CardHeader>
              <CardTitle className={`text-2xl font-bold ${skyTheme.textColor}`}>
                プロジェクト情報
              </CardTitle>
              <CardDescription className={`${skyTheme.accentColor}`}>
                プロジェクトの詳細を入力してください
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* エラー・成功メッセージ */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {success}
                  </div>
                )}

                {/* プロジェクトタイトル */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-hoshii-ink font-medium flex items-center gap-1">
                    <span className="text-red-500">*</span> プロジェクトタイトル
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="例: 地域コミュニティガーデン"
                    value={projectData.title}
                    onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                    className="text-lg"
                    required
                  />
                </div>

                {/* プロジェクト説明 */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-hoshii-ink font-medium flex items-center gap-1">
                    <span className="text-red-500">*</span> プロジェクト説明
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="プロジェクトの目的や内容を詳しく説明してください..."
                    value={projectData.description}
                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                    className="min-h-[120px] text-base"
                    required
                  />
                </div>

                {/* 期間設定 */}
                <div className="space-y-2">
                  <Label className="text-hoshii-ink font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-red-500">*</span> プロジェクト期間
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-sm text-hoshii-ink/70">
                        開始日
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={projectData.startDate}
                        onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm text-hoshii-ink/70">
                        終了日
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={projectData.endDate}
                        onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* カテゴリ選択 */}
                <div className="space-y-2">
                  <Label htmlFor="category" className={`${skyTheme.textColor} font-medium flex items-center gap-1`}>
                    <span className="text-red-500">*</span> カテゴリ・タグ
                  </Label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="例: コミュニティ, 環境保護, 教育, 健康, アート, スポーツ..."
                    value={projectData.category}
                    onChange={(e) => setProjectData({ ...projectData, category: e.target.value })}
                    className="text-lg"
                    required
                  />
                  <p className={`text-sm ${skyTheme.accentColor} opacity-70`}>
                    カンマ区切りで複数のタグを入力できます
                  </p>
                </div>

                {/* 場所 */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-hoshii-ink font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    場所（オプション）
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="例: 茨城県つくば市"
                    value={projectData.location}
                    onChange={(e) => setProjectData({ ...projectData, location: e.target.value })}
                  />
                </div>

                {/* ウェブサイト/SNS */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-hoshii-ink font-medium flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    ウェブサイト/SNS（オプション）
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={projectData.website}
                    onChange={(e) => setProjectData({ ...projectData, website: e.target.value })}
                  />
                </div>

                {/* 画像選択 */}
                <div className="space-y-2">
                  <Label className={`${skyTheme.textColor} font-medium`}>
                    プロジェクト画像（オプション）
                  </Label>
                  
                  {/* 画像選択ボタン */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={handlePhotoLibrary}
                      className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-hoshii-green/50 transition-colors"
                    >
                      <Image className="h-6 w-6 text-hoshii-green" />
                      <span className="text-sm font-medium text-hoshii-ink">写真ライブラリ</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleCamera}
                      className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-hoshii-green/50 transition-colors"
                    >
                      <Camera className="h-6 w-6 text-hoshii-green" />
                      <span className="text-sm font-medium text-hoshii-ink">写真を撮る</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleFileSelect}
                      className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-hoshii-green/50 transition-colors"
                    >
                      <FolderOpen className="h-6 w-6 text-hoshii-green" />
                      <span className="text-sm font-medium text-hoshii-ink">ファイルを選択</span>
                    </button>
                  </div>

                  {/* 画像プレビュー */}
                  {imagePreview && (
                    <div className="mt-4">
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="プレビュー" 
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-sm text-hoshii-ink/60 mt-2">
                        選択された画像: {selectedImage?.name}
                      </p>
                    </div>
                  )}

                  {/* URL入力（フォールバック） */}
                  <div className="mt-4">
                    <Label htmlFor="imageUrl" className={`text-sm ${skyTheme.accentColor}`}>
                      または、画像URLを直接入力
                    </Label>
                    <div className="relative mt-1">
                      <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="imageUrl"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={projectData.imageUrl}
                        onChange={(e) => setProjectData({ ...projectData, imageUrl: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* プレビュー */}
                {projectData.title && (
                  <div className="space-y-2">
                    <Label className="text-hoshii-ink font-medium">
                      プレビュー
                    </Label>
                    <Card className="border border-gray-200">
                      <div className="h-32 bg-gradient-to-br from-hoshii-green/20 to-hoshii-green2/20 flex items-center justify-center">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="プレビュー" 
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="text-4xl opacity-50">🌟</div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className={`font-bold text-lg ${skyTheme.textColor} mb-2`}>
                          {projectData.title}
                        </h3>
                        <p className={`text-sm ${skyTheme.accentColor} mb-3`}>
                          {projectData.description || '説明が入力されていません'}
                        </p>
                        
                        {/* カテゴリ表示 */}
                        {projectData.category && (
                          <div className="mb-3">
                            <div className={`text-xs ${skyTheme.accentColor} mb-1`}>タグ:</div>
                            <div className="flex flex-wrap gap-1">
                              {projectData.category.split(',').map((tag, index) => (
                                <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${skyTheme.bgColor} ${skyTheme.textColor}`}>
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* 期間と場所の表示 */}
                        <div className="space-y-1 text-xs text-hoshii-ink/60">
                          {projectData.startDate && projectData.endDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(projectData.startDate).toLocaleDateString('ja-JP')} - {new Date(projectData.endDate).toLocaleDateString('ja-JP')}
                              </span>
                            </div>
                          )}
                          {projectData.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{projectData.location}</span>
                            </div>
                          )}
                          {projectData.website && (
                            <div className="flex items-center gap-1">
                              <LinkIcon className="h-3 w-3" />
                              <span className="truncate">{projectData.website}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* 作成ボタン */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isCreating || !projectData.title || !projectData.description || !projectData.category || !projectData.startDate || !projectData.endDate}
                    className="flex-1 bg-hoshii-green hover:bg-hoshii-green/90 text-white py-3 rounded-2xl"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        作成中...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        プロジェクトを作成
                      </>
                    )}
                  </Button>
                  
                  <Link href="/home" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-hoshii-green text-hoshii-green hover:bg-hoshii-green hover:text-white py-3 rounded-2xl"
                    >
                      キャンセル
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}