import { ActionDef, DensityConfig } from "@/lib/types/sky";

export const SKY: { id: string; title: string } = {
  id: "LEAPDAY2025",
  title: "茨城Frogs Leapday 2025",
};

// この星空で使えるアクション（必要に応じて増やす）
export const ACTIONS: ActionDef[] = [
  { key: "support_message", label: "LEAP DAYを応援する、コメントを送る", phase: "before" },
  { key: "memory_ibaraki",  label: "茨城の思い出を教えて コメントを送る", phase: "before" },
  { key: "exchange_cards",  label: "隣の人と名刺交換する", phase: "day", kind: "in_person" },
  { key: "be_kind",         label: "優しい気持ちでいる", phase: "day" },
  { key: "pick_trash",      label: "ゴミを拾う", phase: "day" },
];

export const DENSITY: DensityConfig = {
  base: 50, gain: 0.6, min: 40, max: 500
};

// UI: コメント表示件数など
export const UI = {
  commentLimit: 40,
  pollMs: 5000,
} as const;


