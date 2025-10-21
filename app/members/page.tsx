import MemberStarSky from "@/components/member/MemberStarSky";

async function fetchMembers(){
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const r = await fetch(`${base}/api/member/list`, { cache: "no-store" });
  return (await r.json()).items as any[];
}

async function fetchMemberStats(memberId: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const r = await fetch(`${base}/api/member/stats?memberId=${memberId}`, { cache: "no-store" });
  return r.ok ? (await r.json()) : { supportCount: 0, voteCount: 0 };
}

export default async function Page(){
  const items = await fetchMembers();
  
  // Fetch stats for each member
  const membersWithStats = await Promise.all(
    items.map(async (member) => {
      const stats = await fetchMemberStats(member.id);
      return { ...member, ...stats };
    })
  );
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">メンバー一覧</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {membersWithStats.map(m=>(
          <a key={m.slug} href={`/member/${m.slug}`} className="group">
            <div className="rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Star Sky Background */}
              <div className="h-32 relative">
                <MemberStarSky supportCount={m.supportCount} className="h-full" />
                {/* Avatar overlay */}
                <div className="absolute bottom-2 left-2">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    {m.avatar_url ? (
                      <img 
                        src={m.avatar_url} 
                        alt={m.nickname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-600">
                        {m.nickname.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Member Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{m.nickname}</h3>
                {m.challenge_domains && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {m.challenge_domains}
                  </p>
                )}
                
                {/* Support Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>⭐ {m.supportCount} 応援</span>
                  <span>🏆 {m.voteCount} 投票</span>
                </div>
                
                {/* Interest Tags */}
                {(m.interest_tags?.length>0) && (
                  <div className="flex flex-wrap gap-1">
                    {m.interest_tags.slice(0,3).map((t:string)=> (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs">
                        {t}
                      </span>
                    ))}
                    {m.interest_tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{m.interest_tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}