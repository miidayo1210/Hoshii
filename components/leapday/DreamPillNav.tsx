"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function DreamPillNav({ base, name }:{ base:string; name:string }){
  const path = usePathname();
  const items = [
    { href: `${base}/sky`, label: `${name} の星空`, emoji:"🌌" },
    { href: `${base}/support`, label: "応援", emoji:"💖" },
  ];
  return (
    <div className="sticky top-0 z-30 bg-white/70 backdrop-blur">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="relative rounded-full bg-white shadow px-2 py-2 flex gap-2">
          {items.map(it=>{
            const active = path===it.href;
            return (
              <Link key={it.href} href={it.href} className={`relative flex-1 text-center rounded-full px-3 py-2 ${active?"font-semibold text-gray-800":"text-gray-500 hover:text-gray-700"}`}>
                <span className="relative z-10">{it.emoji} {it.label}</span>
                {active && <motion.span layoutId="pill" className="absolute inset-0 rounded-full" style={{background:"linear-gradient(90deg, rgba(179,136,255,.25), rgba(139,227,255,.25))"}} transition={{type:"spring", stiffness:500, damping:35}}/>}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
