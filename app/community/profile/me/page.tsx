import { CommunitySidebar, CommunityMobileNav } from '@/components/community/sidebar';
import MasonryGrid from '@/components/community/MasonryGrid';
import { ActionCard } from '@/components/community/ActionCard';
import { BoardCard } from '@/components/community/BoardCard';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, Calendar, Award, Plus } from 'lucide-react';

export default async function MyProfilePage() {
  // Mock data for user profile
  const profile = {
    id: 'me',
    name: '田中太郎',
    email: 'tanaka@example.com',
    stars_total: 156,
    created_at: '2024年1月から参加'
  };

  // User's created actions
  const myActions = [
    {
      id: 'action-1',
      title: '公園の清掃活動',
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
      stars_count: 24,
      creator: { name: '田中太郎' },
      tags: ['環境', 'コミュニティ', '清掃']
    },
    {
      id: 'action-2',
      title: '地域イベントの企画',
      image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
      stars_count: 18,
      creator: { name: '田中太郎' },
      tags: ['イベント', '地域', '企画']
    },
    {
      id: 'action-3',
      title: '料理教室の開催',
      image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      stars_count: 12,
      creator: { name: '田中太郎' },
      tags: ['料理', '教育', '地域']
    }
  ];

  // User's participated events
  const participatedEvents = [
    {
      id: 'event-1',
      title: '高齢者施設でのボランティア活動',
      image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      stars_count: 31,
      creator: { name: '山田次郎' },
      tags: ['高齢者', 'ボランティア', '福祉'],
      participated_at: '2024年2月15日'
    },
    {
      id: 'event-2',
      title: '地域の防災訓練',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=400',
      stars_count: 15,
      creator: { name: '鈴木美咲' },
      tags: ['防災', '安全', '訓練'],
      participated_at: '2024年2月10日'
    }
  ];

  // Generated images from events
  const generatedImages = [
    {
      id: 'img-1',
      title: '公園清掃の記念写真',
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
      event_title: '公園の清掃活動',
      generated_at: '2024年2月20日'
    },
    {
      id: 'img-2',
      title: 'ボランティア活動の成果',
      image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      event_title: '高齢者施設でのボランティア活動',
      generated_at: '2024年2月15日'
    },
    {
      id: 'img-3',
      title: '防災訓練の様子',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=400',
      event_title: '地域の防災訓練',
      generated_at: '2024年2月10日'
    }
  ];

  // User's communities
  const myCommunities = [
    {
      id: 'community-1',
      name: 'Green Valley',
      cover_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
      desc: '環境保護とサステナビリティに取り組むコミュニティ',
      role: 'メンバー',
      joined_at: '2024年1月'
    },
    {
      id: 'community-2',
      name: 'Learning Hub',
      cover_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
      desc: '学習と知識共有のコミュニティ',
      role: '管理者',
      joined_at: '2024年1月'
    }
  ];

  // User's stamps/achievements
  const stamps = [
    { id: 'stamp-1', name: '環境保護リーダー', icon: '🌱', earned_at: '2024年2月' },
    { id: 'stamp-2', name: 'コミュニティビルダー', icon: '🏗️', earned_at: '2024年2月' },
    { id: 'stamp-3', name: 'ボランティアスター', icon: '⭐', earned_at: '2024年1月' },
    { id: 'stamp-4', name: 'イベント企画者', icon: '🎉', earned_at: '2024年1月' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CommunitySidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {profile.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-gray-600 mt-1">{profile.email}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1 text-emerald-600">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-medium">{profile.stars_total}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{profile.created_at}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{myActions.length}</p>
                    <p className="text-sm text-gray-600">作成したアクション</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{participatedEvents.length}</p>
                    <p className="text-sm text-gray-600">参加したイベント</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{myCommunities.length}</p>
                    <p className="text-sm text-gray-600">所属コミュニティ</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stamps.length}</p>
                    <p className="text-sm text-gray-600">獲得スタンプ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Created Actions */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">作成したアクション</h2>
                <Link href="/community/create" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  新しいアクションを作成 →
                </Link>
              </div>
              <MasonryGrid>
                {myActions.map(action => (
                  <ActionCard key={action.id} a={action} />
                ))}
              </MasonryGrid>
            </section>

            {/* Participated Events */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">参加したイベント</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {participatedEvents.map(event => (
                  <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{event.participated_at}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{event.stars_count}</span>
                      </div>
                      <Link 
                        href={`/community/action/${event.id}`}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        詳細を見る →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Generated Images */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">イベントで生成された画像</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map(img => (
                  <div key={img.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <Image
                        src={img.image_url}
                        alt={img.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{img.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{img.event_title}</p>
                    <p className="text-xs text-gray-500">{img.generated_at}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* My Communities */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">所属コミュニティ</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {myCommunities.map(community => (
                  <div key={community.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <Image
                        src={community.cover_url}
                        alt={community.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{community.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{community.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        community.role === '管理者' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {community.role}
                      </span>
                      <Link 
                        href={`/community/board/${community.id}`}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        コミュニティを見る →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Stamps/Achievements */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">獲得スタンプ</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stamps.map(stamp => (
                  <div key={stamp.id} className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <div className="text-3xl mb-2">{stamp.icon}</div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{stamp.name}</h3>
                    <p className="text-xs text-gray-500">{stamp.earned_at}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      
      <CommunityMobileNav />
    </div>
  );
}
