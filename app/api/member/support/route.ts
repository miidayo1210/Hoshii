import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { memberId, supporterName, supporterEmail, comment } = body;

    if (!memberId || !supporterName || !comment) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const sb = createServerClient();

    // Insert support
    const { data, error } = await sb
      .from("leapday_member_support")
      .insert({
        member_id: memberId,
        supporter_name: supporterName,
        supporter_email: supporterEmail || null,
        comment: comment,
        support_type: "general"
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting support:", error);
      return NextResponse.json({ error: "Failed to submit support" }, { status: 500 });
    }

    // Get updated support count
    const { count } = await sb
      .from("leapday_member_support")
      .select("*", { count: "exact", head: true })
      .eq("member_id", memberId);

    return NextResponse.json({ 
      success: true, 
      supportCount: count || 0,
      message: "応援ありがとうございます！"
    });
  } catch (error) {
    console.error("Error in /api/member/support:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}