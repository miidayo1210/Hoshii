'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { User, LogOut, LogIn, Home, Bell, Calendar, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { SearchTab } from '@/components/SearchTab';

interface Notification {
  id: string;
  type: 'project_ended' | 'project_started' | 'support_received';
  title: string;
  message: string;
  project_id?: string;
  project_title?: string;
  created_at: string;
  read: boolean;
}

export function AuthButton() {
  const { user, signOut, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // 通知を取得
  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;
      
      setNotificationLoading(true);
      try {
        // 参加しているプロジェクトの終了通知を生成
        const { data: projects } = await supabase
          .from('project_participants')
          .select(`
            project_id,
            projects!inner(
              id,
              title,
              end_date,
              status
            )
          `)
          .eq('user_id', user.id);

        const today = new Date().toISOString().split('T')[0];
        const notifications: Notification[] = [];

        if (projects) {
          projects.forEach((participation: any) => {
            const project = participation.projects;
            const endDate = project.end_date;
            
            // プロジェクトが終了した場合の通知
            if (endDate && endDate <= today && project.status !== 'completed') {
              notifications.push({
                id: `end_${project.id}`,
                type: 'project_ended',
                title: 'プロジェクトが終了しました',
                message: `「${project.title}」の期間が終了しました`,
                project_id: project.id,
                project_title: project.title,
                created_at: endDate,
                read: false
              });
            }
          });
        }

        // 作成日時でソート（新しい順）
        notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setNotifications(notifications.slice(0, 10)); // 最新10件まで
      } catch (error) {
        console.error('通知取得エラー:', error);
      } finally {
        setNotificationLoading(false);
      }
    }

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {/* ホームボタン */}
        <Link href="/home">
          <motion.div className="relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button className="w-9 h-9 rounded-full glass text-hoshii-ink flex items-center justify-center shadow-soft hover:shadow-card transition-shadow duration-200 puyo">
              <Home className="h-4 w-4" />
            </button>
            <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-white/90 backdrop-blur px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-soft whitespace-nowrap">ホーム</span>
          </motion.div>
        </Link>

        {/* 検索ボタン */}
        <SearchTab />

        {/* 通知ボタン */}
        <div className="relative" onMouseLeave={() => setIsNotificationOpen(false)}>
          <motion.div className="group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
              className="w-9 h-9 rounded-full glass text-hoshii-ink flex items-center justify-center shadow-soft hover:shadow-card transition-shadow duration-200 puyo relative"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>
            <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-white/90 backdrop-blur px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-soft whitespace-nowrap">通知</span>
          </motion.div>

          {/* 通知ドロップダウン */}
          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    通知
                  </h3>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {notificationLoading ? (
                    <div className="px-4 py-3 text-center text-sm text-gray-500">
                      読み込み中...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-3 text-center text-sm text-gray-500">
                      現在の通知はありません
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {notification.type === 'project_ended' && (
                              <Calendar className="h-4 w-4 text-orange-500" />
                            )}
                            {notification.type === 'project_started' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {notification.type === 'support_received' && (
                              <Bell className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.created_at).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-xs text-gray-500 hover:text-gray-700">
                      すべて既読にする
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ユーザーメニュー */}
        <div className="relative" onMouseLeave={() => setIsDropdownOpen(false)}>
          <motion.div className="relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-9 h-9 rounded-full glass text-hoshii-ink flex items-center justify-center shadow-soft hover:shadow-card transition-shadow duration-200 puyo">
              <User className="h-4 w-4" />
            </button>
            <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-white/90 backdrop-blur px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-soft whitespace-nowrap">マイページ</span>
          </motion.div>

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">ログイン中</p>
              </div>
              <Link href="/me">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  マイページ
                </button>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                ログアウト
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        // ログインページに遷移
        window.location.href = '/';
      }}
      className="w-8 h-8 rounded-full bg-gradient-to-br from-hoshii-green to-hoshii-green2 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow duration-200"
      title="ログイン"
    >
      <LogIn className="h-4 w-4" />
    </motion.button>
  );
}