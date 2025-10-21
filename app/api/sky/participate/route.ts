import { NextResponse } from "next/server";
import { addParticipation } from "@/lib/sky/utils";

export async function POST(req: Request) {
  try {
    const { skyId, actionKey, name, email, comment } = await req.json();
    
    if (!skyId || !actionKey) {
      return NextResponse.json({ error: "skyId and actionKey required" }, { status: 400 });
    }
    
    const stats = await addParticipation({
      skyId,
      actionKey,
      name,
      email,
      comment
    });
    
    if (!stats) {
      return NextResponse.json({ error: "Failed to add participation" }, { status: 500 });
    }
    
    // 統一レスポンス形式
    return NextResponse.json({
      ok: true,
      total: stats.totalStars,
      totalActions: stats.totalActions
    });
  } catch (error) {
    console.error("Error in participation API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
