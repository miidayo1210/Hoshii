import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    // 茨城Leapday2025プロジェクトのコメントをすべて削除
    const { error } = await supabase
      .from('project_supports')
      .delete()
      .eq('project_id', '8c182150-47c5-4933-b664-c343f5703031')
      .eq('action_type', 'comment');

    if (error) {
      console.error('コメント削除エラー:', error);
      return NextResponse.json({ error: 'コメントの削除に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'コメントを削除しました' });
  } catch (error) {
    console.error('コメント削除エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
