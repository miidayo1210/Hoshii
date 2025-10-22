import { NextRequest, NextResponse } from 'next/server';

// ダミーデータ
const dummyStats = {
  total: 12345,
  today: 42,
  thisWeek: 156
};

const dummyComments = [
  {
    id: '1',
    name: 'みい',
    label: '応援',
    comment: 'みんな頑張って！✨',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'ふみか',
    label: '応援',
    comment: 'Leapday楽しんでね！🌟',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'りょう',
    label: '応援',
    comment: '素敵な一日になりますように💫',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'たけ',
    label: '応援',
    comment: 'みんなで頑張ろう！🎉',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'あいる',
    label: '応援',
    comment: 'Leapday最高！✨',
    created_at: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  if (type === 'badge') {
    return NextResponse.json({
      total: dummyStats.total,
      badge: `https://img.shields.io/badge/Stars-${dummyStats.total}-blueviolet?style=for-the-badge&logo=star`
    });
  }
  
  return NextResponse.json(dummyStats);
}