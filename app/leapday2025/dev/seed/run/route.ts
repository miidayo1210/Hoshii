import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { IBK7_MEMBERS_2025 } from "@/data/leapday2025_members_seed";
export async function POST(){
  const sb = createServerClient();
  let created=0, updated=0;
  for(const m of IBK7_MEMBERS_2025){
    const { data:ex } = await sb.from("leapday_members").select("id").eq("slug", m.slug).maybeSingle();
    if(ex?.id){ await sb.from("leapday_members").update({ nickname:m.nickname, avatar_url:m.avatar_url, cohort:"IBK2025" }).eq("id", ex.id); updated++; }
    else { await sb.from("leapday_members").insert({ ...m, cohort:"IBK2025" }); created++; }
  }
  return NextResponse.json({ ok:true, created, updated });
}
