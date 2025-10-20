'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Search, 
  Plus, 
  Bell, 
  User,
  Heart,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
];

export function CommunityNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex flex-col items-center space-y-1 h-auto py-2 px-3",
                    isActive
                      ? "text-community-purple bg-community-purple/10"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive && "text-community-purple"
                  )} />
                  <span className="text-xs font-medium">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// Desktop sidebar navigation
export function CommunitySidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hoshii</h1>
          <p className="text-sm text-gray-600">コミュニティ</p>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start space-x-3",
                    isActive
                      ? "text-community-purple bg-community-purple/10"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
        
        {/* User section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link href="/community/profile/me">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start space-x-3",
                pathname.startsWith('/community/profile')
                  ? "text-community-purple bg-community-purple/10"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <User className="w-5 h-5" />
              <span>プロフィール</span>
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}

// Tab switcher for home page
interface TabSwitcherProps {
  activeTab: 'personal' | 'community';
  onTabChange: (tab: 'personal' | 'community') => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
      <button
        onClick={() => onTabChange('personal')}
        className={cn(
          "flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors",
          activeTab === 'personal'
            ? "bg-white text-community-purple shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <Heart className="w-4 h-4" />
        <span>個人</span>
      </button>
      <button
        onClick={() => onTabChange('community')}
        className={cn(
          "flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors",
          activeTab === 'community'
            ? "bg-white text-community-purple shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <Users className="w-4 h-4" />
        <span>コミュニティ</span>
      </button>
    </div>
  );
}
