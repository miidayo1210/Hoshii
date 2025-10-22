'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  url_slug: string;
  creator_id: string;
  category: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  website: string | null;
  image_url: string | null;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
}

export default function EditProjectPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('url_slug', params.slug)
        .single();
      if (error) {
        setError(error.message);
        return;
      }
      if (data) setProject(data as ProjectRow);
    }
    if (!loading && user) load();
  }, [loading, user, params.slug]);

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

  if (!user) {
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

  // クリエイターのみ編集可
  if (project && project.creator_id !== user.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⛔️</div>
          <h1 className="text-2xl font-bold text-hoshii-ink mb-2">編集権限がありません</h1>
          <p className="text-hoshii-ink/70">このプロジェクトはあなたが作成していません。</p>
          <Link href={`/projects/${params.slug}`}>
            <Button className="mt-4 bg-hoshii-green hover:bg-hoshii-green/90 text-white">プロジェクトへ戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: project.title,
          description: project.description,
          category: project.category,
          start_date: project.start_date,
          end_date: project.end_date,
          location: project.location,
          website: project.website,
          image_url: project.image_url,
          status: project.status,
        })
        .eq('id', project.id);
      if (error) throw error;
      setSuccess('保存しました');
      setTimeout(() => router.push(`/projects/${params.slug}`), 1000);
    } catch (err: any) {
      setError(err.message || '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-4 mb-8">
          <Link href={`/projects/${params.slug}`}>
            <Button variant="outline" className="border-hoshii-green text-hoshii-green hover:bg-hoshii-green hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> 戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-hoshii-ink">プロジェクトを編集</h1>
            <p className="text-hoshii-ink/70">内容を更新して保存できます</p>
          </div>
        </motion.div>

        <Card className="kawaii-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-hoshii-ink">基本情報</CardTitle>
            <CardDescription className="text-hoshii-ink/70">必要な項目を更新してください</CardDescription>
          </CardHeader>
          <CardContent>
            {!project ? (
              <div className="text-hoshii-ink/60">読み込み中...</div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
                {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>}

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-hoshii-ink font-medium">タイトル</Label>
                  <Input id="title" value={project.title} onChange={(e) => setProject({ ...project, title: e.target.value })} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-hoshii-ink font-medium">説明</Label>
                  <Textarea id="description" value={project.description ?? ''} onChange={(e) => setProject({ ...project, description: e.target.value })} className="min-h-[120px]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-hoshii-ink font-medium">開始日</Label>
                    <Input id="start_date" type="date" value={project.start_date ?? ''} onChange={(e) => setProject({ ...project, start_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-hoshii-ink font-medium">終了日</Label>
                    <Input id="end_date" type="date" value={project.end_date ?? ''} onChange={(e) => setProject({ ...project, end_date: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-hoshii-ink font-medium">カテゴリ</Label>
                  <Input id="category" value={project.category ?? ''} onChange={(e) => setProject({ ...project, category: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-hoshii-ink font-medium">場所</Label>
                  <Input id="location" value={project.location ?? ''} onChange={(e) => setProject({ ...project, location: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-hoshii-ink font-medium">ウェブサイト</Label>
                  <Input id="website" type="url" value={project.website ?? ''} onChange={(e) => setProject({ ...project, website: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url" className="text-hoshii-ink font-medium">画像URL</Label>
                  <Input id="image_url" type="url" value={project.image_url ?? ''} onChange={(e) => setProject({ ...project, image_url: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-hoshii-ink font-medium">ステータス</Label>
                  <select id="status" value={project.status} onChange={(e) => setProject({ ...project, status: e.target.value as ProjectRow['status'] })} className="w-full h-10 px-3 border border-gray-300 rounded-md">
                    <option value="planning">計画中</option>
                    <option value="active">進行中</option>
                    <option value="completed">完了</option>
                    <option value="cancelled">中止</option>
                  </select>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={saving} className="bg-hoshii-green hover:bg-hoshii-green/90 text-white px-6 py-3 rounded-2xl">
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> 保存中...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> 保存
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
