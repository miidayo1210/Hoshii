import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
export async function GET(req:Request){
  const url = new URL(req.url); const slug = url.searchParams.get("slug")||"";
  const sb = createServerClient();
  const { data } = await sb.from("leapday_members").select("*").eq("slug", slug).maybeSingle();
  if(!data) return NextResponse.json({ error:"not found" },{ status:404 });
  return NextResponse.json({ item: data });
}
