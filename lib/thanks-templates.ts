export type ThanksFrom = 'society' | 'environment' | 'peer';

export interface ThanksTemplate {
  from: ThanksFrom;
  messages: string[];
}

export const thanksTemplates: ThanksTemplate[] = [
  {
    from: 'society',
    messages: [
      'あなたの貢献が、コミュニティをより強くしています。ありがとう！',
      '一緒に、もっと素敵な明日を作りましょう。参加してくれてありがとう！',
      'どんな小さなアクションも大切です。あなたの行動が周りを元気にしています！',
      'あなたは本当に人々の生活を変えています。感謝します！',
      'あなたの優しさが、ポジティブな変化の波を生み出しています。素晴らしい！',
    ],
  },
  {
    from: 'environment',
    messages: [
      '地球があなたの思いやりに感謝しています！',
      'エコな選択が地球を癒やしています。ありがとう！',
      'あなたは未来を守っています、一つずつ。すごい！',
      'あなたのような人がいるから、地球はもっと良くなります。感謝！',
      'あなたの緑のアクションが、みんなにとってより健康な世界を作っています。続けて！',
    ],
  },
  {
    from: 'peer',
    messages: [
      'あなたはチームの模範です。素晴らしい仕事を続けてね！',
      'あなたの献身は見逃されていません。お手本を示してくれてありがとう！',
      'すごい努力！みんな誇りに思っているよ！',
      'あなたのポジティブなエネルギーは伝染します。あなたらしくいてくれてありがとう！',
      'よくやった！一人の力で違いを生み出せることを証明してくれてる！',
    ],
  },
];

export function getThanksMessage(from: ThanksFrom, domain?: string): string {
  const template = thanksTemplates.find((t) => t.from === from);
  if (!template) {
    return 'ご協力ありがとうございます！';
  }
  
  const randomIndex = Math.floor(Math.random() * template.messages.length);
  return template.messages[randomIndex];
}
