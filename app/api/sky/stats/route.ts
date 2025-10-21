import { NextResponse } from "next/server";
import { getSkyStats } from "@/lib/sky/utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const skyId = url.searchParams.get("skyId");
  
  if (!skyId) {
    return NextResponse.json({ error: "skyId required" }, { status: 400 });
  }
  
  const stats = await getSkyStats(skyId);
  
  if (!stats) {
    return NextResponse.json({ error: "Sky not found" }, { status: 404 });
  }
  
  // 統一レスポンス形式
  return NextResponse.json({
    ok: true,
    total: stats.totalStars,
    totalActions: stats.totalActions
  });
}
