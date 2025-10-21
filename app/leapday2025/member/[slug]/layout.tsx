import DreamPillNav from "@/components/leapday/DreamPillNav";
async function fetchMember(slug:string){
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const r = await fetch(`${base}/api/leapday2025/member/by-slug?slug=${encodeURIComponent(slug)}`, { cache:"no-store" });
  if(!r.ok) return null;
  return (await r.json()).item;
}
export default async function Layout({ children, params }:{ children:React.ReactNode; params:{ slug:string } }){
  const m = await fetchMember(params.slug);
  const name = m?.nickname ?? "メンバー";
  const base = `/leapday2025/member/${params.slug}`;
  return (
    <div>
      <DreamPillNav base={base} name={name}/>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="flex items-center gap-3 mb-4">
          {m?.avatar_url ? <img src={m.avatar_url} className="w-14 h-14 rounded-full"/> : <div className="w-14 h-14 rounded-full bg-emerald-100" />}
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <div className="text-xs text-gray-500">IBARAKI FROGS 7th / Leapday 2025</div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
