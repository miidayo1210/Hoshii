import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const memberId = url.searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    const sb = createServerClient();

    // Get support count
    const { count: supportCount } = await sb
      .from("leapday_member_support")
      .select("*", { count: "exact", head: true })
      .eq("member_id", memberId);

    // Get vote count
    const { count: voteCount } = await sb
      .from("leapday_audience_votes")
      .select("*", { count: "exact", head: true })
      .eq("member_id", memberId);

    return NextResponse.json({
      supportCount: supportCount || 0,
      voteCount: voteCount || 0
    });
  } catch (error) {
    console.error("Error in /api/member/stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}