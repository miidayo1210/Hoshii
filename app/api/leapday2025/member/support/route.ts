import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { SkyId, Participation } from "@/lib/types/sky";
import { MEMBER_ACTIONS } from "@/lib/actions/member";

export async function POST(req:Request){
  const { slug, skyId, name, email, comment, action } = await req.json();
  if(!slug) return NextResponse.json({ error:"slug required" },{ status:400 });
  
  const sb = createServerClient();
  const { data:m } = await sb.from("leapday_members").select("id,nickname").eq("slug", slug).maybeSingle();
  if(!m) return NextResponse.json({ error:"member not found" },{ status:404 });

  // Get action weight
  const actionDef = MEMBER_ACTIONS.find(a => a.key === action);
  const weight = actionDef?.weight ?? 1;

  // Insert member-specific support
  await sb.from("leapday_supports").insert({ 
    member_id: m.id, 
    name: name ?? null, 
    email: email ?? null, 
    comment: comment ?? null,
    action: action ?? null,
    weight: weight
  });
  
  // Insert into global participations with skyId
  await sb.from("leapday_participations").insert({ 
    sky_id: skyId || `member:${slug}`,
    name: name ?? null, 
    email: email ?? null, 
    action_key: action || "member_support", 
    comment: comment ?? null,
    weight: weight
  });

  const { count } = await sb.from("leapday_supports").select("*",{count:"exact", head:true}).eq("member_id", m.id);
  return NextResponse.json({ ok:true, total: count ?? 0 });
}
