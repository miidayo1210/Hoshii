'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Home, User, Search, Bell, LogOut, Star } from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* デスクトップナビゲーション */}
      <nav className="hidden md:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-white/20">
          <div className="flex items-center space-x-6">
            <Link 
              href="/home" 
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">ホーム</span>
            </Link>
            
            <Link 
              href="/profile" 
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <User className="h-5 w-5" />
              <span className="font-medium">マイページ</span>
            </Link>
            
            <Link 
              href="/search" 
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
              <span className="font-medium">検索</span>
            </Link>
            
            <Link 
              href="/notifications" 
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Bell className="h-5 w-5" />
              <span className="font-medium">通知</span>
            </Link>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">ログアウト</span>
            </button>
          </div>
        </div>
      </nav>

      {/* モバイルナビゲーション */}
      <nav className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg border border-white/20">
          <div className="flex items-center space-x-4">
            <Link 
              href="/home" 
              className="flex flex-col items-center space-y-1 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">ホーム</span>
            </Link>
            
            <Link 
              href="/profile" 
              className="flex flex-col items-center space-y-1 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">マイ</span>
            </Link>
            
            <Link 
              href="/search" 
              className="flex flex-col items-center space-y-1 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
              <span className="text-xs font-medium">検索</span>
            </Link>
            
            <Link 
              href="/notifications" 
              className="flex flex-col items-center space-y-1 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Bell className="h-5 w-5" />
              <span className="text-xs font-medium">通知</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ユーザー情報表示 */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/90 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg border border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{user.name || user.email}</span>
          </div>
        </div>
      </div>
    </>
  );
}
