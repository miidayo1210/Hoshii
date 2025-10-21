import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

function randomToken(len=20){
  const chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({length:len}).map(()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}
export async function POST(){
  const sb = createServerClient();
  // TODO: add auth guard if needed
  const token = randomToken(28);
  await sb.from("leapday_invites").insert({ token });
  return NextResponse.json({ inviteUrl: `/member/signup/${token}`, token });
}
