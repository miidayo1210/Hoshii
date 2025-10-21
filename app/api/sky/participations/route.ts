import { NextResponse } from "next/server";
import { getSkyParticipations } from "@/lib/sky/utils";
import { COMMENT } from "@/lib/types/sky";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const skyId = url.searchParams.get("skyId");
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") || COMMENT.fetchLimit.toString()));
  
  if (!skyId) {
    return NextResponse.json({ error: "skyId required" }, { status: 400 });
  }
  
  const participations = await getSkyParticipations(skyId, limit);
  
  return NextResponse.json({ participations });
}


