import { NextResponse } from "next/server";
import { LEAPDAY_ACTIONS_SEED } from "@/data/leapday_actions_seed";
export async function GET(){
  return NextResponse.json({ actions: LEAPDAY_ACTIONS_SEED });
}

