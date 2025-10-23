'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface StampCardProps {
  stamps: number;
  userName: string;
}

export function StampCard({ stamps, userName }: StampCardProps) {
  // Display stamps in a 5x4 grid (20 total)
  const maxStamps = 20;
  const filledStamps = Math.min(stamps, maxStamps);
  const emptyStamps = maxStamps - filledStamps;

  return (
    <Card className="kawaii-card bg-gradient-to-br from-hoshii-sand via-hoshii-mint to-hoshii-sky/20 border-hoshii-earth/20">
      <CardContent className="p-6">
        <div className="text-center mb-5">
          <p className="text-sm text-hoshii-ink/70 font-medium">
            {userName} さんの星カード
          </p>
          <p className="text-4xl font-bold text-hoshii-earth mt-2">
            {stamps} <span className="text-xl font-normal text-hoshii-ink/50">/ {maxStamps}</span>
          </p>
        </div>

        {/* Stamp Grid */}
        <div className="grid grid-cols-5 gap-2.5 mb-5">
          {/* Filled Stamps */}
          {Array.from({ length: filledStamps }).map((_, i) => (
            <motion.div
              key={`filled-${i}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: i * 0.03
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="aspect-square flex items-center justify-center bg-gradient-to-br from-hoshii-earth to-hoshii-green rounded-2xl shadow-soft"
            >
              <span className="text-2xl" role="img" aria-label="star">
                ⭐
              </span>
            </motion.div>
          ))}
          
          {/* Empty Stamps */}
          {Array.from({ length: emptyStamps }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square flex items-center justify-center bg-white border-2 border-dashed border-hoshii-earth/30 rounded-2xl"
            >
              <span className="text-xl opacity-20">⭐</span>
            </div>
          ))}
        </div>

        <div className="text-center bg-hoshii-mint/50 rounded-2xl py-3 px-4">
          <p className="text-sm text-hoshii-ink/70 leading-relaxed">
            {stamps >= maxStamps ? (
              <>🎉 星がいっぱい！新しいカードがもらえます！</>
            ) : (
              <>あと {maxStamps - stamps} 個の星で満タン！</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
