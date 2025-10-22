"use client";
import useSWR from "swr";
import { useState } from "react";
import DreamButton from "@/components/leapday/DreamButton";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { commentManager } from "@/lib/comment-manager";

type Action = { key:string; label:string; phase:"before"|"day" };
async function fetchJSON(url:string){ const r=await fetch(url); return r.json(); }

export default function Page(){
  const { user } = useAuth();
  const { data } = useSWR<{ actions:Action[] }>("/api/leapday/actions", fetchJSON);
  const [form, setForm] = useState({ comment:"" });
  const [selected, setSelected] = useState<string>("");
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const actions = data?.actions ?? [];

  console.log('Page render:', { user: !!user, actionsCount: actions.length, selected, isSubmitting });

  async function submit(){
    if(!selected || !user) {
      alert("アクションを選択してください");
      return;
    }
    if(isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      let actionType = '';
      let actionLabel = '';

      if (selected === 'support') {
        actionType = 'support'; // 既存の制約に合わせる
        actionLabel = '応援する';
      } else {
        const selectedAction = actions.find(a => a.key === selected);
        if (!selectedAction) {
          throw new Error('選択されたアクションが見つかりません');
        }
        actionType = selectedAction.phase === 'before' ? 'support' : 'star'; // 既存の制約に合わせる
        actionLabel = selectedAction.label;
      }

      console.log('アクション実行開始:', { actionType, actionLabel, userId: user.id });

      // Supabaseが設定されているかチェック
      const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (!isSupabaseConfigured) {
        console.log('Supabase未設定 - デモモードで実行');
        setDone(true);
        setForm({ comment: "" });
        setSelected("");
        return;
      }

      // アクション実行を記録
      const { data: actionData, error: actionError } = await supabase
        .from('project_supports')
        .insert({
          project_id: '8c182150-47c5-4933-b664-c343f5703031',
          user_id: user.id,
          action_type: actionType,
          comment: form.comment.trim() || `${actionLabel}を実行しました`
        })
        .select();

      console.log('アクション記録結果:', { actionData, actionError });

      if (actionError) {
        console.error('アクション記録エラー:', actionError);
        throw new Error(`アクションの記録に失敗しました: ${actionError.message}`);
      }

      // コメントも投稿する場合
      if (form.comment.trim()) {
        // Supabaseが設定されている場合はデータベースに保存
        if (isSupabaseConfigured) {
          const { data: commentData, error: commentError } = await supabase
            .from('project_supports')
            .insert({
              project_id: '8c182150-47c5-4933-b664-c343f5703031',
              user_id: user.id,
              action_type: 'comment',
              comment: form.comment.trim()
            })
            .select();

          console.log('コメント記録結果:', { commentData, commentError });

          if (commentError) {
            console.error('コメント記録エラー:', commentError);
            throw new Error(`コメントの記録に失敗しました: ${commentError.message}`);
          }
        }

        // グローバルコメント管理にも追加（即座に表示される）
        const commentItem = {
          id: `action_${Date.now()}`,
          name: user.user_metadata?.name || 'ユーザー',
          label: 'コメント',
          comment: form.comment.trim(),
          created_at: new Date().toISOString()
        };
        commentManager.addComment(commentItem);
        console.log('アクションコメント追加:', commentItem);
      }

      console.log('アクション実行完了');
      setDone(true);
      setForm({ comment: "" });
      setSelected("");
      
      // ページを更新して星の数を反映
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('アクション実行エラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'アクションの実行に失敗しました';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* アクション選択 */}
      <div className="yk-card rounded-2xl p-4">
        <div className="font-medium mb-4">アクションを選ぶ</div>
        
        {/* Before actions */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3 border-l-4 border-[var(--yk-accent)] pl-2">当日以前</h3>
          <div className="space-y-2">
            {actions.filter(a => a.phase === "before").map(a=>(
              <label key={a.key}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl border cursor-pointer transition
                  ${selected===a.key ? "border-[var(--yk-accent)] bg-[var(--yk-accent-3)]/30" : "hover:bg-white"}`}>
                <div className="font-medium">{a.label}</div>
                <input type="radio" name="action" checked={selected===a.key} onChange={()=>setSelected(a.key)} />
              </label>
            ))}
            {/* 応援するアクションを追加 */}
            <label className={`flex items-center justify-between px-4 py-3 rounded-2xl border cursor-pointer transition
              ${selected==="support" ? "border-[var(--yk-accent)] bg-[var(--yk-accent-3)]/30" : "hover:bg-white"}`}>
              <div className="font-medium">応援する</div>
              <input type="radio" name="action" checked={selected==="support"} onChange={()=>setSelected("support")} />
            </label>
          </div>
        </div>

        {/* Day actions */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3 border-l-4 border-[var(--yk-emerald)] pl-2">当日</h3>
          <div className="space-y-2">
            {actions.filter(a => a.phase === "day").map(a=>(
              <label key={a.key}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl border cursor-pointer transition
                  ${selected===a.key ? "border-[var(--yk-emerald)] bg-[var(--yk-emerald)]/20" : "hover:bg-white"}`}>
                <div className="font-medium">{a.label}</div>
                <input type="radio" name="action" checked={selected===a.key} onChange={()=>setSelected(a.key)} />
              </label>
            ))}
          </div>
        </div>

        {/* コメント入力（アクション選択の下） */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">コメント（任意）</label>
          <textarea 
            className="w-full px-4 py-3 rounded-xl border" 
            placeholder="アクション実行時の想いやコメントを書いてください" 
            value={form.comment} 
            onChange={e=>setForm({...form, comment:e.target.value})}
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">コメントは「みんなの声」に表示されます</p>
        </div>

        <div className="mt-6">
          <DreamButton 
            onClick={submit} 
            full
            disabled={isSubmitting || !selected}
          >
            {isSubmitting ? '実行中...' : !selected ? 'アクションを選択してください' : '⭐ アクションを実行して星を届ける'}
          </DreamButton>
          {done && (
            <div className="mt-4 p-4 bg-gradient-to-r from-[var(--yk-accent-3)]/40 to-[var(--yk-emerald)]/40 border border-white rounded-2xl shadow text-center">
              アクションが実行されました！星が増えました。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
