"use client";
import { CreateActionModal } from "@/components/community/CreateActionModal";
import { CommunitySidebar, CommunityMobileNav } from "@/components/community/sidebar";

interface CreateActionPayload {
  title: string;
  desc?: string;
  tags: string[];
  imageFile?: File | null;
  communityId?: string;
  communityNameNew?: string;
}

export default function Page() {
  async function onCreate(payload: CreateActionPayload) {
    // TODO: call server action createAction
    console.log("Creating action:", payload);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CommunitySidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">作成する</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="text-2xl mb-2">📌</div>
          <div className="font-medium text-lg mb-2">アクションカード</div>
          <p className="text-sm text-gray-600 mb-4">ピンを作成し、すぐに参加を集めよう。地域の活動やボランティア、イベントなどを投稿できます。</p>
          <div className="text-xs text-gray-500">例：公園清掃、読み聞かせ、料理教室など</div>
        </div>
        <div className="p-6 rounded-2xl border bg-gray-50 opacity-60">
          <div className="text-2xl mb-2">📦</div>
          <div className="font-medium text-lg mb-2">パッケージ（準備中）</div>
          <p className="text-sm text-gray-600 mb-4">複数アクションを束ねて、テーマ別のボードを作成します。</p>
          <div className="text-xs text-gray-500">近日公開予定</div>
        </div>
        <div className="p-6 rounded-2xl border bg-gray-50 opacity-60">
          <div className="text-2xl mb-2">📅</div>
          <div className="font-medium text-lg mb-2">イベント（準備中）</div>
          <p className="text-sm text-gray-600 mb-4">期間・場所を設定して、具体的なイベントを企画・開催できます。</p>
          <div className="text-xs text-gray-500">近日公開予定</div>
        </div>
      </div>
      <CreateActionModal onCreate={onCreate} />
          </div>
        </main>
      </div>
      
      <CommunityMobileNav />
    </div>
  );
}