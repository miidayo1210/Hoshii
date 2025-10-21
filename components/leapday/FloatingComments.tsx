"use client";
import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Item = { id:string; name:string; label:string; comment:string; created_at:string };

const fetcher = (u:string)=>fetch(u).then(r=>r.json());

function bubbleColor(i:number){
  const palette = [
    "rgba(179,136,255,0.25)",
    "rgba(139,227,255,0.25)",
    "rgba(255,209,232,0.28)",
    "rgba(154,247,215,0.26)",
  ];
  return palette[i % palette.length];
}

export default function FloatingComments(){
  const { data } = useSWR<{items:Item[]}>("/api/leapday/comments?limit=40", fetcher, { refreshInterval: 6000 });
  const items = data?.items ?? [];

  // distribute bubbles into columns
  const cols = 3;
  const columns = useMemo(()=>{
    const arr: Item[][] = Array.from({length:cols}, ()=>[]);
    items.forEach((it, i)=> arr[i%cols].push(it));
    return arr;
  }, [items]);

  // slow drift baseline
  const [key,setKey] = useState(0);
  useEffect(()=>{ const t = setInterval(()=>setKey(k=>k+1), 15000); return ()=>clearInterval(t); },[]);

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {columns.map((col, ci)=>(
          <div key={ci} className="relative space-y-3">
            {col.map((it, i)=>(
              <motion.div
                key={it.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: (i%6)*0.08, type:"spring", stiffness: 220, damping: 24 }}
                className="rounded-2xl p-3 backdrop-blur bg-white/70 border border-white/60 shadow"
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}
              >
                <div className="text-[11px] text-gray-500">{it.name} · {new Date(it.created_at).toLocaleString()}</div>
                <div className="text-[12px] text-emerald-700 mb-1">「{it.label}」</div>
                <div className="text-[14px] text-gray-800">{it.comment}</div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* soft floating halos behind (subtle, dream-like) */}
      <div className="pointer-events-none absolute inset-x-0 -z-10 h-40 md:h-48">
        {[0,1,2].map(i=>(
          <motion.div
            key={i} className="absolute rounded-full blur-3xl"
            style={{ background: bubbleColor(i), width: 220, height: 220, left: `${10 + i*35}%`, top: -40 }}
            animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 8 + i*2, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}


