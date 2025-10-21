import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
export async function GET(){
  const sb = createServerClient();
  const { data } = await sb.from("leapday_members").select("*").order("created_at",{ ascending:false });
  return NextResponse.json({ items: data ?? [] });
}
