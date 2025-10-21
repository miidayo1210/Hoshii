"use client";
import useSWR from "swr";
import { useState } from "react";
import DreamButton from "@/components/leapday/DreamButton";

type Action = { key:string; label:string; phase:"before"|"day" };
async function fetchJSON(url:string){ const r=await fetch(url); return r.json(); }

export default function Page(){
  const { data } = useSWR<{ actions:Action[] }>("/api/leapday/actions", fetchJSON);
  const [form, setForm] = useState({ name:"", email:"", comment:"" });
  const [selected, setSelected] = useState<string>("");
  const [done, setDone] = useState(false);
  const actions = data?.actions ?? [];

  async function submit(){
    if(!selected) return alert("アクションを選択してください");
    const r = await fetch("/api/leapday/star", {
      method: "POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ ...form, actionKey: selected })
    });
    if(r.ok){ setDone(true); }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">応援する</h1>
          <div className="yk-card rounded-2xl p-4 space-y-3">
            <input className="w-full px-4 py-3 rounded-xl border" placeholder="お名前" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <div>
              <input className="w-full px-4 py-3 rounded-xl border" placeholder="メールアドレス" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
              <p className="text-xs text-gray-500 mt-1">公開されません。一回書いたら、その後は書かなくて大丈夫です。</p>
            </div>
            <textarea className="w-full px-4 py-3 rounded-xl border" placeholder="あなたの想いを届けましょう" value={form.comment} onChange={e=>setForm({...form, comment:e.target.value})} />
          </div>
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

                    <div className="mt-6">
                      <DreamButton onClick={submit} full>⭐ 実行して茨城Frogsを応援する</DreamButton>
                      {done && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-[var(--yk-accent-3)]/40 to-[var(--yk-emerald)]/40 border border-white rounded-2xl shadow text-center">
                          あなたの応援が星空の一部となりました。
                        </div>
                      )}
                    </div>
          </div>
    </div>
  );
}
