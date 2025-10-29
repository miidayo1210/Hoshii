'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RedeemItem } from '@/lib/data';
import { motion } from 'framer-motion';

interface RedeemCatalogProps {
  items: RedeemItem[];
  userStamps: number;
  onRedeem: (item: RedeemItem) => void;
}

export function RedeemCatalog({ items, userStamps, onRedeem }: RedeemCatalogProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {items.map((item, i) => {
        const canAfford = userStamps >= item.stampsCost;
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className={`kawaii-card ${!item.available ? 'opacity-50' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <h3 className="font-semibold text-lg leading-tight text-hoshii-ink">{item.title}</h3>
                  <Badge 
                    className="flex items-center gap-1 shrink-0 rounded-full border-hoshii-earth/30 bg-hoshii-sand"
                  >
                    <span className="text-base">⭐</span>
                    <span className="text-hoshii-ink">×{item.stampsCost}</span>
                  </Badge>
                </div>
                
                <p className="text-[15.5px] text-hoshii-ink/70 leading-relaxed mb-4">{item.description}</p>
                
                <Badge className="capitalize rounded-full bg-hoshii-sky/40 border-hoshii-sky/50 text-hoshii-ink">
                  {item.category}
                </Badge>
              </CardContent>
              
              <CardFooter className="p-5 pt-2">
                <Button
                  className="w-full"
                  onClick={() => onRedeem(item)}
                  disabled={!item.available || !canAfford}
                >
                  {!item.available ? '在庫なし' : !canAfford ? '星が足りません' : '交換する'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
