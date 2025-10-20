'use client';

import { useState, useEffect } from 'react';
import { MasonryGrid } from '@/components/community/masonry-grid';
import { ActionCard, BoardCard } from '@/components/community/action-card';
import { TabSwitcher } from '@/components/community/navigation';
import { CommunitySidebar } from '@/components/community/navigation';

// Mock data
const mockActions = [
  {
    id: 'action-1',
    title: '公園の清掃活動',
    description: '地域の公園を美しく保つための清掃活動に参加しました。多くの方々と協力して、自然環境を守ることができました。',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    tags: ['環境', 'コミュニティ', '清掃'],
    starsCount: 24,
    creator: {
      id: 'user-1',
      name: '田中太郎',
      iconUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32'
    },
    community: {
      id: 'community-1',
      name: 'Green Valley'
    }
  },
  {
    id: 'action-2',
    title: '地域の子どもたちと絵本読み聞かせ',
    description: '地域の図書館で子どもたちに絵本の読み聞かせを行いました。子どもたちの笑顔がとても印象的でした。',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    tags: ['教育', '子ども', '読書'],
    starsCount: 18,
    creator: {
      id: 'user-2',
      name: '佐藤花子',
      iconUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32'
    },
    community: {
      id: 'community-2',
      name: 'Learning Hub'
    }
  },
  {
    id: 'action-3',
    title: '高齢者施設でのボランティア活動',
    description: '地域の高齢者施設でお話し相手としてボランティア活動を行いました。利用者の方々との交流がとても貴重でした。',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    tags: ['高齢者', 'ボランティア', '福祉'],
    starsCount: 31,
    creator: {
      id: 'user-3',
      name: '山田次郎',
      iconUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32'
    },
    community: {
      id: 'community-3',
      name: 'Care Community'
    }
  },
  {
    id: 'action-4',
    title: '地域の防災訓練に参加',
    description: '地域の防災訓練に参加し、避難経路の確認や消火器の使い方を学びました。災害に備えることの大切さを実感しました。',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=400',
    tags: ['防災', '安全', '訓練'],
    starsCount: 15,
    creator: {
      id: 'user-4',
      name: '鈴木美咲',
      iconUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32'
    },
    community: {
      id: 'community-4',
      name: 'Safety First'
    }
  },
  {
    id: 'action-5',
    title: '地域の祭りでお手伝い',
    description: '地域の夏祭りでお手伝いをしました。屋台の準備や片付けなど、多くの方々と協力して楽しい時間を過ごしました。',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
    tags: ['祭り', '地域', 'イベント'],
    starsCount: 22,
    creator: {
      id: 'user-5',
      name: '高橋健一',
      iconUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32'
    },
    community: {
      id: 'community-5',
      name: 'Festival Friends'
    }
  }
];

const mockCommunities = [
  {
    id: 'community-1',
    name: 'Green Valley',
    description: '環境保護とサステナビリティに取り組むコミュニティ',
    coverUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
    tags: ['環境', '自然', 'サステナビリティ'],
    actionsCount: 45,
    membersCount: 128,
    creator: {
      id: 'user-1',
      name: '田中太郎',
      iconUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32'
    }
  },
  {
    id: 'community-2',
    name: 'Learning Hub',
    description: '学習と知識共有のコミュニティ',
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
    tags: ['教育', '学習', '知識'],
    actionsCount: 32,
    membersCount: 89,
    creator: {
      id: 'user-2',
      name: '佐藤花子',
      iconUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32'
    }
  }
];

export default function CommunityHomePage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>('personal');
  const [starredActions, setStarredActions] = useState<Set<string>>(new Set());

  const handleStar = async (actionId: string) => {
    // Optimistic update
    const newStarredActions = new Set(starredActions);
    if (newStarredActions.has(actionId)) {
      newStarredActions.delete(actionId);
    } else {
      newStarredActions.add(actionId);
    }
    setStarredActions(newStarredActions);

    // API call would go here
    try {
      // await starAction(actionId);
      console.log('Starred action:', actionId);
    } catch (error) {
      // Revert on error
      setStarredActions(starredActions);
      console.error('Failed to star action:', error);
    }
  };

  const getFilteredContent = () => {
    if (activeTab === 'personal') {
      // Show user's starred actions and their own actions
      return mockActions.filter(action => 
        starredActions.has(action.id) || action.creator.id === 'user-1'
      );
    } else {
      // Show community-focused content (actions from communities)
      return mockActions;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-theme="community">
      <div className="flex">
        {/* Desktop Sidebar */}
        <CommunitySidebar />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {activeTab === 'personal' ? 'あなたのフィード' : 'コミュニティフィード'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'personal' 
                  ? 'あなたが参加したアクションや気になる投稿を見つけましょう'
                  : 'コミュニティ全体のアクティビティを探索しましょう'
                }
              </p>
            </div>

            {/* Tab Switcher */}
            <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content */}
            {activeTab === 'personal' ? (
              <div className="space-y-8">
                {/* Starred Actions */}
                {starredActions.size > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      お気に入りのアクション
                    </h2>
                    <MasonryGrid>
                      {mockActions
                        .filter(action => starredActions.has(action.id))
                        .map(action => (
                          <ActionCard
                            key={action.id}
                            {...action}
                            isStarred={true}
                            onStar={handleStar}
                          />
                        ))}
                    </MasonryGrid>
                  </div>
                )}

                {/* Your Actions */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    あなたのアクション
                  </h2>
                  <MasonryGrid>
                    {mockActions
                      .filter(action => action.creator.id === 'user-1')
                      .map(action => (
                        <ActionCard
                          key={action.id}
                          {...action}
                          isStarred={starredActions.has(action.id)}
                          onStar={handleStar}
                        />
                      ))}
                    </MasonryGrid>
                </div>

                {/* Recommended Communities */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    おすすめコミュニティ
                  </h2>
                  <MasonryGrid breakpointColumnsObj={{ default: 3, 700: 2, 500: 1 }}>
                    {mockCommunities.map(community => (
                      <BoardCard key={community.id} {...community} />
                    ))}
                  </MasonryGrid>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* All Actions */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    すべてのアクション
                  </h2>
                  <MasonryGrid>
                    {mockActions.map(action => (
                      <ActionCard
                        key={action.id}
                        {...action}
                        isStarred={starredActions.has(action.id)}
                        onStar={handleStar}
                      />
                    ))}
                  </MasonryGrid>
                </div>

                {/* Communities */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    コミュニティ
                  </h2>
                  <MasonryGrid breakpointColumnsObj={{ default: 3, 700: 2, 500: 1 }}>
                    {mockCommunities.map(community => (
                      <BoardCard key={community.id} {...community} />
                    ))}
                  </MasonryGrid>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
