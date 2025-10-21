import { StarButton } from "@/components/community/StarButton";
import { CommunitySidebar, CommunityMobileNav } from "@/components/community/sidebar";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  // Mock data for demonstration
  const action = {
    id: params.id,
    title: '公園の清掃活動',
    desc: '地域の公園を美しく保つための清掃活動に参加しました。多くの方々と協力して、自然環境を守ることができました。この活動は、地域住民の環境意識向上にも貢献しています。',
    image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    stars_count: 24,
    creator: { name: '田中太郎' },
    community: { name: 'Green Valley' }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CommunitySidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden shadow bg-white">
        {action.image_url ? (
          <img src={action.image_url} alt={action.title} className="w-full h-64 object-cover" />
        ) : (
          <div className="h-64 bg-gray-100" />
        )}
        <div className="p-4 space-y-2">
          <div className="text-sm text-gray-500">{action.creator.name} • {action.community.name}</div>
          <h1 className="text-2xl font-semibold">{action.title}</h1>
          <p className="text-gray-700">{action.desc}</p>
          <div className="flex items-center gap-4">
            <span>⭐ {action?.stars_count ?? 0}</span>
            <StarButton actionId={params.id} />
          </div>
        </div>
      </div>
          </div>
        </main>
      </div>
      
      <CommunityMobileNav />
    </div>
  );
}