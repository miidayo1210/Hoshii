'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getRandomInspirationMessage, type InspirationMessage } from '@/lib/inspiration-messages';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [inspirationMessage, setInspirationMessage] = useState<InspirationMessage | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // ランダムな鼓舞メッセージを取得
    const message = getRandomInspirationMessage();
    setInspirationMessage(message);
    
    // メッセージを少し遅れて表示
    setTimeout(() => setShowMessage(true), 500);
  }, []);

  const handleStartAction = () => {
    router.push('/leapday');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="text-center max-w-md mx-auto">
        {/* メインタイトル */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-3xl font-bold text-hoshii-ink mb-2">
            Hoshii にようこそ！
          </h1>
          <p className="text-hoshii-ink/60 text-lg">
            今日も素敵な一日を始めましょう
          </p>
        </motion.div>

        {/* 鼓舞メッセージ */}
        <AnimatePresence>
          {showMessage && inspirationMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="kawaii-card p-6 bg-white/90 backdrop-blur border border-black/5">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-3xl">{inspirationMessage.emoji}</span>
                  <Sparkles className="h-5 w-5 text-hoshii-green" strokeWidth={1.5} />
                </div>
                <p className="text-hoshii-ink font-medium text-lg leading-relaxed">
                  {inspirationMessage.message}
                </p>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium text-hoshii-green bg-hoshii-mint rounded-full">
                    {inspirationMessage.category === 'daily' && '日常の励まし'}
                    {inspirationMessage.category === 'environment' && '環境への想い'}
                    {inspirationMessage.category === 'community' && 'コミュニティ'}
                    {inspirationMessage.category === 'wellbeing' && 'ウェルビーイング'}
                    {inspirationMessage.category === 'growth' && '成長への道'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* アクションボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button
              onClick={handleStartAction}
              className="w-full bg-hoshii-green hover:bg-hoshii-green/90 text-white font-semibold py-4 px-6 rounded-2xl shadow-card text-lg"
              size="lg"
            >
              <span className="flex items-center justify-center gap-3">
                今日のアクションを実施する
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </span>
            </Button>
          </motion.div>
          
          <p className="text-sm text-hoshii-ink/50 mt-4">
            小さな行動が、大きな変化の始まりです
          </p>
        </motion.div>
      </div>
    </div>
  );
}


