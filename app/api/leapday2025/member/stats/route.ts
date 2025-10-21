import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
export async function GET(req:Request){
  const url = new URL(req.url); const slug = url.searchParams.get("slug")||"";
  const sb = createServerClient();
  const { data:m } = await sb.from("leapday_members").select("id").eq("slug", slug).maybeSingle();
  if(!m) return NextResponse.json({ error:"not found" },{ status:404 });
  const { count } = await sb.from("leapday_supports").select("*",{count:"exact", head:true}).eq("member_id", m.id);
  return NextResponse.json({ total: count ?? 0 });
}
