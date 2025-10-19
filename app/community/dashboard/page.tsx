import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Calendar, MapPin } from 'lucide-react';

// Mock data for community organizations
const mockOrganizations = [
  {
    id: 'org-1',
    name: 'Green Valley Community',
    description: '環境保護とサステナビリティに取り組むコミュニティ',
    product: 'community' as const,
    memberCount: 45,
    eventCount: 8,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'org-2',
    name: 'Health First Neighborhood',
    description: '地域の健康促進とウェルネス活動',
    product: 'community' as const,
    memberCount: 32,
    eventCount: 12,
    createdAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 'org-3',
    name: 'Learning Together Hub',
    description: '学習と知識共有のコミュニティ',
    product: 'community' as const,
    memberCount: 28,
    eventCount: 6,
    createdAt: '2024-03-10T00:00:00Z',
  },
];

export default function CommunityDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">コミュニティダッシュボード</h1>
            <p className="text-gray-600 mt-2">あなたのコミュニティを管理し、新しいコミュニティを作成しましょう</p>
          </div>
          <Link href="/community/dashboard/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              新しいコミュニティ
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">参加コミュニティ数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockOrganizations.length}</div>
              <p className="text-xs text-muted-foreground">アクティブなコミュニティ</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総イベント数</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockOrganizations.reduce((sum, org) => sum + org.eventCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">開催済みイベント</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総メンバー数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockOrganizations.reduce((sum, org) => sum + org.memberCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">アクティブメンバー</p>
            </CardContent>
          </Card>
        </div>

        {/* Organizations Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">あなたのコミュニティ</h2>
          {mockOrganizations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockOrganizations.map((org) => (
                <Card key={org.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{org.name}</CardTitle>
                    <CardDescription>{org.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {org.memberCount} メンバー
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {org.eventCount} イベント
                      </div>
                    </div>
                    <Link href={`/community/org/${org.id}`}>
                      <Button className="w-full" variant="outline">
                        管理する
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">まだコミュニティがありません</h3>
                <p className="text-gray-600 mb-4">
                  最初のコミュニティを作成して、仲間と一緒にアクションを始めましょう
                </p>
                <Link href="/community/dashboard/create">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    コミュニティを作成
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>最近のアクティビティ</CardTitle>
            <CardDescription>コミュニティでの最近の活動</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">新しいイベントが作成されました</p>
                  <p className="text-xs text-gray-500">Green Valley Community - 2時間前</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">新しいメンバーが参加しました</p>
                  <p className="text-xs text-gray-500">Health First Neighborhood - 5時間前</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">イベントが完了しました</p>
                  <p className="text-xs text-gray-500">Learning Together Hub - 1日前</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
