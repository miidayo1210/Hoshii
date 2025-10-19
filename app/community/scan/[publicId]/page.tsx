'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, Clock, MapPin, Users, Heart } from 'lucide-react';

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
  orgName: 'Green Valley Community',
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
};

interface PageProps {
  params: {
    publicId: string;
  };
}

export default function PublicScanPage({ params }: PageProps) {
  const { publicId } = params;
  const searchParams = useSearchParams();
  const packageKey = searchParams?.get('pkg') || '';
  
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock event lookup based on publicId
  useEffect(() => {
    if (publicId !== 'abc123') {
      // Handle invalid public ID
      return;
    }
  }, [publicId]);

  const handleActionToggle = (actionId: string) => {
    // Haptic feedback for action selection
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedActions([]);
    }, 3000);
  };

  const totalStars = selectedActions.reduce((sum, actionId) => {
    const action = mockEvent.actionPackage.actions.find(a => a.id === actionId);
    return sum + (action?.value || 0);
  }, 0);

  const progressPercentage = Math.min(1, mockEvent.current_stars / mockEvent.target_star_count);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">アクション完了！</h2>
            <p className="text-green-600 mb-4">
              {totalStars} スターを獲得しました！
            </p>
            <p className="text-sm text-gray-600">
              ご参加ありがとうございました。コミュニティの目標達成に貢献していただきました。
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-community-violet to-community-lavender" data-theme="community">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockEvent.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{mockEvent.description}</p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {mockEvent.orgName}
            </Badge>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {mockEvent.place}
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">コミュニティの進捗</h3>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{mockEvent.current_stars}</div>
                  <p className="text-sm text-gray-600">獲得スター</p>
                </div>
                <div className="text-gray-400">/</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{mockEvent.target_star_count}</div>
                  <p className="text-sm text-gray-600">目標</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${progressPercentage * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {Math.round(progressPercentage * 100)}% 達成
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">アクションを選択してください</CardTitle>
            <CardDescription className="text-center">
              完了したアクションにチェックを入れてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {mockEvent.actionPackage.actions.map((action) => (
                <div
                  key={action.id}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 transform ${
                    selectedActions.includes(action.id)
                      ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                  }`}
                  onClick={() => handleActionToggle(action.id)}
                  style={{
                    minHeight: '120px',
                    touchAction: 'manipulation',
                  }}
                >
                  <div className="flex items-center justify-between h-full">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedActions.includes(action.id)
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedActions.includes(action.id) && (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{action.title}</h4>
                          <p className="text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-4 text-lg px-3 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      {action.value}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Actions Summary */}
        {selectedActions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">選択されたアクション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {totalStars} スター
                </div>
                <p className="text-gray-600 mb-4">
                  {selectedActions.length} 個のアクションを選択しました
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={selectedActions.length === 0 || isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white px-16 py-6 text-xl font-semibold min-h-[64px] w-full max-w-md"
            size="lg"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                送信中...
              </div>
            ) : (
              <div className="flex items-center">
                <Heart className="w-6 h-6 mr-3" />
                アクションを記録
              </div>
            )}
          </Button>
          {selectedActions.length === 0 && (
            <p className="text-sm text-gray-500 mt-3">
              少なくとも1つのアクションを選択してください
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Hoshii for Community - ポジティブな変化を一緒に起こしましょう</p>
        </div>
      </div>
    </div>
  );
}
