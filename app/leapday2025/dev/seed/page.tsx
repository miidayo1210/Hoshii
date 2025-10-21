"use client";
import { useState } from "react";
export default function Page(){
  const [res,setRes]=useState<any>(null);
  async function run(){ const r=await fetch("/leapday2025/dev/seed/run",{method:"POST"}); setRes(await r.json()); }
  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-xl font-semibold">IBARAKI FROGS 7期（2025）メンバーSeed</h1>
      <button onClick={run} className="px-4 py-2 rounded-xl bg-emerald-600 text-white">投入する</button>
      {res && <pre className="bg-gray-50 p-4 rounded-xl text-sm overflow-auto">{JSON.stringify(res,null,2)}</pre>}
    </div>
  );
}


