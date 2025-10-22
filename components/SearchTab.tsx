'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  url_slug: string;
  creator_name: string;
  total_supports: number;
  participants_count: number;
  start_date: string;
  end_date: string;
}

export function SearchTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 検索実行
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from('projects_stats_view')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('検索エラー:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      console.error('検索エラー:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Enterキーで検索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 検索結果をクリア
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <div className="relative">
      {/* 検索ボタン */}
      <motion.div className="group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 rounded-full glass text-hoshii-ink flex items-center justify-center shadow-soft hover:shadow-card transition-shadow duration-200 puyo"
        >
          <Search className="h-4 w-4" />
        </button>
        <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-white/90 backdrop-blur px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-soft whitespace-nowrap">検索</span>
      </motion.div>

      {/* 検索ドロップダウン */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 py-2 z-50"
          >
            {/* 検索ヘッダー */}
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">プロジェクト検索</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-auto w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            </div>

            {/* 検索入力 */}
            <div className="px-4 py-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="タイトル、タグ、場所で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-hoshii-green hover:bg-hoshii-green/90 text-white px-4"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                >
                  クリア
                </button>
              )}
            </div>

            {/* 検索結果 */}
            <div className="max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="px-4 py-3 text-center text-sm text-gray-500">
                  検索中...
                </div>
              ) : hasSearched ? (
                searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">
                    「{searchQuery}」に一致するプロジェクトが見つかりませんでした
                  </div>
                ) : (
                  <div className="px-2">
                    {searchResults.map((project) => (
                      <Card key={project.id} className="mb-2 border border-gray-100 hover:border-hoshii-green/50 transition-colors">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-hoshii-ink truncate">
                                {project.title}
                              </h4>
                              <p className="text-sm text-hoshii-ink/70 mt-1 line-clamp-2">
                                {project.description}
                              </p>
                              
                              {/* タグ表示 */}
                              {project.category && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.category.split(',').map((tag, index) => (
                                    <span key={index} className="px-2 py-0.5 bg-hoshii-mint text-hoshii-green text-xs rounded-full">
                                      {tag.trim()}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {/* 場所と期間 */}
                              <div className="flex items-center gap-4 mt-2 text-xs text-hoshii-ink/60">
                                {project.location && (
                                  <span>📍 {project.location}</span>
                                )}
                                <span>📅 {new Date(project.start_date).toLocaleDateString('ja-JP')} - {new Date(project.end_date).toLocaleDateString('ja-JP')}</span>
                              </div>
                              
                              {/* 統計 */}
                              <div className="flex items-center gap-4 mt-2 text-xs text-hoshii-ink/60">
                                <span>⭐ {project.total_supports}</span>
                                <span>👥 {project.participants_count}人</span>
                                <span>👤 {project.creator_name}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* プロジェクトページへのリンク */}
                          <div className="mt-3">
                            <a
                              href={project.url_slug === 'leapday' ? '/leapday' : `/projects/${project.url_slug}`}
                              className="text-sm text-hoshii-green hover:text-hoshii-green/80 font-medium"
                            >
                              プロジェクトを見る →
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              ) : (
                <div className="px-4 py-3 text-center text-sm text-gray-500">
                  プロジェクトを検索してください
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}