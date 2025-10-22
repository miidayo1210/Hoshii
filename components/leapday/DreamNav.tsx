"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const items = [
  { href: "/leapday", label: "みんなの景色", emoji:"🌌" },
  { href: "/leapday/support", label: "参加する", emoji:"💖" },
];

export default function DreamNav(){
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/50 bg-white/70">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="relative yk-card rounded-full px-2 py-2 flex items-center gap-2">
          {items.map((it)=> {
            const active = path === it.href;
            return (
              <Link key={it.href} href={it.href}
                className={`relative flex-1 text-center rounded-full px-4 py-2 transition
                ${active ? "text-[var(--yk-ink)] font-bold" : "text-gray-500 hover:text-[var(--yk-ink)]"}`}>
                <span className="relative z-10 flex items-center justify-center gap-1">
                  <span className="text-lg">{it.emoji}</span>
                  <span className="hidden sm:inline">{it.label}</span>
                </span>
                {active && (
                  <motion.span
                    layoutId="dreamnav"
                    className="absolute inset-0 rounded-full"
                    style={{ background:"linear-gradient(90deg, rgba(179,136,255,0.25), rgba(139,227,255,0.25))" }}
                    transition={{ type:"spring", stiffness:500, damping:35 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}




