import { createServerClient } from "@/lib/supabaseServer";
import { SkyId, SkyStats, Participation, ActionDef } from "@/lib/types/sky";
import { COMMENT } from "@/lib/types/sky";

/**
 * weightsを考慮した星合計
 */
export async function calcStars(skyId: SkyId): Promise<SkyStats> {
  const sb = createServerClient();
  
  // SQL: summarized_stars から拾うのが高速
  const { data: summary, error: summaryError } = await sb
    .from("summarized_stars")
    .select("*")
    .eq("sky_id", skyId)
    .maybeSingle();
  
  if (!summaryError && summary) {
    return {
      skyId: summary.sky_id,
      totalStars: summary.total_stars,
      totalActions: summary.total_actions,
      updatedAt: summary.updated_at
    };
  }
  
  // Fallback: participations × actions.weight を合算
  const { data: participations, error: partError } = await sb
    .from("participations")
    .select(`
      id,
      created_at,
      action_key,
      actions!inner(weight)
    `)
    .eq("sky_id", skyId);
  
  if (partError) {
    console.error("Error calculating stars:", partError);
    return {
      skyId,
      totalStars: 0,
      totalActions: 0,
      updatedAt: new Date().toISOString()
    };
  }
  
  const totalStars = participations?.reduce((sum, part) => sum + ((part as any).actions?.weight || 1), 0) || 0;
  const totalActions = participations?.length || 0;
  const updatedAt = participations?.length > 0 
    ? participations[0].created_at 
    : new Date().toISOString();
  
  return { skyId, totalStars, totalActions, updatedAt };
}

/**
 * 星空の統計情報を取得（calcStarsのエイリアス）
 */
export async function getSkyStats(skyId: SkyId): Promise<SkyStats | null> {
  try {
    return await calcStars(skyId);
  } catch (error) {
    console.error("Error fetching sky stats:", error);
    return null;
  }
}

/**
 * 星空のアクション定義を取得
 */
export async function getSkyActions(skyId: SkyId): Promise<ActionDef[]> {
  const sb = createServerClient();
  
  const { data, error } = await sb
    .from("actions")
    .select("*")
    .eq("sky_id", skyId)
    .order("phase", { ascending: true })
    .order("key", { ascending: true });
  
  if (error) {
    console.error("Error fetching sky actions:", error);
    return [];
  }
  
  return (data || []).map(action => ({
    key: action.key,
    label: action.label,
    kind: action.kind as "in_person" | "online",
    weight: action.weight,
    phase: action.phase as "before" | "day"
  }));
}

/**
 * 星空の参加記録を取得（コメント付き）
 */
export async function getSkyParticipations(
  skyId: SkyId, 
  limit: number = 40
): Promise<Participation[]> {
  const sb = createServerClient();
  
  const { data, error } = await sb
    .from("participations")
    .select("*")
    .eq("sky_id", skyId)
    .not("comment", "is", null)
    .neq("comment", "")
    .order("created_at", { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error("Error fetching participations:", error);
    return [];
  }
  
  return (data || []).map(part => ({
    id: part.id,
    skyId: part.sky_id,
    actionKey: part.action_key,
    name: part.name,
    email: part.email,
    comment: part.comment,
    createdAt: part.created_at
  }));
}

/**
 * 投稿（=星を増やす）
 */
export async function addParticipation(input: {
  skyId: SkyId; 
  actionKey: string; 
  name?: string; 
  email?: string; 
  comment?: string;
}): Promise<SkyStats | null> {
  const sb = createServerClient();
  
  // 1) action存在チェック
  const { data: action, error: actionError } = await sb
    .from("actions")
    .select("key, weight")
    .eq("sky_id", input.skyId)
    .eq("key", input.actionKey)
    .maybeSingle();
  
  if (actionError || !action) {
    console.error("Action not found:", input.actionKey, "for sky:", input.skyId);
    return null;
  }
  
  // 2) comment長バリデーション
  if (input.comment && input.comment.length > COMMENT.maxLen) {
    console.error("Comment too long:", input.comment.length, "max:", COMMENT.maxLen);
    return null;
  }
  
  // 3) participations insert
  const { error: insertError } = await sb
    .from("participations")
    .insert({
      sky_id: input.skyId,
      action_key: input.actionKey,
      name: input.name || null,
      email: input.email || null,
      comment: input.comment || null
    });
  
  if (insertError) {
    console.error("Error adding participation:", insertError);
    return null;
  }
  
  // 4) calcStars() を返す
  return await calcStars(input.skyId);
}

/**
 * 星空を作成
 */
export async function createSky(skyId: SkyId, title: string): Promise<boolean> {
  const sb = createServerClient();
  
  const { error } = await sb
    .from("skies")
    .insert({
      id: skyId,
      title
    });
  
  if (error) {
    console.error("Error creating sky:", error);
    return false;
  }
  
  return true;
}

/**
 * 星空にアクションを追加
 */
export async function addSkyAction(
  skyId: SkyId,
  actionDef: ActionDef
): Promise<boolean> {
  const sb = createServerClient();
  
  const { error } = await sb
    .from("actions")
    .insert({
      sky_id: skyId,
      key: actionDef.key,
      label: actionDef.label,
      kind: actionDef.kind || "in_person",
      weight: actionDef.weight || 1,
      phase: actionDef.phase
    });
  
  if (error) {
    console.error("Error adding sky action:", error);
    return false;
  }
  
  return true;
}
