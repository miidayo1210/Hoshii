'use client';

import { useState, useEffect } from 'react';
import { StampCard } from '@/components/stamp-card';
import { RedeemCatalog } from '@/components/redeem-catalog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { dataLayer, RedeemItem, User } from '@/lib/data';
import { Gift } from 'lucide-react';

export default function RedeemPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<RedeemItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RedeemItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const currentUser = dataLayer.getCurrentUser();
    setUser(currentUser);

    const redeemItems = dataLayer.getRedeemItems();
    setItems(redeemItems);
  }, []);

  const handleRedeem = (item: RedeemItem) => {
    setSelectedItem(item);
  };

  const confirmRedeem = () => {
    if (!user || !selectedItem) return;

    try {
      dataLayer.redeemItem(user.id, selectedItem.id, selectedItem.stampsCost);
      
      // Update user state
      const updatedUser = dataLayer.getCurrentUser();
      setUser(updatedUser);
      
      setSelectedItem(null);
      setShowSuccess(true);
    } catch (error) {
      console.error('Redemption failed:', error);
    }
  };

  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-5 md:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Gift className="h-6 w-6 text-hoshii-green" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-hoshii-ink">
          星で交換
        </h1>
      </div>

      <div className="mb-8">
        <StampCard stamps={user.stamps} userName={user.name} />
      </div>

      <h2 className="text-xl font-semibold mb-5 text-hoshii-ink">🌟 交換できる景品</h2>
      <RedeemCatalog
        items={items}
        userStamps={user.stamps}
        onRedeem={handleRedeem}
      />

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>交換確認</DialogTitle>
            <DialogDescription>
              本当にこのアイテムと交換しますか？
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="py-4">
              <p className="font-semibold text-lg mb-2">{selectedItem.title}</p>
              <p className="text-sm text-muted-foreground mb-4">{selectedItem.description}</p>
              <p className="text-sm flex items-center gap-2">
                必要な星: <span className="text-2xl">⭐</span>
                <span className="font-bold text-lg">×{selectedItem.stampsCost}</span>
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                残り: <span className="text-xl">⭐</span>
                <span className="font-semibold">×{user.stamps - selectedItem.stampsCost}</span>
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              キャンセル
            </Button>
            <Button onClick={confirmRedeem} className="bg-gradient-to-r from-purple-500 to-pink-500">
              交換する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>交換成功！🎉</DialogTitle>
            <DialogDescription>
              景品の交換が完了しました
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-lg">
              メールで受け取り方法をご確認ください
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccess(false)} className="w-full">
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
