'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  text: string;
  user?: string;
  ts: number;
}

interface LiveCommentsProps {
  comments: Comment[];
}

export default function LiveComments({ comments }: LiveCommentsProps) {
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        overflowY: 'auto', 
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: '#374151 #0b1220'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px' }}>
        {comments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px 24px',
            color: '#9ca3af'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
            <div style={{ fontSize: 14 }}>まだコメントがありません</div>
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
                style={{
                  padding: '12px',
                  borderRadius: 12,
                  background: '#111827',
                  border: '1px solid #1f2937',
                  fontSize: 14,
                  lineHeight: 1.5,
                  transform: 'translateZ(0)',
                }}
              >
                <div style={{ color: '#e5e7eb', marginBottom: 4 }}>
                  {comment.text}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>
                  {new Date(comment.ts).toLocaleTimeString('ja-JP', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={commentsEndRef} />
      </div>
    </div>
  );
}
