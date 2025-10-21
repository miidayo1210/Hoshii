import MasonryGrid from "@/components/community/MasonryGrid";
import { ActionCard } from "@/components/community/ActionCard";
import { BoardCard } from "@/components/community/BoardCard";
import { CommunitySidebar, CommunityMobileNav } from "@/components/community/sidebar";
import Link from "next/link";

export default async function Page() {
  // Mock data for demonstration
  const actions = [
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
      title: '地域の子どもたちと絵本読み聞かせ',
      image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      stars_count: 18,
      creator: { name: '佐藤花子' },
      tags: ['教育', '子ども', '読書']
    },
    {
      id: 'action-3',
      title: '高齢者施設でのボランティア活動',
      image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      stars_count: 31,
      creator: { name: '山田次郎' },
      tags: ['高齢者', 'ボランティア', '福祉']
    },
    {
      id: 'action-4',
      title: '地域の防災訓練に参加',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=400',
      stars_count: 15,
      creator: { name: '鈴木美咲' },
      tags: ['防災', '安全', '訓練']
    },
    {
      id: 'action-5',
      title: '地域の祭りでお手伝い',
      image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
      stars_count: 22,
      creator: { name: '高橋健一' },
      tags: ['祭り', '地域', 'イベント']
    }
  ];

  const boards = [
    {
      id: 'community-1',
      name: 'Green Valley',
      cover_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
      desc: '環境保護とサステナビリティに取り組むコミュニティ'
    },
    {
      id: 'community-2',
      name: 'Learning Hub',
      cover_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
      desc: '学習と知識共有のコミュニティ'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CommunitySidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">ホーム</h1>
              <div className="flex gap-4 text-sm">
                <Link href="/community/discover" className="text-emerald-700 underline">探索する</Link>
                <Link href="/community/create" className="text-emerald-700 underline">作成する</Link>
                <Link href="/community/notifications" className="text-emerald-700 underline">更新情報</Link>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="?scope=personal" className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">個人</Link>
              <Link href="?scope=community" className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">コミュニティ</Link>
            </div>
            <div className="mt-6 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">おすすめアクション</h2>
                <MasonryGrid>
                  {actions.map(a => <ActionCard key={a.id} a={a} />)}
                </MasonryGrid>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4">人気コミュニティ</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boards.map(b => <BoardCard key={b.id} b={b} />)}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      
      <CommunityMobileNav />
    </div>
  );
}