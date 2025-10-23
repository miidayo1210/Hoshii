import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const limit = parseInt(searchParams.get('limit') || '10');

  console.log('コメントAPI呼び出し:', { projectId, limit });

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  // Supabaseが設定されていない場合はデモデータを返す
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (!isSupabaseConfigured) {
    console.log('Supabase未設定 - デモコメントを返す');
    const demoComments = [
      {
        id: 'demo1',
        name: 'ユーザー1',
        label: 'コメント',
        comment: '素晴らしいプロジェクトですね！',
        created_at: new Date().toISOString()
      },
      {
        id: 'demo2',
        name: 'ユーザー2',
        label: 'コメント',
        comment: '参加できて嬉しいです！',
        created_at: new Date(Date.now() - 60000).toISOString()
      }
    ];
    return NextResponse.json({ comments: demoComments });
  }

  try {
    const { data, error } = await supabase
      .from('project_supports')
      .select(`
        id,
        comment,
        created_at,
        user_id
      `)
      .eq('project_id', projectId)
      .eq('action_type', 'comment')
      .order('created_at', { ascending: false })
      .limit(limit);

    console.log('コメント取得結果:', { data, error });

    if (error) {
      console.error('コメント取得エラー:', error);
      return NextResponse.json({ error: 'コメントの取得に失敗しました' }, { status: 500 });
    }

    // ユーザー情報を別途取得
    const userIds = data?.map(item => item.user_id) || [];
    let userMap: Record<string, string> = {};
    
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, nickname')
        .in('id', userIds);
      
      userMap = users?.reduce((acc, user) => {
        acc[user.id] = user.nickname || '匿名';
        return acc;
      }, {} as Record<string, string>) || {};
    }

    const items = data?.map(item => ({
      id: item.id,
      name: userMap[item.user_id] || '匿名',
      label: 'コメント',
      comment: item.comment,
      created_at: item.created_at
    })) || [];

    console.log('コメントAPI最終レスポンス:', { itemsCount: items.length, items });
    return NextResponse.json({ comments: items });
  } catch (error) {
    console.error('コメント取得エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
