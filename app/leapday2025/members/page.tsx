async function fetchMembers(){
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const r = await fetch(`${base}/api/leapday2025/members/list`, { cache:"no-store" });
  return (await r.json()).items as any[];
}
export default async function Page(){
  const list = await fetchMembers();
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold">茨城Frogs 7期（2025）メンバー</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(m=>(
          <a key={m.slug} href={`/leapday2025/member/${m.slug}/sky`} className="rounded-2xl bg-white shadow hover:shadow-lg transition p-4">
            <div className="flex items-center gap-3">
              {m.avatar_url ? <img src={m.avatar_url} className="w-12 h-12 rounded-full"/> : <div className="w-12 h-12 rounded-full bg-emerald-100" />}
              <div>
                <div className="font-semibold">{m.nickname}</div>
                <div className="text-xs text-gray-500">⭐ {m.total ?? 0}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
