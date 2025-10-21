import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { toSlug } from "@/lib/member/slug";

export async function POST(req:Request){
  const body = await req.json();
  const { token, nickname, sns, challenge_domains, interest_tags, activities, want_to_meet, self_tags, enthusiasm, avatar_url } = body || {};
  if(!token || !nickname) return NextResponse.json({ error:"token & nickname required" },{ status:400 });

  const sb = createServerClient();
  const { data:inv } = await sb.from("leapday_invites").select("*").eq("token", token).maybeSingle();
  if(!inv || inv.used) return NextResponse.json({ error:"invalid or used token" },{ status:400 });

  // slug uniqueness
  let slug = toSlug(nickname);
  for(let i=2;i<100;i++){
    const { data:dup } = await sb.from("leapday_members").select("id").eq("slug", slug).maybeSingle();
    if(!dup) break;
    slug = `${toSlug(nickname)}-${i}`;
  }

  const row = {
    slug,
    nickname,
    sns: (sns ? String(sns).split(",").map((s:string)=>s.trim()).filter(Boolean) : []),
    challenge_domains: challenge_domains ?? null,
    interest_tags: Array.isArray(interest_tags) ? interest_tags : String(interest_tags || "").split(",").map((t:string)=>t.trim()).filter(Boolean),
    activities: activities ?? null,
    want_to_meet: want_to_meet ?? null,
    self_tags: Array.isArray(self_tags) ? self_tags : String(self_tags || "").split(",").map((t:string)=>t.trim()).filter(Boolean),
    enthusiasm: enthusiasm ?? null,
    avatar_url: avatar_url ?? null,
  };

  const { error:insErr } = await sb.from("leapday_members").insert(row);
  if(insErr) return NextResponse.json({ error: insErr.message },{ status:400 });

  await sb.from("leapday_invites").update({ used: true }).eq("token", token);
  return NextResponse.json({ ok:true, slug });
}
