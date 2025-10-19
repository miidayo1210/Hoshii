import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, Users, Star, QrCode } from 'lucide-react';

// Mock data
const mockOrganization = {
  id: 'org-1',
  name: 'Green Valley Community',
  description: '環境保護とサステナビリティに取り組むコミュニティ。地域の自然を守り、持続可能な生活を目指しています。',
  product: 'community' as const,
  memberCount: 45,
  createdAt: '2024-01-15T00:00:00Z',
};

const mockPlaces = [
  {
    id: 'place-1',
    name: 'Valley Park',
    description: '地域の主要な公園。環境保護活動の拠点です。',
    eventCount: 5,
  },
  {
    id: 'place-2',
    name: 'Community Center',
    description: 'コミュニティセンター。会議やワークショップに使用されます。',
    eventCount: 3,
  },
  {
    id: 'place-3',
    name: 'Riverside Area',
    description: '川沿いのエリア。クリーンアップ活動の場所です。',
    eventCount: 2,
  },
];

const mockEvents = [
  {
    id: 'event-1',
    title: 'Park Cleanup Day',
    description: '公園の清掃活動と環境教育イベント',
    time: '2024-12-15T10:00:00Z',
    place: 'Valley Park',
    target_star_count: 50,
    current_stars: 32,
    public_id: 'abc123',
    status: 'active' as const,
  },
  {
    id: 'event-2',
    title: 'Sustainable Living Workshop',
    description: '持続可能な生活スタイルについて学ぶワークショップ',
    time: '2024-12-20T14:00:00Z',
    place: 'Community Center',
    target_star_count: 30,
    current_stars: 18,
    public_id: 'def456',
    status: 'active' as const,
  },
  {
    id: 'event-3',
    title: 'River Conservation Project',
    description: '川の環境保護プロジェクト',
    time: '2024-12-25T09:00:00Z',
    place: 'Riverside Area',
    target_star_count: 40,
    current_stars: 25,
    public_id: 'ghi789',
    status: 'active' as const,
  },
];

interface PageProps {
  params: {
    orgId: string;
  };
}

export default function OrganizationPage({ params }: PageProps) {
  const { orgId } = params;

  // Mock organization lookup
  if (orgId !== 'org-1') {
    notFound();
  }

  const progressPercentage = (current: number, target: number) => 
    Math.min((current / target) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{mockOrganization.name}</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">{mockOrganization.description}</p>
            <div className="flex items-center mt-4 space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                コミュニティ
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                {mockOrganization.memberCount} メンバー
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link href={`/community/org/${orgId}/create-event`}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                イベント作成
              </Button>
            </Link>
            <Link href={`/community/org/${orgId}/create-place`}>
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                場所追加
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">アクティブイベント</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockEvents.length}</div>
              <p className="text-xs text-muted-foreground">開催中</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">場所数</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPlaces.length}</div>
              <p className="text-xs text-muted-foreground">利用可能</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総スター数</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockEvents.reduce((sum, event) => sum + event.current_stars, 0)}
              </div>
              <p className="text-xs text-muted-foreground">獲得済み</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">目標達成率</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  mockEvents.reduce((sum, event) => sum + event.current_stars, 0) /
                  mockEvents.reduce((sum, event) => sum + event.target_star_count, 0) * 100
                )}%
              </div>
              <p className="text-xs text-muted-foreground">全体</p>
            </CardContent>
          </Card>
        </div>

        {/* Events Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">アクティブイベント</h2>
            <Link href={`/community/org/${orgId}/create-event`}>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                新しいイベント
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="mt-1">{event.description}</CardDescription>
                    </div>
                    <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                      {event.status === 'active' ? 'アクティブ' : '完了'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.time).toLocaleDateString('ja-JP')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.place}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>進捗</span>
                        <span>{event.current_stars} / {event.target_star_count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage(event.current_stars, event.target_star_count)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/community/org/${orgId}/events/${event.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          詳細を見る
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Places Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">場所</h2>
            <Link href={`/community/org/${orgId}/create-place`}>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                新しい場所
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPlaces.map((place) => (
              <Card key={place.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{place.name}</CardTitle>
                  <CardDescription>{place.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {place.eventCount} イベント
                    </div>
                    <Button variant="outline" size="sm">
                      管理
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
