'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Users, Globe, Heart } from 'lucide-react';

export default function CreateCommunityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Redirect to the new community page
    const newOrgId = `org-${Date.now()}`;
    router.push(`/community/org/${newOrgId}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/community/dashboard">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">新しいコミュニティを作成</h1>
            <p className="text-gray-600 mt-2">仲間と一緒にポジティブな変化を起こしましょう</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>コミュニティ情報</CardTitle>
              <CardDescription>
                コミュニティの基本情報を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">コミュニティ名 *</Label>
                <Input
                  id="name"
                  placeholder="例: Green Valley Community"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">説明 *</Label>
                <Textarea
                  id="description"
                  placeholder="コミュニティの目的や活動内容を説明してください"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">テーマ</Label>
                <Input
                  id="theme"
                  placeholder="例: 環境保護、健康促進、学習支援"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Community Types */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>コミュニティタイプ</CardTitle>
              <CardDescription>
                どのようなコミュニティを作成しますか？
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:border-purple-300 cursor-pointer transition-colors">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <Globe className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">地域コミュニティ</h3>
                    <p className="text-sm text-gray-600">
                      特定の地域に根ざした活動を行うコミュニティ
                    </p>
                  </div>
                </div>
                <div className="border rounded-lg p-4 hover:border-purple-300 cursor-pointer transition-colors">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">テーマコミュニティ</h3>
                    <p className="text-sm text-gray-600">
                      特定のテーマや興味に基づいたコミュニティ
                    </p>
                  </div>
                </div>
                <div className="border rounded-lg p-4 hover:border-purple-300 cursor-pointer transition-colors">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">グループコミュニティ</h3>
                    <p className="text-sm text-gray-600">
                      既存のグループや組織のコミュニティ
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 mt-8">
            <Link href="/community/dashboard">
              <Button variant="outline">キャンセル</Button>
            </Link>
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting || !formData.name || !formData.description}
            >
              {isSubmitting ? '作成中...' : 'コミュニティを作成'}
            </Button>
          </div>
        </form>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">作成後の流れ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">メンバーを招待</p>
                  <p className="text-sm text-gray-600">コミュニティのメンバーを招待し、参加してもらいます</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">イベントを企画</p>
                  <p className="text-sm text-gray-600">アクションパッケージを選択し、イベントを作成します</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">QRコードを共有</p>
                  <p className="text-sm text-gray-600">生成されたQRコードを参加者と共有し、アクションを記録します</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
