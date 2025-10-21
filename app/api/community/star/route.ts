import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { actionId } = await req.json();
    
    if (!actionId) {
      return NextResponse.json({ error: "actionId is required" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: action } = await supabase
      .from("actions")
      .select("id, stars_count")
      .eq("id", actionId)
      .single();

    if (!action) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // insert star
    await supabase
      .from("stars")
      .insert({ user_id: user.id, action_id: actionId });
    
    // update stars count
    await supabase
      .from("actions")
      .update({ stars_count: (action.stars_count ?? 0) + 1 })
      .eq("id", actionId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error starring action:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}