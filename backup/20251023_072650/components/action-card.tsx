'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Action } from '@/lib/data';
import { motion } from 'framer-motion';
import { getDomainColor, getDomainEmoji } from '@/lib/domain-colors';

interface ActionCardProps {
  action: Action;
  onClick?: () => void;
  onComplete?: () => void;
}

export function ActionCard({ action, onClick, onComplete }: ActionCardProps) {
  const domainColor = getDomainColor(action.domain);
  const domainEmoji = getDomainEmoji(action.domain);

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card 
        className="kawaii-card overflow-hidden cursor-pointer hover:shadow-[0_16px_32px_rgba(0,0,0,0.1)] transition-shadow"
        onClick={onClick}
      >
        <div className="absolute top-3 left-3">
          <span className="kawaii-pill text-xs bg-hoshii-earth/20 border-hoshii-earth/30">
            {domainEmoji}
          </span>
        </div>
        
        <CardContent className="pt-12 pb-4 px-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-semibold text-lg leading-tight text-hoshii-ink">{action.title}</h3>
            <Badge variant="outline" className="flex items-center gap-1 shrink-0 rounded-full border-hoshii-green/30 bg-hoshii-mint">
              <span className="text-base">⭐</span>
              <span className="text-hoshii-ink">×1</span>
            </Badge>
          </div>
          
          <p className="text-[15.5px] text-hoshii-ink/70 leading-relaxed mb-3">
            {action.description}
          </p>
          
          <Badge variant="secondary" className="capitalize rounded-full bg-hoshii-green2 text-hoshii-ink border-0">
            {action.domain}
          </Badge>
        </CardContent>
        
        {onComplete && (
          <CardFooter className="px-5 pb-5 pt-2">
            <Button 
              className="w-full" 
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              size="lg"
            >
              実行する
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
