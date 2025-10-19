'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dataLayer } from '@/lib/data';
import { Building2, TrendingUp, Users, Award } from 'lucide-react';

export default function OrgDashboardPage() {
  const router = useRouter();
  const [totalStamps, setTotalStamps] = useState(0);

  useEffect(() => {
    const orgTotal = dataLayer.getOrgTotalStamps('demo');
    setTotalStamps(orgTotal);
  }, []);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-6 w-6 text-purple-600" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          組織ダッシュボード
        </h1>
      </div>

      {/* Org Info Card */}
      <Card className="mb-6 bg-gradient-to-br from-hoshii-earth to-hoshii-green text-white border-0">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold opacity-90 mb-2">Demo Organization</h2>
          <div className="flex items-center gap-2">
            <span className="text-5xl">⭐</span>
            <p className="text-4xl font-bold">×{totalStamps}</p>
          </div>
          <p className="opacity-90 mt-1">獲得した星の総数</p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-purple-200">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-purple-700">1</p>
            <p className="text-xs text-purple-600">アクティブメンバー</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="flex items-center justify-center gap-1">
              <span className="text-xl">⭐</span>
              <p className="text-2xl font-bold text-hoshii-earth">×{totalStamps}</p>
            </div>
            <p className="text-xs text-hoshii-ink/70">今月の星</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle>管理メニュー</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push('/org/demo/overview')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            分析とレポートを見る
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push('/events/new')}
          >
            <Award className="h-4 w-4 mr-2" />
            新しいイベントを作成
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
