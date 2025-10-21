import MasonryGrid from "@/components/community/MasonryGrid";
import { ActionCard } from "@/components/community/ActionCard";
import { CommunitySidebar, CommunityMobileNav } from "@/components/community/sidebar";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  // Mock data for demonstration
  const board = {
    id: params.id,
    name: 'Green Valley',
    desc: '環境保護とサステナビリティに取り組むコミュニティです。地域の自然を守り、持続可能な未来を目指しています。',
    cover_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
  };

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
      title: '植樹イベント',
      image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      stars_count: 16,
      creator: { name: '佐藤花子' },
      tags: ['環境', '植樹', '自然']
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CommunitySidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
      <div className="rounded-2xl overflow-hidden bg-white shadow">
        {board.cover_url ? (
          <img src={board.cover_url} alt={board.name} className="w-full h-48 object-cover" />
        ) : (
          <div className="h-48 bg-gray-100" />
        )}
        <div className="p-4">
          <h1 className="text-2xl font-semibold">{board.name}</h1>
          <p className="text-gray-700">{board.desc}</p>
        </div>
      </div>
      <MasonryGrid>
        {actions.map(a => <ActionCard key={a.id} a={a} />)}
      </MasonryGrid>
          </div>
        </main>
      </div>
      
      <CommunityMobileNav />
    </div>
  );
}