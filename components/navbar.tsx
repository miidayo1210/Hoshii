'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, User, Gift, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/today', label: '今日', icon: Home },
  { href: '/events', label: 'イベント', icon: Calendar },
  { href: '/me', label: 'マイページ', icon: User },
  { href: '/redeem', label: '交換', icon: Gift },
  { href: '/org/demo', label: '組織', icon: Building2 },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-black/5 shadow-card">
      <div className="flex items-center justify-around px-3 py-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2.5 rounded-full transition-colors min-w-[68px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hoshii-green focus-visible:ring-offset-2",
                  isActive
                    ? "bg-hoshii-green2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]"
                    : "hover:bg-hoshii-mint"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Icon 
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-hoshii-ink" : "text-hoshii-ink/60"
                  )}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span 
                  className={cn(
                    "text-[11px] font-medium",
                    isActive ? "text-hoshii-ink" : "text-hoshii-ink/60"
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
