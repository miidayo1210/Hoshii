import Image from "next/image";
import MasonryGrid from "@/components/community/MasonryGrid";
import { ActionCard } from "@/components/community/ActionCard";
import { CommunitySidebar, CommunityMobileNav } from "@/components/community/sidebar";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  // Mock data for demonstration
  const profile = {
    id: params.id,
    name: '田中太郎',
    stars_total: 156
  };

  const postedActions = [
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
    }
  ];

  const joinedActions = [
    {
      id: 'action-3',
      title: '高齢者施設でのボランティア活動',
      image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      stars_count: 31,
      creator: { name: '山田次郎' },
      tags: ['高齢者', 'ボランティア', '福祉']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CommunitySidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div>
          <div className="text-xl font-semibold">{profile.name}</div>
          <div className="text-sm text-gray-600">⭐ 合計 {profile.stars_total}</div>
        </div>
      </div>
      <section>
        <h2 className="font-medium mb-2">投稿したアクション</h2>
        <MasonryGrid>
          {postedActions.map(a => <ActionCard key={a.id} a={a} />)}
        </MasonryGrid>
      </section>
      <section>
        <h2 className="font-medium mb-2">参加したアクション</h2>
        <MasonryGrid>
          {joinedActions.map(a => <ActionCard key={a.id} a={a} />)}
        </MasonryGrid>
      </section>
      <section>
        <h2 className="font-medium mb-2">あなたの星座</h2>
        <div className="w-full max-w-xl rounded-2xl bg-black p-4">
          <div 
            className="w-full rounded-2xl"
            dangerouslySetInnerHTML={{
              __html: `
                <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#000000"/>
                  <g stroke="#ffffff" stroke-width="2" fill="none">
                    <circle cx="100" cy="100" r="3" fill="#ffffff"/>
                    <circle cx="200" cy="150" r="3" fill="#ffffff"/>
                    <circle cx="150" cy="250" r="3" fill="#ffffff"/>
                    <circle cx="300" cy="200" r="3" fill="#ffffff"/>
                    <circle cx="250" cy="300" r="3" fill="#ffffff"/>
                    <line x1="100" y1="100" x2="200" y2="150"/>
                    <line x1="200" y1="150" x2="150" y2="250"/>
                    <line x1="150" y1="250" x2="300" y2="200"/>
                    <line x1="300" y1="200" x2="250" y2="300"/>
                  </g>
                  <text x="200" y="350" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16">
                    ${params.id}'s Constellation
                  </text>
                </svg>
              `
            }}
          />
        </div>
      </section>
          </div>
        </main>
      </div>
      
      <CommunityMobileNav />
    </div>
  );
}