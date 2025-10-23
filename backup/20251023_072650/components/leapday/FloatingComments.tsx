"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { commentManager } from "@/lib/comment-manager";

type Item = { id:string; name:string; label:string; comment:string; created_at:string };

interface FloatingCommentsProps {
  projectId?: string;
}

export default function FloatingComments({ projectId = '8c182150-47c5-4933-b664-c343f5703031' }: FloatingCommentsProps){
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Item[]>([]);

  // グローバルコメント管理の初期化とリスナー設定
  useEffect(() => {
    commentManager.init();
    
    // 初期デモコメント
    const initialComments: Item[] = [
      {
        id: 'demo1',
        name: 'ユーザー1',
        label: 'コメント',
        comment: '素晴らしいプロジェクトですね！',
        created_at: new Date().toISOString()
      },
      {
        id: 'demo2',
        name: 'ユーザー2',
        label: 'コメント',
        comment: '参加できて嬉しいです！',
        created_at: new Date(Date.now() - 60000).toISOString()
      },
      {
        id: 'demo3',
        name: 'ユーザー3',
        label: 'コメント',
        comment: 'みんなで頑張りましょう！',
        created_at: new Date(Date.now() - 120000).toISOString()
      }
    ];

    // グローバルコメントとデモコメントを結合
    const globalComments = commentManager.getComments();
    setComments([...globalComments, ...initialComments]);

    // グローバルコメントの変更を監視
    const unsubscribe = commentManager.addListener((newComments) => {
      setComments([...newComments, ...initialComments]);
    });

    return unsubscribe;
  }, []);

  console.log('FloatingComments 状態:', { commentsCount: comments.length, comments });

  // コメント投稿
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newCommentItem: Item = {
        id: `local_${Date.now()}`,
        name: user.user_metadata?.name || 'ユーザー',
        label: 'コメント',
        comment: newComment.trim(),
        created_at: new Date().toISOString()
      };
      
      // グローバルコメント管理に追加
      commentManager.addComment(newCommentItem);
      setNewComment('');
      console.log('コメント投稿完了:', newCommentItem);
    } catch (error) {
      console.error('コメント投稿エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* コメント投稿フォーム */}
      {user && (
        <div className="mb-4">
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="声を投稿してください..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '投稿中...' : '投稿'}
            </button>
          </form>
        </div>
      )}

      {/* LIVE CHAT風のコメント表示 */}
      <div className="max-h-80 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-2">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            まだ声が投稿されていません
          </div>
        ) : (
          comments.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">{item.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleTimeString('ja-JP', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div className="text-sm text-gray-700">{item.comment}</div>
            </motion.div>
          ))
        )}
      </div>

      {/* スクロールインジケーター */}
      {comments.length > 5 && (
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500">↑ スクロールして過去の声を見る</span>
        </div>
      )}
    </div>
  );
}