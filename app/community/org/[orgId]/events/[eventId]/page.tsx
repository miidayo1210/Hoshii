import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users, Star, QrCode, Share2, Download } from 'lucide-react';

// Mock data
const mockEvent = {
  id: 'event-1',
  title: 'Park Cleanup Day',
  description: '地域の公園を美しく保つための清掃活動と環境教育イベント。参加者全員で協力して、自然環境を守りましょう。',
  time: '2024-12-15T10:00:00Z',
  place: 'Valley Park',
  target_star_count: 50,
  current_stars: 32,
  public_id: 'abc123',
  status: 'active' as const,
  orgId: 'org-1',
  actionPackage: {
    id: 'pkg-1',
    name: 'Environmental Actions',
    actions: [
      { id: 'action-1', title: 'ゴミを拾う', description: '公園内のゴミを10個以上拾ってください', value: 1 },
      { id: 'action-2', title: '植物に水をやる', description: '植木鉢や花壇の植物に水をやってください', value: 1 },
      { id: 'action-3', title: '環境教育に参加', description: '環境保護についての短いセッションに参加してください', value: 2 },
      { id: 'action-4', title: 'リサイクル活動', description: '分別されたリサイクル可能なアイテムを処理してください', value: 1 },
    ],
  },
  participants: [
    { id: 'user-1', name: '田中太郎', stars: 3, joinedAt: '2024-12-01T09:00:00Z' },
    { id: 'user-2', name: '佐藤花子', stars: 2, joinedAt: '2024-12-02T14:30:00Z' },
    { id: 'user-3', name: '山田次郎', stars: 4, joinedAt: '2024-12-03T11:15:00Z' },
    { id: 'user-4', name: '鈴木美咲', stars: 1, joinedAt: '2024-12-04T16:45:00Z' },
  ],
};

interface PageProps {
  params: {
    orgId: string;
    eventId: string;
  };
}

export default function EventDetailPage({ params }: PageProps) {
  const { orgId, eventId } = params;

  // Mock event lookup
  if (orgId !== 'org-1' || eventId !== 'event-1') {
    notFound();
  }

  const progressPercentage = (mockEvent.current_stars / mockEvent.target_star_count) * 100;
  const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/community/scan/${mockEvent.public_id}`;

  const handleShareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: mockEvent.title,
        text: `参加してください: ${mockEvent.title}`,
        url: qrUrl,
      });
    } else {
      navigator.clipboard.writeText(qrUrl);
      // You could show a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href={`/community/org/${orgId}`}>
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{mockEvent.title}</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">{mockEvent.description}</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleShareQR} variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              QRを共有
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <QrCode className="w-4 h-4 mr-2" />
              QRコード表示
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle>イベント情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Badge variant={mockEvent.status === 'active' ? 'default' : 'secondary'}>
                    {mockEvent.status === 'active' ? 'アクティブ' : '完了'}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(mockEvent.time).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {mockEvent.place}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>進捗状況</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">スター収集進捗</span>
                    <span className="text-sm text-gray-600">
                      {mockEvent.current_stars} / {mockEvent.target_star_count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-purple-600">
                      {Math.round(progressPercentage)}%
                    </span>
                    <p className="text-sm text-gray-600">目標達成率</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Package */}
            <Card>
              <CardHeader>
                <CardTitle>アクションパッケージ</CardTitle>
                <CardDescription>{mockEvent.actionPackage.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEvent.actionPackage.actions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <Badge variant="outline">
                        {action.value} スター
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle>参加者 ({mockEvent.participants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEvent.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{participant.name}</h4>
                        <p className="text-sm text-gray-600">
                          参加日: {new Date(participant.joinedAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{participant.stars}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle>QRコード</CardTitle>
                <CardDescription>スキャンして参加</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Button onClick={handleShareQR} className="w-full" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    共有
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    ダウンロード
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  QRコードをスキャンしてイベントに参加
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>クイックアクション</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  参加者を招待
                </Button>
                <Button className="w-full" variant="outline">
                  イベントを編集
                </Button>
                <Button className="w-full" variant="outline">
                  レポートを表示
                </Button>
                <Button className="w-full" variant="destructive">
                  イベントを終了
                </Button>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>イベント統計</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">参加者数</span>
                  <span className="font-medium">{mockEvent.participants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">平均スター数</span>
                  <span className="font-medium">
                    {Math.round(mockEvent.participants.reduce((sum, p) => sum + p.stars, 0) / mockEvent.participants.length)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">アクション数</span>
                  <span className="font-medium">{mockEvent.actionPackage.actions.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
