import { notFound } from "next/navigation";
import MemberStarSky from "@/components/member/MemberStarSky";
import MemberSupport from "@/components/member/MemberSupport";

async function fetchMember(slug:string){
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const r = await fetch(`${base}/api/member/by-slug?slug=${encodeURIComponent(slug)}`, { cache:"no-store" });
  if(!r.ok) return null;
  return (await r.json()).item;
}

async function fetchMemberStats(memberId: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const r = await fetch(`${base}/api/member/stats?memberId=${memberId}`, { cache: "no-store" });
  return r.ok ? (await r.json()) : { supportCount: 0, voteCount: 0 };
}

export default async function Page({ params }:{ params:{ slug:string } }){
  const m = await fetchMember(params.slug);
  if(!m) return notFound();

  const stats = await fetchMemberStats(m.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Section with Star Sky */}
      <div className="relative">
        <div className="h-48 md:h-64 rounded-2xl overflow-hidden">
          <MemberStarSky supportCount={stats.supportCount} className="h-full" />
        </div>
        
        {/* Profile overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex items-end gap-6">
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
              {m.avatar_url ? (
                <img 
                  src={m.avatar_url} 
                  alt={m.nickname}
                  className="w-18 h-18 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-600">
                  {m.nickname.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{m.nickname}</h1>
              {m.challenge_domains && (
                <p className="text-white/80 mb-2">{m.challenge_domains}</p>
              )}
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span>⭐ {stats.supportCount} 応援</span>
                <span>🏆 {stats.voteCount} 投票</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          <section className="rounded-2xl bg-white shadow p-6">
            <h2 className="font-semibold mb-4 text-lg">プロフィール</h2>
            {m.activities && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">取り組んでいること</h3>
                <p className="text-gray-800">{m.activities}</p>
              </div>
            )}
            {m.want_to_meet && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">こんな人と会いたい</h3>
                <p className="text-gray-800">{m.want_to_meet}</p>
              </div>
            )}
            {m.enthusiasm && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">意気込み</h3>
                <p className="text-gray-800">{m.enthusiasm}</p>
              </div>
            )}
          </section>

          {/* Tags */}
          {(m.interest_tags?.length>0 || m.self_tags?.length>0) && (
            <section className="rounded-2xl bg-white shadow p-6">
              <h2 className="font-semibold mb-4 text-lg">タグ</h2>
              {m.interest_tags?.length>0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">興味のある領域</h3>
                  <div className="flex flex-wrap gap-2">
                    {m.interest_tags.map((t:string)=>(
                      <span key={t} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {m.self_tags?.length>0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">あなたらしさ</h3>
                  <div className="flex flex-wrap gap-2">
                    {m.self_tags.map((t:string)=>(
                      <span key={t} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* SNS */}
          {m.sns?.length>0 && (
            <section className="rounded-2xl bg-white shadow p-6">
              <h2 className="font-semibold mb-4 text-lg">SNS</h2>
              <ul className="space-y-2">
                {m.sns.map((s:string)=>(
                  <li key={s}>
                    <a 
                      className="text-emerald-600 hover:text-emerald-700 underline" 
                      href={s} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column - Support */}
        <div className="space-y-6">
          <section className="rounded-2xl bg-white shadow p-6">
            <MemberSupport 
              memberId={m.id}
              memberName={m.nickname}
              supportCount={stats.supportCount}
            />
          </section>

          {/* Back to Members */}
          <div className="text-center">
            <a 
              href="/members" 
              className="inline-block px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              ← メンバー一覧へ戻る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}