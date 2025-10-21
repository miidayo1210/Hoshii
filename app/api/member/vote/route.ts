import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { memberId, voterName, voterEmail, voteReason } = await req.json();
    
    if (!memberId || !voterName) {
      return NextResponse.json({ error: "Member ID and voter name are required" }, { status: 400 });
    }

    const sb = createServerClient();
    
    const { data, error } = await sb
      .from("leapday_audience_votes")
      .insert({
        member_id: memberId,
        voter_name: voterName,
        voter_email: voterEmail || null,
        vote_reason: voteReason || null
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating vote:", error);
      return NextResponse.json({ error: "Failed to create vote" }, { status: 500 });
    }

    return NextResponse.json({ success: true, vote: data });
  } catch (error) {
    console.error("Error in /api/member/vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
