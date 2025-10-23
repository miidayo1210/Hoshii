import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const actions = [
      // 当日以前のアクション
      { key: 'encourage_comment', label: '勇気の出るエールコメントを送る', phase: 'before' },
      { key: 'write_ambition', label: '"Be the peak"をテーマに茨城LeapDay2025抱負を書く', phase: 'before' },
      { key: 'letter_to_future', label: '３０年後の自分へ一頃', phase: 'before' },
      { key: 'share_with_encouragement', label: '激励の言葉と共にSNSにこのサイトをシェアする', phase: 'before' },
      { key: 'schedule_planning', label: 'スケジュールに茨城Leapday2025を書き込む', phase: 'before' },
      
      // 当日のアクション
      { key: 'talk_to_three', label: '小ホールで３人に話しかける', phase: 'day' },
      { key: 'find_student', label: '応援したい学生を1人見つける', phase: 'day' },
      { key: 'be_the_peak', label: 'Be the peakである', phase: 'day' },
      { key: 'post_feedback', label: '感想をコメントで投稿する', phase: 'day' },
      { key: 'think_future', label: '茨城の未来を本気で考える', phase: 'day' },
    ];
    return NextResponse.json({ actions });
  } catch (error) {
    console.error('Actions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch actions' },
      { status: 500 }
    );
  }
}
