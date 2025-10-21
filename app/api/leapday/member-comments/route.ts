import { NextRequest, NextResponse } from 'next/server';

// メンバー別のコメントデータ（実際のアプリではデータベースを使用）
const memberComments: Record<string, Array<{
  id: string;
  name: string;
  message: string;
  timestamp: string;
  memberName: string;
}>> = {};

// メンバー名のリスト
const memberNames = [
  "あおり", "あいる", "いみい", "えこうせい", "おたけ",
  "かひめか", "きひより", "くみく", "けるか", "こふみか", "さりょう"
];

// 初期データを設定
memberNames.forEach(memberName => {
  if (!memberComments[memberName]) {
    memberComments[memberName] = [
      {
        id: `${memberName}-1`,
        name: "応援者A",
        message: `${memberName}さん、応援しています！`,
        timestamp: new Date().toISOString(),
        memberName: memberName
      },
      {
        id: `${memberName}-2`,
        name: "応援者B",
        message: `${memberName}さんの頑張りを見て感動しました！`,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        memberName: memberName
      }
    ];
  }
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const memberName = searchParams.get('member');
  const limit = parseInt(searchParams.get('limit') || '40');

  if (!memberName) {
    return NextResponse.json({ error: 'Member name is required' }, { status: 400 });
  }

  // URLデコード
  const decodedMemberName = decodeURIComponent(memberName);
  
  if (!memberComments[decodedMemberName]) {
    memberComments[decodedMemberName] = [];
  }

  const comments = memberComments[decodedMemberName]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberName = searchParams.get('member');
    
    if (!memberName) {
      return NextResponse.json({ error: 'Member name is required' }, { status: 400 });
    }

    const decodedMemberName = decodeURIComponent(memberName);
    const body = await request.json();
    const { name, message } = body;

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
    }

    const newComment = {
      id: `${decodedMemberName}-${Date.now()}`,
      name,
      message,
      timestamp: new Date().toISOString(),
      memberName: decodedMemberName
    };

    if (!memberComments[decodedMemberName]) {
      memberComments[decodedMemberName] = [];
    }

    memberComments[decodedMemberName].push(newComment);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
