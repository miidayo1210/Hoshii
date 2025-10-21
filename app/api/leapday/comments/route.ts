import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

/**
 * Returns recent participations with comments (newest first).
 * ?limit=50 (default), includes action label if available.
 */
export async function GET(req: Request){
  const sb = createServerClient();
  const url = new URL(req.url);
  const limit = Math.min(200, parseInt(url.searchParams.get("limit") || "50", 10));

  // fetch participations with non-empty comment
  const { data: parts, error } = await sb
    .from("leapday_participations")
    .select("id,name,email,action_key,comment,created_at")
    .not("comment","is",null)
    .neq("comment","")
    .order("created_at",{ ascending:false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // get action labels map
  const actionKeys = Array.from(new Set((parts ?? []).map(p => p.action_key)));
  const { data: acts } = await sb
    .from("leapday_actions")
    .select("key,label")
    .in("key", actionKeys.length ? actionKeys : ["_none_"]);

  const labelMap = Object.fromEntries((acts ?? []).map(a => [a.key, a.label]));

  // show actual names and comments
  const items = (parts ?? []).map(p => ({
    id: p.id,
    name: p.name || "匿名",
    label: labelMap[p.action_key] || p.action_key,
    comment: p.comment,
    created_at: p.created_at,
  }));

  return NextResponse.json({ items });
}
