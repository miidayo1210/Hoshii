'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/lib/data';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDomainColor, getDomainEmoji } from '@/lib/domain-colors';

interface EventCardProps {
  event: Event;
  isJoined?: boolean;
  isCompleted?: boolean;
  onJoin?: () => void;
  onComplete?: () => void;
  onViewDetails?: () => void;
}

export function EventCard({ 
  event, 
  isJoined, 
  isCompleted, 
  onJoin, 
  onComplete,
  onViewDetails 
}: EventCardProps) {
  const eventDate = new Date(event.time);
  const formattedDate = eventDate.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const domainColor = getDomainColor(event.domain);
  const domainEmoji = getDomainEmoji(event.domain);

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card className="kawaii-card overflow-hidden hover:shadow-[0_16px_32px_rgba(0,0,0,0.1)] transition-shadow">
        <div className="absolute top-3 left-3">
          <span className="kawaii-pill text-xs bg-hoshii-earth/20 border-hoshii-earth/30">
            {domainEmoji}
          </span>
        </div>
        
        <CardContent className="pt-12 pb-4 px-5">
          <div className="flex items-start justify-between gap-2 mb-4">
            <h3 className="font-semibold text-lg leading-tight text-hoshii-ink">{event.title}</h3>
            <Badge className="flex items-center gap-1 shrink-0 rounded-full border-hoshii-green/30 bg-hoshii-mint">
              <span className="text-base">⭐</span>
              <span className="text-hoshii-ink">×1</span>
            </Badge>
          </div>
          
          <div className="space-y-3 text-[15.5px] text-hoshii-ink/70">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" strokeWidth={1.5} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              <span>{event.place}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <Badge className="capitalize rounded-full bg-hoshii-green2 text-hoshii-ink border-0">
              {event.domain}
            </Badge>
          </div>
        </CardContent>
        
        <CardFooter className="px-5 pb-5 pt-2 gap-2">
          {onViewDetails && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onViewDetails}
            >
              詳細
            </Button>
          )}
          {!isJoined && !isCompleted && onJoin && (
            <Button className="flex-1" onClick={onJoin}>
              参加する
            </Button>
          )}
          {isJoined && !isCompleted && onComplete && (
            <Button className="flex-1" onClick={onComplete}>
              完了
            </Button>
          )}
          {isCompleted && (
            <Button className="flex-1" disabled>
              ✓ 完了済み
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
