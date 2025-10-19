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
    // 2. Get all actions completed for this event
    // 3. Generate CSV data

    // Mock data
    const actions = [
      {
        id: 'action-1',
        title: 'ゴミを拾う',
        description: '公園内のゴミを10個以上拾ってください',
        value: 1,
        completedAt: '2024-12-01T10:00:00Z',
        participantName: '田中太郎',
        participantEmail: 'tanaka@example.com',
      },
      {
        id: 'action-2',
        title: '植物に水をやる',
        description: '植木鉢や花壇の植物に水をやってください',
        value: 1,
        completedAt: '2024-12-01T11:30:00Z',
        participantName: '佐藤花子',
        participantEmail: 'sato@example.com',
      },
      {
        id: 'action-3',
        title: '環境教育に参加',
        description: '環境保護についての短いセッションに参加してください',
        value: 2,
        completedAt: '2024-12-01T14:00:00Z',
        participantName: '山田次郎',
        participantEmail: 'yamada@example.com',
      },
    ];

    // Generate CSV
    const csvHeaders = [
      'アクションID',
      'アクション名',
      '説明',
      'スター値',
      '完了日時',
      '参加者名',
      '参加者メール',
    ];

    const csvRows = actions.map(action => [
      action.id,
      action.title,
      action.description,
      action.value,
      action.completedAt,
      action.participantName,
      action.participantEmail,
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="actions_${eventId}_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Actions export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
