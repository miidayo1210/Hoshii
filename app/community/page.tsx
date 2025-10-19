import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, Star, Zap } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-community-violet to-community-lavender" data-theme="community">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Hoshii for Community
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            やさしさを、まちの星に。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community/dashboard">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                コミュニティ組織を作成
              </Button>
            </Link>
            <Link href="/community/scan/demo">
              <Button size="lg" variant="outline" className="px-8 py-3">
                デモを体験
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">コミュニティ作成</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                地域やテーマに基づいたコミュニティを簡単に作成し、メンバーを招待できます
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">イベント企画</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                環境保護、健康促進、学習支援などのテーマでイベントを企画し、参加者を集められます
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">アクション記録</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                参加者のアクションを記録し、コミュニティ全体の進歩を可視化できます
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle className="text-lg">QRスキャン</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                QRコードをスキャンして簡単にアクションを記録し、スターを獲得できます
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">使い方</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">コミュニティを作成</h3>
              <p className="text-gray-600">
                地域やテーマに基づいたコミュニティを作成し、メンバーを招待します
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">イベントを企画</h3>
              <p className="text-gray-600">
                アクションパッケージを選択し、QRコード付きのイベントを作成します
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">参加者と共有</h3>
              <p className="text-gray-600">
                QRコードを共有し、参加者がアクションを記録してスターを獲得します
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-purple-600 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">今すぐ始めましょう</h2>
          <p className="text-xl mb-6 opacity-90">
            あなたのコミュニティでポジティブな変化を起こしませんか？
          </p>
          <Link href="/community/dashboard">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              ダッシュボードにアクセス
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
