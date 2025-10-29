'use client';

import React, { useEffect, useState } from 'react';
import HoshiiLandscape from '@/components/HoshiiLandscape';
import LiveComments from '@/components/LiveComments';

type Comment = { id: string; text: string; user?: string; ts: number };

export default function Page() {
  const [actionCount, setActionCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);

  // 既存のローカル保存読み込み（任意）
  useEffect(() => {
    const rawStats = localStorage.getItem('hoshii-demo-stats');
    if (rawStats) {
      try {
        const parsed = JSON.parse(rawStats);
        setActionCount(parsed.actionCount ?? 0);
        setComments(
          (parsed.comments ?? []).map((t: any) => ({
            id: t.id || crypto.randomUUID(),
            text: t.text || '',
            ts: Date.now(),
          }))
        );
      } catch {}
    }
  }, []);

  // 保存（任意）
  useEffect(() => {
    localStorage.setItem(
      'hoshii-demo-stats',
      JSON.stringify({
        actionCount,
        comments: comments.map((c) => ({ id: c.id, text: c.text })),
      })
    );
  }, [actionCount, comments]);

  // デモ用：擬似SSEで自動コメント/アクション
  useEffect(() => {
    const samples = [
      '最高でした！',
      '参加しました🌟',
      'ネイチャーポジティブ！',
      'ゴミ拾いしたよ',
      '通勤を自転車に切り替えた🚲',
      'マイボトル持参',
    ];
    const timer = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.65) {
        setComments((prev) => [
          ...prev,
          { id: crypto.randomUUID(), text: samples[Math.floor(Math.random() * samples.length)], ts: Date.now() },
        ]);
      } else {
        setActionCount((v) => v + 1);
      }
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // 右欄フォームから投稿
  const handlePost = (text: string) => {
    if (!text.trim()) return;
    setComments((prev) => [...prev, { id: crypto.randomUUID(), text: text.trim(), ts: Date.now() }]);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        background: '#020617',
      }}
    >
      <section style={{ position: 'relative' }}>
        {/* 左：大画面 three.js */}
        <HoshiiLandscape actionCount={actionCount} comments={comments} onStarAdded={() => {}} />

        {/* 左下：任意ボタン */}
        <div style={{ position: 'absolute', left: 16, bottom: 16, display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActionCount((v) => v + 1)}
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid #2b2f36',
              background: '#0b1220',
              color: '#e5e7eb',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#6b7280';
              e.currentTarget.style.background = '#111827';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#2b2f36';
              e.currentTarget.style.background = '#0b1220';
            }}
            aria-label="アクションする"
          >
            🌟 アクションする（星を増やす）
          </button>
        </div>
      </section>

      {/* 右：ライブコメント */}
      <aside
        style={{
          borderLeft: '1px solid #0f172a',
          background: '#0b1220',
          color: '#e5e7eb',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
        }}
      >
        <div style={{ padding: '14px 14px 8px', borderBottom: '1px solid #111827' }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Liveコメント</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>⭐ 合計アクション: {actionCount}</div>
        </div>

        <LiveComments comments={comments} />

        <CommentForm onPost={handlePost} />
      </aside>
    </div>
  );
}

function CommentForm({ onPost }: { onPost: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onPost(text);
        setText('');
      }}
      style={{ display: 'grid', gap: 8, padding: 14, borderTop: '1px solid #111827' }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="コメントを入力…"
        style={{
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid #1f2937',
          background: '#0b1220',
          color: '#e5e7eb',
          outline: 'none',
          fontSize: 14,
        }}
      />
      <button
        type="submit"
        style={{
          padding: '8px 12px',
          borderRadius: 10,
          border: '1px solid #2b2f36',
          background: '#0b1220',
          color: '#e5e7eb',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 500,
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#6b7280';
          e.currentTarget.style.background = '#111827';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#2b2f36';
          e.currentTarget.style.background = '#0b1220';
        }}
      >
        送信
      </button>
    </form>
  );
}
