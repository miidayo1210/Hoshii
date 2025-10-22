"use client";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  full?: boolean;
  as?: "button" | "a";
  href?: string;
}>;
export default function DreamButton({ children, onClick, className="", disabled, icon, full, as="button", href }: Props){
  const Comp:any = as;
  return (
    <motion.div
      className={`inline-block ${full ? "w-full" : ""}`}
      whileTap={{ scaleX: 0.96, scaleY: 0.9 }}
      transition={{ type:"spring", stiffness:600, damping:20 }}>
      <Comp
        href={href}
        onClick={onClick}
        disabled={disabled}
        className={`relative rounded-full px-5 py-3 text-[15px] font-semibold text-white
          bg-gradient-to-r from-[var(--yk-accent)] to-[var(--yk-accent-2)]
          shadow-[0_10px_20px_rgba(179,136,255,0.3)]
          hover:brightness-110 active:brightness-95
          ${full ? "w-full text-center" : ""}
          ${disabled ? "opacity-60 pointer-events-none" : ""}
          ${className}`}>
        <span className="absolute inset-0 rounded-full"
          style={{ boxShadow:"inset 0 -6px 12px rgba(0,0,0,0.08)" }}/>
        <span className="relative flex items-center justify-center gap-2">
          {icon}{children}
        </span>
      </Comp>
    </motion.div>
  );
}





