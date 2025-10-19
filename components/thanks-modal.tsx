'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getThanksMessage, type ThanksFrom } from '@/lib/thanks-templates';
import { Sparkles, Heart, Users } from 'lucide-react';

interface ThanksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  from: ThanksFrom;
  pointsEarned: number;
  domain?: string;
}

export function ThanksModal({ open, onOpenChange, from, pointsEarned, domain }: ThanksModalProps) {
  const message = getThanksMessage(from, domain);
  
  const getIcon = () => {
    switch (from) {
      case 'society':
        return <Users className="h-16 w-16 text-blue-500 mx-auto" />;
      case 'environment':
        return <Heart className="h-16 w-16 text-green-500 mx-auto" />;
      case 'peer':
        return <Sparkles className="h-16 w-16 text-purple-500 mx-auto" />;
    }
  };

  const getTitle = () => {
    switch (from) {
      case 'society':
        return 'Thank you from our community!';
      case 'environment':
        return 'The planet thanks you!';
      case 'peer':
        return 'You\'re amazing!';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center gap-4 py-4">
          {getIcon()}
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl">{getTitle()}</DialogTitle>
            <DialogDescription className="text-base pt-2">{message}</DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">You earned</p>
            <p className="text-4xl font-bold text-primary">+{pointsEarned}</p>
            <p className="text-sm text-muted-foreground">points</p>
          </div>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
            autoFocus
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


