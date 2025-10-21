export const LEAPDAY_ACTIONS_SEED = [
  { key: "support_message", label: "LEAP DAYを応援する、コメントを送る", phase: "before" },
  { key: "memory_ibaraki",  label: "茨城の思い出を教えて　コメントを送る", phase: "before" },
  { key: "what_student_like", label: "学生時代はどのような子供だった？　コメントを送る", phase: "before" },
  { key: "thanks_parents",  label: "両親に感謝の気持ちを伝えてみよう", phase: "before" },

  { key: "exchange_cards",  label: "隣の人と名刺交換する", phase: "day" },
  { key: "be_kind",         label: "優しい気持ちでいる", phase: "day" },
  { key: "pick_trash",      label: "ゴミを拾う", phase: "day" },
] as const;
