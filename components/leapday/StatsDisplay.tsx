'use client';

import { useState, useEffect } from 'react';

interface StatsDisplayProps {
  type?: 'badge' | 'counter';
}

export default function StatsDisplay({ type = 'counter' }: StatsDisplayProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // ローカルストレージから統計を取得
    const storedCount = localStorage.getItem('leapday-stats');
    if (storedCount) {
      setCount(parseInt(storedCount));
    } else {
      // 初期値を設定
      const initialCount = 42;
      localStorage.setItem('leapday-stats', initialCount.toString());
      setCount(initialCount);
    }
  }, []);

  if (type === 'badge') {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 text-center">
        <div className="text-4xl font-bold mb-2">{count}</div>
        <div className="text-sm opacity-90">応援数</div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-6xl font-bold text-purple-600 mb-2">{count}</div>
      <div className="text-lg text-gray-600">現在の応援数</div>
    </div>
  );
}
