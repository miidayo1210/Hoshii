'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';

interface PointsWalletProps {
  points: number;
  userName: string;
}

export function PointsWallet({ points, userName }: PointsWalletProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Hello, {userName}</p>
            <p className="text-3xl font-bold mt-1">{points}</p>
            <p className="text-sm opacity-90">Available Points</p>
          </div>
          <div className="bg-white/20 rounded-full p-4">
            <Coins className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


