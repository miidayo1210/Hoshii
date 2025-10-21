import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
export async function GET(req:Request){
  const url = new URL(req.url); const slug = url.searchParams.get("slug")||""; const limit = Math.min(100, parseInt(url.searchParams.get("limit")||"40"));
  const sb = createServerClient();
  const { data:m } = await sb.from("leapday_members").select("id,nickname").eq("slug", slug).maybeSingle();
  if(!m) return NextResponse.json({ items: [] });
  const { data } = await sb.from("leapday_supports").select("id,name,comment,created_at").eq("member_id", m.id).not("comment","is",null).neq("comment","").order("created_at",{ascending:false}).limit(limit);
  const items = (data??[]).map(x=>({ id:x.id, name:x.name||"匿名", label:`${m.nickname}を応援`, comment:x.comment!, created_at:x.created_at! }));
  return NextResponse.json({ items });
}
