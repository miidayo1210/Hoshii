'use client';

import { useState, useEffect } from 'react';
import { MasonryGrid } from '@/components/community/masonry-grid';
import { ActionCard, BoardCard } from '@/components/community/action-card';
import { CommunitySidebar } from '@/components/community/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

// Mock data
const mockActions = [
  {
    id: 'action-1',
    title: '公園の清掃活動',
    description: '地域の公園を美しく保つための清掃活動に参加しました。',
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
    description: '地域の図書館で子どもたちに絵本の読み聞かせを行いました。',
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
    description: '地域の高齢者施設でお話し相手としてボランティア活動を行いました。',
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
    description: '地域の防災訓練に参加し、避難経路の確認や消火器の使い方を学びました。',
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
    description: '地域の夏祭りでお手伝いをしました。屋台の準備や片付けなどを行いました。',
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

const allTags = ['環境', '教育', '高齢者', '防災', '祭り', 'コミュニティ', '清掃', '子ども', '読書', 'ボランティア', '福祉', '安全', '訓練', '地域', 'イベント', '自然', 'サステナビリティ', '学習', '知識'];

const areas = ['東京都', '大阪府', '愛知県', '神奈川県', '埼玉県', '千葉県', '兵庫県', '福岡県'];

const types = ['アクション', 'コミュニティ', 'イベント'];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [starredActions, setStarredActions] = useState<Set<string>>(new Set());

  const handleStar = async (actionId: string) => {
    const newStarredActions = new Set(starredActions);
    if (newStarredActions.has(actionId)) {
      newStarredActions.delete(actionId);
    } else {
      newStarredActions.add(actionId);
    }
    setStarredActions(newStarredActions);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedArea('');
    setSelectedType('');
  };

  const getFilteredContent = () => {
    let filteredActions = mockActions;
    let filteredCommunities = mockCommunities;

    // Search filter
    if (searchQuery) {
      filteredActions = filteredActions.filter(action =>
        action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      filteredCommunities = filteredCommunities.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filteredActions = filteredActions.filter(action =>
        selectedTags.some(tag => action.tags.includes(tag))
      );
      filteredCommunities = filteredCommunities.filter(community =>
        selectedTags.some(tag => community.tags.includes(tag))
      );
    }

    return { filteredActions, filteredCommunities };
  };

  const { filteredActions, filteredCommunities } = getFilteredContent();

  return (
    <div className="min-h-screen bg-gray-50" data-theme="community">
      <div className="flex">
        <CommunitySidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">発見</h1>
              <p className="text-gray-600">
                新しいアクションやコミュニティを探索しましょう
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="アクションやコミュニティを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-community-purple focus:ring-community-purple/20"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>フィルター</span>
                </Button>
                
                {(selectedTags.length > 0 || selectedArea || selectedType) && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    クリア
                  </Button>
                )}
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="bg-white rounded-xl p-6 space-y-6 border border-gray-200">
                  {/* Type Filter */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">タイプ</h3>
                    <div className="flex flex-wrap gap-2">
                      {types.map(type => (
                        <Button
                          key={type}
                          variant={selectedType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedType(selectedType === type ? '' : type)}
                          className={selectedType === type ? 'bg-community-purple hover:bg-community-purple/90' : ''}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Area Filter */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">エリア</h3>
                    <div className="flex flex-wrap gap-2">
                      {areas.map(area => (
                        <Button
                          key={area}
                          variant={selectedArea === area ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedArea(selectedArea === area ? '' : area)}
                          className={selectedArea === area ? 'bg-community-purple hover:bg-community-purple/90' : ''}
                        >
                          {area}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "secondary"}
                          className={`cursor-pointer transition-colors ${
                            selectedTags.includes(tag) 
                              ? 'bg-community-purple hover:bg-community-purple/90' 
                              : 'hover:bg-gray-200'
                          }`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="space-y-8">
              {/* Actions */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  アクション ({filteredActions.length})
                </h2>
                {filteredActions.length > 0 ? (
                  <MasonryGrid>
                    {filteredActions.map(action => (
                      <ActionCard
                        key={action.id}
                        {...action}
                        isStarred={starredActions.has(action.id)}
                        onStar={handleStar}
                      />
                    ))}
                  </MasonryGrid>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">該当するアクションが見つかりませんでした</p>
                  </div>
                )}
              </div>

              {/* Communities */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  コミュニティ ({filteredCommunities.length})
                </h2>
                {filteredCommunities.length > 0 ? (
                  <MasonryGrid breakpointColumnsObj={{ default: 3, 700: 2, 500: 1 }}>
                    {filteredCommunities.map(community => (
                      <BoardCard key={community.id} {...community} />
                    ))}
                  </MasonryGrid>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">該当するコミュニティが見つかりませんでした</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
