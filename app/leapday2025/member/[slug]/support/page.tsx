"use client";
import useSWR from "swr";
import { useState } from "react";
import DreamButton from "@/components/leapday/DreamButton";
import MemberStarSky from "@/components/member/MemberStarSky";
import { SkyId } from "@/lib/types/sky";
import { MEMBER_ACTIONS, MEMBER_ACTION_EMOJIS, MEMBER_UI } from "@/lib/sky/member";

const fetcher = (u:string)=>fetch(u).then(r=>r.json());

export default function Page({ params }:{ params:{ slug:string } }){
  const skyId: SkyId = `member:${params.slug}`;
  
  // 統一APIを使用
  const { data: stats, mutate: mutateStats } = useSWR<{ok: boolean, total: number, totalActions: number}>(`/api/sky/stats?skyId=${skyId}`, fetcher, { refreshInterval: MEMBER_UI.pollMs });
  
  const [form,setForm]=useState({ name:"", email:"", comment:"", action:"" });
  const [done,setDone]=useState(false);
  
  async function submit(){
    const r = await fetch("/api/sky/participate",{ 
      method:"POST", 
      headers:{ "Content-Type":"application/json" }, 
      body: JSON.stringify({ 
        skyId,
        actionKey: form.action,
        name: form.name,
        email: form.email,
        comment: form.comment
      }) 
    });
    if(r.ok){ 
      setDone(true); 
      mutateStats(); 
      setForm({ name:"", email:"", comment:"", action:"" });
    }
  }
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-64 rounded-2xl overflow-hidden">
        <MemberStarSky supportCount={stats?.total ?? 0} className="h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              応援ページ
            </h1>
            <p className="text-white/80">
              あなたの応援が星空の星になります
            </p>
          </div>
        </div>
      </div>

      {/* Support Form */}
      <div className="yk-card rounded-2xl p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-[var(--yk-ink)] mb-6 text-center">
          💖 応援メッセージを送る
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--yk-ink)] mb-2">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--yk-accent)] focus:outline-none"
              placeholder="お名前を入力"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--yk-ink)] mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--yk-accent)] focus:outline-none"
              placeholder="メールアドレス（一度だけの登録でOK）"
            />
            <p className="text-xs text-gray-500 mt-1">
              メールアドレスは一度だけの登録でOKです
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--yk-ink)] mb-2">
              応援アクション <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {MEMBER_ACTIONS.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => setForm({ ...form, action: action.key })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.action === action.key
                      ? "border-[var(--yk-accent)] bg-[var(--yk-accent)]/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{MEMBER_ACTION_EMOJIS[action.key]}</span>
                    <span className="text-sm font-medium">{action.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--yk-ink)] mb-2">
              応援コメント
            </label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--yk-accent)] focus:outline-none resize-none"
              rows={4}
              placeholder="応援のメッセージを入力してください（任意）"
            />
          </div>

          {done && (
            <div className="text-sm p-4 rounded-xl bg-green-50 text-green-600 border border-green-200">
              星が灯りました ✨ 応援ありがとうございます！
            </div>
          )}

          <div className="text-center">
            <DreamButton
              onClick={submit}
              disabled={!form.name.trim() || !form.action}
              className="px-8 py-4 text-lg"
            >
              🌟 応援を送る
            </DreamButton>
          </div>
        </div>

        {/* Current Count */}
        {stats && stats.total > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--yk-accent)] to-[var(--yk-accent-2)] text-white px-6 py-3 rounded-full text-lg font-medium shadow-lg">
              <span>⭐</span>
              <span>現在 {stats.total} 星</span>
            </div>
          </div>
        )}
      </div>

      {/* Back to Sky */}
      <div className="text-center">
        <DreamButton as="a" href={`/leapday2025/member/${params.slug}/sky`} className="inline-block">
          ← 星空ページに戻る
        </DreamButton>
      </div>
    </div>
  );
}
