import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { LEAPDAY_ACTIONS_SEED } from "@/data/leapday_actions_seed";

export async function POST() {
  try {
    const sb = createServerClient();
    
    // 環境変数が設定されていない場合はモックレスポンスを返す
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock')) {
      console.log("Development: Returning mock seed response");
      return NextResponse.json({
        ok: true,
        created: LEAPDAY_ACTIONS_SEED.length,
        updated: 0,
        message: "Development: Mock seed completed (no database connection)"
      });
    }
    
    let created = 0, updated = 0;
    
    for (const action of LEAPDAY_ACTIONS_SEED) {
      // Check if action already exists
      const { data: exists, error: fetchError } = await sb
        .from("leapday_actions")
        .select("key")
        .eq("key", action.key)
        .maybeSingle();

      if (fetchError) {
        console.error(`Error checking action ${action.key}:`, fetchError);
        continue;
      }

      if (exists?.key) {
        // Update existing action
        const { error: updateError } = await sb
          .from("leapday_actions")
          .update({ label: action.label, phase: action.phase })
          .eq("key", action.key);
        
        if (updateError) {
          console.error(`Error updating action ${action.key}:`, updateError);
        } else {
          updated++;
        }
      } else {
        // Insert new action
        const { error: insertError } = await sb
          .from("leapday_actions")
          .insert({ key: action.key, label: action.label, phase: action.phase });
        
        if (insertError) {
          console.error(`Error inserting action ${action.key}:`, insertError);
        } else {
          created++;
        }
      }
    }

    return NextResponse.json({ 
      ok: true, 
      created, 
      updated,
      message: `Seeded ${created} new actions, updated ${updated} existing actions`
    });
  } catch (error) {
    console.error("Error in seed endpoint:", error);
    return NextResponse.json({ 
      ok: false, 
      error: "Failed to seed actions" 
    }, { status: 500 });
  }
}
