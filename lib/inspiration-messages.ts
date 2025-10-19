export interface InspirationMessage {
  id: string;
  message: string;
  category: 'daily' | 'environment' | 'community' | 'wellbeing' | 'growth';
  emoji: string;
}

export const inspirationMessages: InspirationMessage[] = [
  // 日常の励ましメッセージ
  {
    id: 'daily-1',
    message: '今日も１日素敵な１日にしようね！',
    category: 'daily',
    emoji: '🌅'
  },
  {
    id: 'daily-2',
    message: '小さな一歩が大きな変化の始まりです',
    category: 'daily',
    emoji: '🌟'
  },
  {
    id: 'daily-3',
    message: 'あなたの笑顔が誰かの一日を明るくします',
    category: 'daily',
    emoji: '😊'
  },
  {
    id: 'daily-4',
    message: '今日という日は、昨日のあなたが望んでいた明日です',
    category: 'daily',
    emoji: '✨'
  },
  {
    id: 'daily-5',
    message: '新しい一日が始まります。可能性に満ちた今日を！',
    category: 'daily',
    emoji: '🌱'
  },

  // 環境に関するメッセージ
  {
    id: 'env-1',
    message: '地球の未来は、今日のあなたの選択にかかっています',
    category: 'environment',
    emoji: '🌍'
  },
  {
    id: 'env-2',
    message: '緑豊かな地球を次の世代に残そう',
    category: 'environment',
    emoji: '🌳'
  },
  {
    id: 'env-3',
    message: '自然と調和した生活で、持続可能な未来を',
    category: 'environment',
    emoji: '🦋'
  },
  {
    id: 'env-4',
    message: 'エコな選択が、美しい地球を守ります',
    category: 'environment',
    emoji: '♻️'
  },
  {
    id: 'env-5',
    message: '地球に優しい行動で、自然の恵みを大切に',
    category: 'environment',
    emoji: '🌿'
  },

  // コミュニティに関するメッセージ
  {
    id: 'comm-1',
    message: 'みんなで支え合う温かいコミュニティを築こう',
    category: 'community',
    emoji: '🤝'
  },
  {
    id: 'comm-2',
    message: '一人ひとりの力が集まって、大きな変化を生み出します',
    category: 'community',
    emoji: '👥'
  },
  {
    id: 'comm-3',
    message: '地域の絆を深めて、みんなが幸せな社会に',
    category: 'community',
    emoji: '🏘️'
  },
  {
    id: 'comm-4',
    message: '助け合いの心で、より良い社会を創りましょう',
    category: 'community',
    emoji: '💝'
  },
  {
    id: 'comm-5',
    message: '多様性を認め合い、誰もが輝ける場所に',
    category: 'community',
    emoji: '🌈'
  },

  // ウェルビーイングに関するメッセージ
  {
    id: 'well-1',
    message: '心と体の健康が、豊かな人生の基盤です',
    category: 'wellbeing',
    emoji: '🧘'
  },
  {
    id: 'well-2',
    message: '自分を大切にして、周りの人も大切にしよう',
    category: 'wellbeing',
    emoji: '💚'
  },
  {
    id: 'well-3',
    message: 'バランスの取れた生活で、充実した毎日を',
    category: 'wellbeing',
    emoji: '⚖️'
  },
  {
    id: 'well-4',
    message: '心の余裕が、創造性と成長を生み出します',
    category: 'wellbeing',
    emoji: '🌸'
  },
  {
    id: 'well-5',
    message: '今日も自分らしく、前向きに歩んでいこう',
    category: 'wellbeing',
    emoji: '🌺'
  },

  // 成長に関するメッセージ
  {
    id: 'growth-1',
    message: '学び続けることで、新しい可能性が広がります',
    category: 'growth',
    emoji: '📚'
  },
  {
    id: 'growth-2',
    message: '挑戦することで、自分自身が成長していきます',
    category: 'growth',
    emoji: '🚀'
  },
  {
    id: 'growth-3',
    message: '失敗も成功への大切なステップです',
    category: 'growth',
    emoji: '💪'
  },
  {
    id: 'growth-4',
    message: '新しいことに挑戦して、自分を発見しよう',
    category: 'growth',
    emoji: '🔍'
  },
  {
    id: 'growth-5',
    message: '継続は力なり。小さな積み重ねが大きな成果に',
    category: 'growth',
    emoji: '🎯'
  }
];

export function getRandomInspirationMessage(): InspirationMessage {
  const randomIndex = Math.floor(Math.random() * inspirationMessages.length);
  return inspirationMessages[randomIndex];
}

export function getInspirationMessageByCategory(category: InspirationMessage['category']): InspirationMessage {
  const categoryMessages = inspirationMessages.filter(msg => msg.category === category);
  const randomIndex = Math.floor(Math.random() * categoryMessages.length);
  return categoryMessages[randomIndex];
}

