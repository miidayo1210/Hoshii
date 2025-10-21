'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dataLayer, User } from '@/lib/data';
import { Building2, TrendingUp, Users, Award, UserX } from 'lucide-react';

export default function OrgDashboardPage() {
  const router = useRouter();
  const [totalStamps, setTotalStamps] = useState(0);
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    const orgTotal = dataLayer.getOrgTotalStamps('demo');
    setTotalStamps(orgTotal);
    
    const allUsers = dataLayer.getAllUsers();
    setMembers(allUsers);
  }, []);

  const handleDeleteMember = (userId: string) => {
    if (window.confirm('このメンバーを削除しますか？この操作は取り消せません。')) {
      const success = dataLayer.deleteUser(userId);
      if (success) {
        // Update local state
        setMembers(prev => prev.filter(member => member.id !== userId));
        
        // Update total stamps
        const orgTotal = dataLayer.getOrgTotalStamps('demo');
        setTotalStamps(orgTotal);
        
        alert('メンバーを削除しました');
      } else {
        alert('メンバーの削除に失敗しました');
      }
    }
  };

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
            <p className="text-2xl font-bold text-purple-700">{members.length}</p>
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

      {/* Members Management */}
      <Card className="mb-6 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            メンバー管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-hoshii-ink">{member.name}</p>
                  <p className="text-sm text-hoshii-ink/60">{member.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">⭐</span>
                    <span className="text-sm font-medium text-hoshii-earth">×{member.stamps}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteMember(member.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <UserX className="h-4 w-4 mr-1" />
                削除
              </Button>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-center text-hoshii-ink/60 py-4">
              メンバーがいません
            </p>
          )}
        </CardContent>
      </Card>

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
