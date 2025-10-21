import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
export async function GET(){
  const sb = createServerClient();
  const { data: members, error } = await sb.from("leapday_members").select("*").order("nickname",{ascending:true});
  
  if (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // attach per-member counts
  const withCounts = await Promise.all((members??[]).map(async m=>{
    const { count } = await sb.from("leapday_supports").select("*",{count:"exact", head:true}).eq("member_id", m.id);
    return { ...m, total: count ?? 0 };
  }));
  return NextResponse.json({ items: withCounts });
}
