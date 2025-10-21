import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { leapday2025Members } from "@/data/leapday2025_members_seed";

export async function POST() {
  try {
    const sb = createServerClient();
    
    let created = 0;
    let updated = 0;

    for (const memberData of leapday2025Members) {
      // Check if member already exists
      const { data: existing } = await sb
        .from("leapday_members_2025")
        .select("id")
        .eq("slug", memberData.slug)
        .single();

      if (existing) {
        // Update existing member
        await sb
          .from("leapday_members_2025")
          .update(memberData)
          .eq("slug", memberData.slug);
        updated++;
      } else {
        // Insert new member
        await sb
          .from("leapday_members_2025")
          .insert(memberData);
        created++;
      }
    }

    return NextResponse.json({
      ok: true,
      created,
      updated,
      message: `Seeded ${created} new members, updated ${updated} existing members`
    });
  } catch (error) {
    console.error("Error seeding members:", error);
    return NextResponse.json({ 
      error: "Failed to seed members",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
