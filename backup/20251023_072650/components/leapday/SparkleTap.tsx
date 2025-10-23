"use client";
import { useEffect, useRef } from "react";
export default function SparkleTap(){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el = ref.current!;
    function burst(e: MouseEvent){
      const n = 14;
      const base = document.createElement("div");
      base.style.position="absolute"; base.style.left = e.clientX+"px"; base.style.top = e.clientY+"px";
      document.body.appendChild(base);
      for(let i=0;i<n;i++){
        const s = document.createElement("span");
        s.textContent = "✦";
        s.style.position="absolute"; s.style.color="#fff";
        s.style.textShadow="0 0 10px rgba(179,136,255,0.8)";
        base.appendChild(s);
        const ang = Math.random()*Math.PI*2;
        const dist = 30 + Math.random()*50;
        const x = Math.cos(ang)*dist, y = Math.sin(ang)*dist;
        s.animate([{ transform:"translate(0,0)", opacity:1 },{ transform:`translate(${x}px,${y}px)`, opacity:0 }], { duration: 700+Math.random()*300, easing:"cubic-bezier(.2,.7,.2,1)" })
          .onfinish = ()=> s.remove();
      }
      setTimeout(()=>base.remove(), 900);
    }
    document.addEventListener("click", burst);
    return ()=>document.removeEventListener("click", burst);
  },[]);
  return <div ref={ref} className="fixed inset-0 pointer-events-none z-[60]" />;
}





