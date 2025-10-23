import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const projectId = '8c182150-47c5-4933-b664-c343f5703031'; // 茨城Leapday2025のプロジェクトID

    // Supabaseが設定されているかチェック
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (!isSupabaseConfigured) {
      // デモモード：固定値を返す
      return NextResponse.json({
        starsCount: 42,
        participantsCount: 15,
        actions: []
      });
    }

    // アクション実行数を取得
    const { data: actions, error: actionsError } = await supabase
      .from('project_supports')
      .select('action_type, created_at')
      .eq('project_id', projectId)
      .in('action_type', ['support', 'star']);

    if (actionsError) {
      console.error('アクション取得エラー:', actionsError);
      // エラーが発生した場合はデモモードにフォールバック
      return NextResponse.json({
        starsCount: 42,
        participantsCount: 15,
        actions: []
      });
    }

    // 星の数（アクション実行数）
    const starsCount = actions?.length || 0;

    // 参加者数（ユニークユーザー数）
    const { data: participants, error: participantsError } = await supabase
      .from('project_supports')
      .select('user_id')
      .eq('project_id', projectId)
      .in('action_type', ['support', 'star']);

    if (participantsError) {
      console.error('参加者取得エラー:', participantsError);
      // エラーが発生した場合はデモモードにフォールバック
      return NextResponse.json({
        starsCount: starsCount || 42,
        participantsCount: 15,
        actions: actions || []
      });
    }

    const uniqueParticipants = new Set(participants?.map(p => p.user_id) || []);
    const participantsCount = uniqueParticipants.size;

    return NextResponse.json({
      starsCount,
      participantsCount,
      actions: actions || []
    });
  } catch (error) {
    console.error('統計取得エラー:', error);
    // エラーが発生した場合はデモモードにフォールバック
    return NextResponse.json({
      starsCount: 42,
      participantsCount: 15,
      actions: []
    });
  }
}
