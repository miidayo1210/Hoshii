'use client';

import { useState } from 'react';
import { CommunitySidebar } from '@/components/community/navigation';
import { CreateActionModal } from '@/components/community/create-action-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Calendar, Plus } from 'lucide-react';

export default function CreatePage() {
  const [createdActions, setCreatedActions] = useState<any[]>([]);

  const handleActionCreated = (action: any) => {
    setCreatedActions(prev => [...prev, { ...action, id: `action-${Date.now()}` }]);
  };

  const creationOptions = [
    {
      id: 'action',
      title: 'アクションカード',
      description: '新しいアクションを作成してコミュニティと共有しましょう',
      icon: Heart,
      color: 'bg-red-500',
      href: '#action-modal'
    },
    {
      id: 'package',
      title: 'パッケージ（ボード）',
      description: '複数のアクションをまとめたパッケージを作成しましょう',
      icon: Users,
      color: 'bg-blue-500',
      href: '/community/create/package'
    },
    {
      id: 'event',
      title: 'イベント',
      description: 'コミュニティイベントを企画して参加者を募集しましょう',
      icon: Calendar,
      color: 'bg-green-500',
      href: '/community/create/event'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-theme="community">
      <div className="flex">
        <CommunitySidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">作成</h1>
              <p className="text-gray-600">
                新しいアクション、パッケージ、またはイベントを作成しましょう
              </p>
            </div>

            {/* Creation Options */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {creationOptions.map((option) => {
                const Icon = option.icon;
                
                if (option.id === 'action') {
                  return (
                    <CreateActionModal key={option.id} onActionCreated={handleActionCreated}>
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <CardHeader>
                          <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center mb-4`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle>{option.title}</CardTitle>
                          <CardDescription>{option.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full bg-community-purple hover:bg-community-purple/90">
                            <Plus className="w-4 h-4 mr-2" />
                            作成する
                          </Button>
                        </CardContent>
                      </Card>
                    </CreateActionModal>
                  );
                }

                return (
                  <Card key={option.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                        disabled
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        近日公開
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recently Created */}
            {createdActions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  最近作成したアクション
                </h2>
                <div className="space-y-3">
                  {createdActions.map((action) => (
                    <Card key={action.id} className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{action.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {action.tags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-community-purple/10 text-community-purple text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">作成済み</p>
                            <Button size="sm" variant="outline" className="mt-2">
                              詳細を見る
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <Card className="bg-gradient-to-r from-community-purple/5 to-community-lavender/5 border-community-purple/20">
              <CardHeader>
                <CardTitle className="text-community-purple">作成のコツ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-community-purple/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-community-purple text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">魅力的なタイトル</p>
                    <p className="text-sm text-gray-600">簡潔で分かりやすいタイトルを付けましょう</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-community-purple/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-community-purple text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">詳細な説明</p>
                    <p className="text-sm text-gray-600">アクションの目的や参加方法を詳しく説明しましょう</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-community-purple/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-community-purple text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">適切なタグ</p>
                    <p className="text-sm text-gray-600">関連するタグを付けて、見つけやすくしましょう</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
