"use client";
import useSWR from "swr";
import { useState } from "react";
import DreamButton from "@/components/leapday/DreamButton";
import { useAuth } from "@/lib/auth-context"; // 認証を有効化
import { supabase } from "@/lib/supabase";
import { commentManager } from "@/lib/comment-manager";

type Action = { key:string; label:string; phase:"before"|"day" };
async function fetchJSON(url:string){ const r=await fetch(url); return r.json(); }

export default function Page(){
  const { user } = useAuth(); // 認証を有効化
  const { data } = useSWR<{ actions:Action[] }>("/api/leapday/actions", fetchJSON);
  const [form, setForm] = useState({ comment:"" });
  const [selected, setSelected] = useState<string>("");
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const actions = data?.actions ?? [];

  console.log('Page render:', { user: !!user, actionsCount: actions.length, selected, isSubmitting });

  async function submit(){
    console.log('Submit called:', { selected, user: !!user, selectedLength: selected?.length });
    if(!selected) {
      alert("アクションを選択してください");
      return;
    }
    if(!user) {
      alert("ログインが必要です。ログインページに移動します。");
      window.location.href = '/';
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
          name: (user as any).user_metadata?.name || 'ユーザー',
          label: 'コメント',
          comment: form.comment.trim(),
          created_at: new Date().toISOString()
        };
        commentManager.addComment(commentItem);
        console.log('アクションコメント追加:', commentItem);
      }

      console.log('アクション実行完了');
      setDone(true);
      setShowSuccess(true);
      setForm({ comment: "" });
      setSelected("");
      
      // 成功アニメーションを表示
      setTimeout(() => {
        setShowSuccess(false);
        // ページを更新して星の数を反映
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('アクション実行エラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'アクションの実行に失敗しました';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* 成功アニメーション */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">アクション完了！</h2>
            <p className="text-gray-600">星が増えました！</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">茨城LeapDay2025</h1>
          <p className="text-xl text-purple-200">みんなで作る星空</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* アクション選択 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">アクションを選ぶ</h2>
            
            {/* Before actions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center">
                <span className="mr-2">🌅</span> 当日以前
              </h3>
              <div className="space-y-3">
                {actions.filter(a => a.phase === "before").map(a=>(
                  <label key={a.key}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-105
                      ${selected===a.key ? "border-yellow-400 bg-yellow-400/20 shadow-lg" : "border-white/30 hover:border-white/50 hover:bg-white/5"}`}>
                    <div className="font-medium text-white">{a.label}</div>
                    <input 
                      type="radio" 
                      name="action" 
                      checked={selected===a.key} 
                      onChange={()=>{
                        console.log('Before action selected:', a.key);
                        setSelected(a.key);
                      }}
                      className="w-5 h-5 text-yellow-400"
                    />
                  </label>
                ))}
                {/* 応援するアクションを追加 */}
                <label className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-105
                  ${selected==="support" ? "border-yellow-400 bg-yellow-400/20 shadow-lg" : "border-white/30 hover:border-white/50 hover:bg-white/5"}`}>
                  <div className="font-medium text-white">応援する</div>
                  <input 
                    type="radio" 
                    name="action" 
                    checked={selected==="support"} 
                    onChange={()=>{
                      console.log('Support action selected');
                      setSelected("support");
                    }}
                    className="w-5 h-5 text-yellow-400"
                  />
                </label>
              </div>
            </div>
            
            {/* Day actions */}
            <div>
              <h3 className="text-lg font-semibold text-pink-300 mb-4 flex items-center">
                <span className="mr-2">🌟</span> 当日
              </h3>
              <div className="space-y-3">
                {actions.filter(a => a.phase === "day").map(a=>(
                  <label key={a.key}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-105
                      ${selected===a.key ? "border-pink-400 bg-pink-400/20 shadow-lg" : "border-white/30 hover:border-white/50 hover:bg-white/5"}`}>
                    <div className="font-medium text-white">{a.label}</div>
                    <input 
                      type="radio" 
                      name="action" 
                      checked={selected===a.key} 
                      onChange={()=>{
                        console.log('Day action selected:', a.key);
                        setSelected(a.key);
                      }}
                      className="w-5 h-5 text-pink-400"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* コメント入力 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-center">みんなの声</h3>
            <textarea
              value={form.comment}
              onChange={(e)=>setForm({...form, comment:e.target.value})}
              placeholder="感想やメッセージを書いてみよう..."
              className="w-full p-4 rounded-2xl border-2 border-white/30 bg-white/10 text-white placeholder-white/60 focus:border-yellow-400 focus:outline-none resize-none"
              rows={3}
            />
            <p className="text-sm text-purple-200 mt-2 text-center">コメントは「みんなの声」に表示されます</p>
          </div>

          {/* 実行ボタン */}
          <div className="text-center">
            <DreamButton
              onClick={submit}
              disabled={!selected || isSubmitting}
              className={`px-8 py-4 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 ${
                isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : selected 
                    ? 'bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 shadow-lg' 
                    : 'bg-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span>
                  実行中...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">✨</span>
                  実行して星を届ける
                </span>
              )}
            </DreamButton>
          </div>
        </div>
      </div>
    </div>
  );
}
