"use server";
import { createClient } from "@/lib/supabase";

interface FeedScope {
  scope: "personal" | "community";
}

export async function fetchFeed({ scope }: FeedScope) {
  try {
    const supabase = createClient();
    
    // simple example: latest actions
    const { data } = await supabase
      .from("actions")
      .select("id, title, image_url, stars_count")
      .order("created_at", { ascending: false })
      .limit(50);
    
    return data ?? [];
  } catch (error) {
    console.error("Error fetching feed:", error);
    return [];
  }
}


