import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // この機能は実装予定
    return NextResponse.json({ 
      message: 'Comments cleared successfully' 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear comments' },
      { status: 500 }
    );
  }
}

