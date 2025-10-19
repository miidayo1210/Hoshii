import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json(
      { error: 'Missing eventId parameter' },
      { status: 400 }
    );
  }

  try {
    // In a real implementation, you would:
    // 1. Look up the event by eventId
    // 2. Get all stars earned for this event
    // 3. Generate CSV data

    // Mock data
    const stars = [
      {
        id: 'star-1',
        value: 1,
        earnedAt: '2024-12-01T10:00:00Z',
        participantName: '田中太郎',
        participantEmail: 'tanaka@example.com',
        actionTitle: 'ゴミを拾う',
        totalStars: 1,
      },
      {
        id: 'star-2',
        value: 1,
        earnedAt: '2024-12-01T11:30:00Z',
        participantName: '佐藤花子',
        participantEmail: 'sato@example.com',
        actionTitle: '植物に水をやる',
        totalStars: 1,
      },
      {
        id: 'star-3',
        value: 2,
        earnedAt: '2024-12-01T14:00:00Z',
        participantName: '山田次郎',
        participantEmail: 'yamada@example.com',
        actionTitle: '環境教育に参加',
        totalStars: 3,
      },
      {
        id: 'star-4',
        value: 1,
        earnedAt: '2024-12-02T09:00:00Z',
        participantName: '鈴木美咲',
        participantEmail: 'suzuki@example.com',
        actionTitle: 'リサイクル活動',
        totalStars: 1,
      },
    ];

    // Generate CSV
    const csvHeaders = [
      'スターID',
      'スター値',
      '獲得日時',
      '参加者名',
      '参加者メール',
      'アクション名',
      '累計スター数',
    ];

    const csvRows = stars.map(star => [
      star.id,
      star.value,
      star.earnedAt,
      star.participantName,
      star.participantEmail,
      star.actionTitle,
      star.totalStars,
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="stars_${eventId}_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Stars export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
