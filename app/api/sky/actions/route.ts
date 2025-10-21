import { NextResponse } from "next/server";
import { getSkyActions } from "@/lib/sky/utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const skyId = url.searchParams.get("skyId");
  
  if (!skyId) {
    return NextResponse.json({ error: "skyId required" }, { status: 400 });
  }
  
  const actions = await getSkyActions(skyId);
  
  return NextResponse.json({ actions });
}


