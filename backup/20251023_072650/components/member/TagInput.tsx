"use client";
import { useState } from "react";
export default function TagInput({ value, onChange, placeholder }:{
  value: string[]; onChange:(v:string[])=>void; placeholder?:string;
}){
  const [text, setText] = useState("");
  function add(){
    const t = text.trim();
    if(!t) return;
    if(!value.includes(t)) onChange([...value, t]);
    setText("");
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder={placeholder || "タグを入力してEnter"} className="flex-1 px-3 py-2 rounded-xl border" onKeyDown={(e)=>{ if(e.key==="Enter"){ e.preventDefault(); add(); }}} />
        <button onClick={add} className="px-3 py-2 rounded-xl bg-emerald-600 text-white">追加</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((t)=>(
          <span key={t} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm">
            {t}
            <button onClick={()=>onChange(value.filter(v=>v!==t))} className="ml-2 text-emerald-700/60">×</button>
          </span>
        ))}
      </div>
    </div>
  );
}
