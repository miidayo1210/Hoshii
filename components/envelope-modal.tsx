'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getThanksMessage, type ThanksFrom } from '@/lib/thanks-templates';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  from: ThanksFrom;
  stampsEarned: number;
  domain?: string;
}

export function EnvelopeModal({ open, onOpenChange, from, stampsEarned, domain }: EnvelopeModalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const message = getThanksMessage(from, domain);

  useEffect(() => {
    if (open) {
      // Start envelope animation
      setTimeout(() => setIsOpening(true), 300);
      // Show content after envelope opens
      setTimeout(() => setShowContent(true), 1200);
    } else {
      setIsOpening(false);
      setShowContent(false);
    }
  }, [open]);

  const getFromLabel = () => {
    switch (from) {
      case 'society':
        return '社会より';
      case 'environment':
        return '地球より';
      case 'peer':
        return 'みんなより';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden bg-white/95 backdrop-blur rounded-3xl border-0 shadow-card">
        <div className="flex flex-col items-center gap-4 py-8 px-4">
          {/* Envelope Animation */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Envelope Body with paper texture */}
            <motion.div
              className="absolute w-40 h-28 rounded-2xl transition-all duration-700 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #fffdf8 0%, #f8f8f6 100%)',
                boxShadow: isOpening 
                  ? '0 0 0 10px rgba(169,220,194,0.15), 0 12px 28px rgba(0,0,0,0.08)'
                  : '0 12px 28px rgba(0,0,0,0.08)',
                border: '1.5px solid rgba(169,220,194,0.3)',
              }}
              animate={{
                scale: isOpening ? 1.05 : 1,
              }}
              transition={{ duration: 0.7 }}
            >
              {/* Paper grain texture */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '80px 80px',
                }}
              />
              
              {/* Envelope Flap */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full origin-top"
                style={{
                  clipPath: 'polygon(0 0, 50% 40%, 100% 0)',
                  background: 'linear-gradient(to bottom, #f8f8f6, #fffdf8)',
                  borderBottom: '1.5px solid rgba(169,220,194,0.3)',
                }}
                animate={{
                  translateY: isOpening ? -80 : 0,
                  rotateX: isOpening ? -25 : 0,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              
              {/* Letter Inside */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-32 bg-white rounded-xl shadow-card border border-hoshii-green/20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
                }}
                animate={{
                  top: isOpening ? 0 : 32,
                  opacity: isOpening ? 1 : 0,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="p-3 text-center">
                  <Sparkles className="h-6 w-6 mx-auto mb-2 text-hoshii-green" strokeWidth={1.5} />
                  <p className="text-xs font-medium text-hoshii-ink">
                    {getFromLabel()}
                  </p>
                </div>
              </motion.div>
              
              {/* Decorative Stamp */}
              <div className="absolute bottom-2 right-2">
                <motion.div
                  animate={isOpening ? { rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-2xl"
                >
                  💌
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Content that appears after animation */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="text-center space-y-4 px-4">
                  <h2 className="text-2xl font-bold text-hoshii-ink">
                    {getFromLabel()}感謝のメッセージ
                  </h2>
                  <p className="text-[15.5px] text-hoshii-ink/80 leading-relaxed">
                    {message}
                  </p>
                </div>

                <div className="text-center py-6">
                  <p className="text-sm text-hoshii-ink/60">獲得しました</p>
                  <motion.div 
                    className="flex items-center justify-center gap-2 my-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  >
                    <span className="text-5xl">⭐</span>
                    <span className="text-5xl font-bold text-hoshii-earth">
                      ×{stampsEarned}
                    </span>
                  </motion.div>
                  <p className="text-sm text-hoshii-ink/60">星</p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => onOpenChange(false)}
                    className="w-full"
                    size="lg"
                    autoFocus
                  >
                    ありがとう！
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
