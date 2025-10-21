"use server";
import { createClient } from "@/lib/supabase";

interface CreateActionPayload {
  title: string;
  desc?: string;
  tags: string[];
  imageUrl?: string;
  communityId?: string;
  communityNameNew?: string;
}

export async function createAction(payload: CreateActionPayload) {
  try {
    const sb = createClient();
    let communityId = payload.communityId ?? null;
    
    if (!communityId && payload.communityNameNew) {
      const { data: comm, error } = await sb
        .from("communities")
        .insert({ name: payload.communityNameNew })
        .select()
        .single();
      
      if (error) throw error;
      communityId = comm.id;
    }
    
    const { data, error } = await sb
      .from("actions")
      .insert({
        title: payload.title,
        desc: payload.desc ?? null,
        image_url: payload.imageUrl ?? null,
        tags: payload.tags,
        community_id: communityId,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating action:", error);
    throw error;
  }
}
