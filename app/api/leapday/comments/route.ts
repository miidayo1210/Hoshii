import { NextRequest, NextResponse } from 'next/server';

// ダミーデータ
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
  },
  {
    id: '6',
    name: 'こうせい',
    label: '応援',
    comment: '今日も素敵な一日に！🌺',
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'あおり',
    label: '応援',
    comment: 'みんなの笑顔が最高！😊',
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'ひめか',
    label: '応援',
    comment: 'Leapdayを楽しもう！🎊',
    created_at: new Date().toISOString()
  },
  {
    id: '9',
    name: 'ひより',
    label: '応援',
    comment: '今日も頑張って！💪',
    created_at: new Date().toISOString()
  },
  {
    id: '10',
    name: 'みく',
    label: '応援',
    comment: 'みんなで素敵な時間を！🌸',
    created_at: new Date().toISOString()
  },
  {
    id: '11',
    name: 'るか',
    label: '応援',
    comment: 'Leapday最高の思い出に！🌟',
    created_at: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '40');
  
  const limitedComments = dummyComments.slice(0, limit);
  
  return NextResponse.json({
    items: limitedComments,
    total: dummyComments.length
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, comment } = body;
    
    if (!name || !comment) {
      return NextResponse.json(
        { error: 'Name and comment are required' },
        { status: 400 }
      );
    }
    
    const newComment = {
      id: Date.now().toString(),
      name,
      label: '応援',
      comment,
      created_at: new Date().toISOString()
    };
    
    // 実際のアプリケーションでは、ここでデータベースに保存
    dummyComments.unshift(newComment);
    
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}