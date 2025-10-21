"use client";
import useSWR from "swr";
import MemberStarSky from "@/components/member/MemberStarSky";
import FloatingComments from "@/components/leapday/FloatingComments";
import DreamButton from "@/components/leapday/DreamButton";
import { SkyId, toDensity } from "@/lib/types/sky";
import { COMMENT } from "@/lib/types/sky";
const fetcher = (u:string)=>fetch(u).then(r=>r.json());
export default function Page({ params }:{ params:{ slug:string } }){
  const skyId: SkyId = `member:${params.slug}`;
  
  // 統一APIを使用
  const { data: stats } = useSWR<{totalStars: number, totalActions: number}>(`/api/sky/stats?skyId=${skyId}`, fetcher, { refreshInterval: 5000 });
  const { data: participationsData } = useSWR<{participations: any[]}>(`/api/sky/participations?skyId=${skyId}&limit=${COMMENT.fetchLimit}`, fetcher, { refreshInterval: 6000 });
  
  const totalStars = stats?.totalStars ?? 0;
  
  // Convert participations to FloatingComments format
  const memberComments = (participationsData?.participations ?? []).map(part => ({
    name: part.name || "匿名",
    comment: part.comment,
    created_at: part.createdAt
  }));
  
  return (
    <div className="space-y-8">
      {/* Hero Section with Member-specific Starfield */}
      <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
        <MemberStarSky supportCount={totalStars} className="h-full" />
        
        {/* Member Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-end gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-gray-600">
                  {params.slug.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {params.slug}の星空
                </h1>
                <div className="flex items-center gap-4 text-white/80">
                  <span className="text-lg">⭐ {totalStars} 星</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Button */}
      <div className="text-center">
        <DreamButton as="a" href={`/leapday2025/member/${params.slug}/support`} className="inline-block">
          💖 {params.slug}さんを応援する
        </DreamButton>
      </div>

      {/* Member-specific Comments */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[var(--yk-ink)] mb-6 text-center">
          {params.slug}さんへの応援コメント
        </h2>
        {memberComments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {memberComments.map((comment, index) => (
              <div key={index} className="yk-card p-4 bg-white/80 backdrop-blur border border-black/5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {comment.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-800">
                        {comment.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>まだ応援コメントはありません。</p>
            <p className="text-sm mt-2">最初の応援コメントを送ってみませんか？</p>
          </div>
        )}
      </div>
    </div>
  );
}
