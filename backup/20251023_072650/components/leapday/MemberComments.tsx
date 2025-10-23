'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  memberName: string;
}

interface MemberCommentsProps {
  memberName: string;
}

export default function MemberComments({ memberName }: MemberCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = () => {
      try {
        // ローカルストレージからコメントを取得
        const storedComments = localStorage.getItem(`member-comments-${memberName}`);
        if (storedComments) {
          const parsedComments = JSON.parse(storedComments);
          setComments(parsedComments.sort((a: Comment, b: Comment) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ));
        } else {
          // 初期データを設定
          const initialComments = [
            {
              id: `${memberName}-1`,
              name: "応援者A",
              message: `${memberName}さん、応援しています！`,
              timestamp: new Date().toISOString(),
              memberName: memberName
            },
            {
              id: `${memberName}-2`,
              name: "応援者B",
              message: `${memberName}さんの頑張りを見て感動しました！`,
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              memberName: memberName
            }
          ];
          localStorage.setItem(`member-comments-${memberName}`, JSON.stringify(initialComments));
          setComments(initialComments);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [memberName]);

  if (loading) {
    return (
      <div className="relative w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="relative space-y-3">
            <div className="animate-pulse bg-gray-200 rounded-lg h-20"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-16"></div>
          </div>
          <div className="relative space-y-3">
            <div className="animate-pulse bg-gray-200 rounded-lg h-18"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-14"></div>
          </div>
          <div className="relative space-y-3">
            <div className="animate-pulse bg-gray-200 rounded-lg h-16"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {[0, 1, 2].map((columnIndex) => (
          <div key={columnIndex} className="relative space-y-3">
            {comments
              .filter((_, index) => index % 3 === columnIndex)
              .map((comment) => (
                <div
                  key={comment.id}
                  className="yk-card p-4 bg-white/80 backdrop-blur border border-black/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {comment.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-800">
                          {comment.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-x-0 -z-10 h-40 md:h-48">
        <div className="absolute rounded-full blur-3xl" style={{
          background: 'rgba(179,136,255,0.25)',
          width: '220px',
          height: '220px',
          left: '10%',
          top: '-40px'
        }}></div>
        <div className="absolute rounded-full blur-3xl" style={{
          background: 'rgba(139,227,255,0.25)',
          width: '220px',
          height: '220px',
          left: '45%',
          top: '-40px'
        }}></div>
        <div className="absolute rounded-full blur-3xl" style={{
          background: 'rgba(255,209,232,0.28)',
          width: '220px',
          height: '220px',
          left: '80%',
          top: '-40px'
        }}></div>
      </div>
    </div>
  );
}