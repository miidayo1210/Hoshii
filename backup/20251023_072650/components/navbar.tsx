'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Home, Search, Bell, User, LogOut } from 'lucide-react';

export function NavBar() {
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* 右上の可愛いナビゲーション */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        {/* ホーム */}
        <Link href="/home">
          <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/90 hover:scale-110 shadow-lg border border-white/50">
            <Home className="w-6 h-6 text-gray-700" />
          </div>
        </Link>

        {/* 検索 */}
        <div className="relative">
          <div 
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/90 hover:scale-110 shadow-lg border border-white/50"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="w-6 h-6 text-gray-700" />
          </div>
          
          {/* 検索ドロップダウン */}
          {showSearch && (
            <div className="absolute top-14 right-0 w-80 bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800 mb-3">プロジェクトを検索</h3>
                <input
                  type="text"
                  placeholder="プロジェクト名やタグで検索..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  {['環境', '教育', '福祉', '技術', 'アート', 'スポーツ'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm cursor-pointer hover:bg-purple-200 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 通知 */}
        <div className="relative">
          <div 
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/90 hover:scale-110 shadow-lg border border-white/50"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-6 h-6 text-gray-700" />
            {/* 通知バッジ */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
              3
            </div>
          </div>
          
          {/* 通知ドロップダウン */}
          {showNotifications && (
            <div className="absolute top-14 right-0 w-80 bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800 mb-3">通知</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 rounded-xl border-l-4 border-green-400">
                    <p className="text-sm text-gray-700">新しいプロジェクト「環境保護活動」に参加しました！</p>
                    <p className="text-xs text-gray-500 mt-1">2時間前</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                    <p className="text-sm text-gray-700">プロジェクト「教育支援」にいいねがつきました</p>
                    <p className="text-xs text-gray-500 mt-1">5時間前</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border-l-4 border-purple-400">
                    <p className="text-sm text-gray-700">新しいメッセージが届きました</p>
                    <p className="text-xs text-gray-500 mt-1">1日前</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* マイページ */}
        <div className="relative">
          <div 
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/90 hover:scale-110 shadow-lg border border-white/50"
            onClick={() => setShowMyPage(!showMyPage)}
          >
            <User className="w-6 h-6 text-gray-700" />
          </div>
          
          {/* マイページドロップダウン */}
          {showMyPage && (
            <div className="absolute top-14 right-0 w-80 bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xl font-bold">
                    {(user.nickname || user.email).charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{user.nickname || user.email}</h3>
                  {user.nickname && (
                    <p className="text-sm text-gray-500">{user.email}</p>
                  )}
                  {(user.ageGroup || user.gender) && (
                    <div className="flex gap-2 justify-center mt-2">
                      {user.ageGroup && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          🎂 {user.ageGroup}
                        </span>
                      )}
                      {user.gender && (
                        <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                          👥 {user.gender}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">参加中のプロジェクト</h4>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">• 茨城LeapDay2025</div>
                      <div className="text-sm text-gray-600">• 環境保護活動</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">いいねしたプロジェクト</h4>
                    <div className="text-sm text-gray-600">3件</div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">作成したプロジェクト</h4>
                    <div className="text-sm text-gray-600">1件</div>
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ログアウト</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* オーバーレイ（ドロップダウン外をクリックで閉じる） */}
      {(showSearch || showNotifications || showMyPage) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowSearch(false);
            setShowNotifications(false);
            setShowMyPage(false);
          }}
        />
      )}
    </>
  );
}