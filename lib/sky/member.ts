import { ActionDef, DensityConfig } from "@/lib/types/sky";

// メンバー用のアクション定義
export const MEMBER_ACTIONS: ActionDef[] = [
  { key: "leapday_support", label: "LEAP DAYを応援する", weight: 1, phase: "before" },
  { key: "ibarakai_memory", label: "茨城の思い出を教えて", weight: 1, phase: "before" },
  { key: "student_life", label: "学生時代はどのような子供だった？", weight: 1, phase: "before" },
  { key: "parent_thanks", label: "両親に感謝の気持ちを伝えてみよう", weight: 1, phase: "before" },
  { key: "business_card", label: "隣の人と名刺交換する", weight: 1, phase: "day" },
  { key: "kind_heart", label: "優しい気持ちでいる", weight: 1, phase: "day" },
  { key: "pick_trash", label: "ゴミを拾う", weight: 1, phase: "day" },
  { key: "vote", label: "投票する", weight: 1, phase: "day" },
];

// メンバー用の密度設定
export const MEMBER_DENSITY: DensityConfig = {
  base: 5, gain: 0.7, min: 5, max: 200
};

// メンバー用UI設定
export const MEMBER_UI = {
  commentLimit: 40,
  pollMs: 5000,
} as const;

// 絵文字マッピング
export const MEMBER_ACTION_EMOJIS: Record<string, string> = {
  leapday_support: "🌟",
  ibarakai_memory: "🌸",
  student_life: "📚",
  parent_thanks: "💝",
  business_card: "💼",
  kind_heart: "💖",
  pick_trash: "♻️",
  vote: "🗳️",
};




