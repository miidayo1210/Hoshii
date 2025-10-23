"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FloatingInfoButton() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: 1 
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Link
          href="https://www.ibarakifrogs.com/ibarakileapday2025"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block"
        >
          {/* 外側のグロー効果 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] opacity-50 blur-lg group-hover:opacity-70 transition-opacity duration-300" />
          
          {/* メインボタン */}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#06B6D4] to-[#EC4899] shadow-[0_15px_40px_rgba(139,92,246,0.5)] group-hover:shadow-[0_20px_50px_rgba(139,92,246,0.7)] transition-all duration-300 flex items-center justify-center overflow-hidden">
            
            {/* 内側の光る効果 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/25 to-white/50" />
            
            {/* テキスト */}
            <div className="relative z-10 text-center px-2">
              <div className="text-[19px] font-bold text-white leading-tight">
                茨城<br />
                LeapDay
              </div>
            </div>
            
            {/* キラキラ効果 */}
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-white rounded-full opacity-90 animate-pulse" />
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white rounded-full opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-5 left-1.5 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          {/* ホバー時の波紋効果 */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}
