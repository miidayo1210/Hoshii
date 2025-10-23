'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Search, 
  Plus, 
  Bell, 
  User,
  Users,
  Star
} from 'lucide-react';

const navigationItems = [
  {
    name: 'ホーム',
    href: '/community/home',
    icon: Home,
  },
  {
    name: '発見',
    href: '/community/discover',
    icon: Search,
  },
  {
    name: '作成',
    href: '/community/create',
    icon: Plus,
  },
  {
    name: '通知',
    href: '/community/notifications',
    icon: Bell,
  },
  {
    name: 'マイページ',
    href: '/community/profile/me',
    icon: User,
  },
  {
    name: '開発ツール',
    href: '/community/dev/import',
    icon: Star,
  },
];

export function CommunitySidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
      <div className="p-6">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hoshii</h1>
          <p className="text-sm text-gray-600">コミュニティ</p>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-r-2 border-emerald-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        
        {/* Quick Stats */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">今月の活動</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">作成したアクション</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">参加したイベント</span>
              <span className="font-medium">7</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">獲得した星</span>
              <span className="font-medium">42</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Mobile bottom navigation (for smaller screens)
export function CommunityMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors",
                    isActive
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
