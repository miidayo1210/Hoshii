import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { publicId, packageKey, actions, value, meta } = body;

    // Validate required fields
    if (!publicId || !actions || !Array.isArray(actions)) {
      return NextResponse.json(
        { error: 'Missing required fields: publicId, actions' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Validate the publicId exists in the database
    // 2. Get the event and action package
    // 3. Validate the actions against the package
    // 4. Create action records and star entries
    // 5. Return the created action and star IDs

    // Mock implementation
    const actionId = `action-${Date.now()}`;
    const starId = `star-${Date.now()}`;

    // Simulate database operations
    console.log('Creating action and star:', {
      publicId,
      packageKey,
      actions,
      value: value || actions.length,
      meta,
      actionId,
      starId,
    });

    // Return success response
    return NextResponse.json({
      success: true,
      actionId,
      starId,
      starsAwarded: value || actions.length,
      message: 'アクションが正常に記録されました',
    });

  } catch (error) {
    console.error('Scan API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publicId = searchParams.get('publicId');

  if (!publicId) {
    return NextResponse.json(
      { error: 'Missing publicId parameter' },
      { status: 400 }
    );
  }

  try {
    // In a real implementation, you would:
    // 1. Look up the event by publicId
    // 2. Return event details and action package

    // Mock implementation
    const eventData = {
      id: 'event-1',
      title: 'Park Cleanup Day',
      description: '地域の公園を美しく保つための清掃活動',
      public_id: publicId,
      actionPackage: {
        id: 'pkg-1',
        name: 'Ếnvironmental Actions',
        actions: [
          { id: 'action-1', title: 'ゴミを拾う', description: '公園内のゴミを10個以上拾ってください', value: 1 },
          { id: 'action-2', title: '植物に水をやる', description: '植木鉢や花壇の植物に水をやってください', value: 1 },
          { id: 'action-3', title: '環境教育に参加', description: '環境保護についての短いセッションに参加してください', value: 2 },
        ],
      },
    };

    return NextResponse.json(eventData);

  } catch (error) {
    console.error('Get event data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
