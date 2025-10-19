'use client';

import { useState, useEffect, useRef } from 'react';
import { ActionCard } from '@/components/action-card';
import { EnvelopeModal } from '@/components/envelope-modal';
import { dataLayer, Action } from '@/lib/data';
import { Sparkles, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import type { ThanksFrom } from '@/lib/thanks-templates';

export default function TodayPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [thanksModal, setThanksModal] = useState<{
    open: boolean;
    from: ThanksFrom;
    stamps: number;
  }>({ open: false, from: 'peer', stamps: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const suggested = dataLayer.getTodaysSuggestedActions();
    setActions(suggested);
  }, []);

  const handleActionClick = (action: Action) => {
    setSelectedAction(action);
    setUploadedImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmComplete = () => {
    if (!selectedAction) return;
    
    const user = dataLayer.getCurrentUser();
    if (!user) return;

    // Complete with image URL (in production, this would be uploaded to storage)
    dataLayer.completeAction(user.id, selectedAction.id, 1, uploadedImage || undefined);
    
    // Determine thanks source based on domain
    const thanksFrom: ThanksFrom = 
      selectedAction.domain === 'environment' ? 'environment' :
      selectedAction.domain === 'community' ? 'society' : 'peer';

    // Close upload dialog
    setSelectedAction(null);
    setUploadedImage(null);

    // Show thanks modal
    setThanksModal({
      open: true,
      from: thanksFrom,
      stamps: 1,
    });

    // Remove completed action from the list
    setActions(actions.filter((a) => a.id !== selectedAction.id));
  };

  return (
    <div className="container max-w-2xl mx-auto px-5 md:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="h-6 w-6 text-hoshii-green" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-hoshii-ink">
          今日のアクション
        </h1>
      </div>

      {actions.length > 0 ? (
        <div className="space-y-5">
          {actions.map((action) => (
            <ActionCard 
              key={action.id}
              action={action} 
              onClick={() => handleActionClick(action)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-xl text-hoshii-ink font-semibold mb-2">
            今日のアクション、全部完了！
          </p>
          <p className="text-[15.5px] text-hoshii-ink/60 leading-relaxed">
            また明日、新しいアクションをチェックしてね！
          </p>
        </div>
      )}

      {/* Image Upload Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white/95 backdrop-blur border-0 shadow-card">
          <DialogHeader>
            <DialogTitle className="text-center text-hoshii-ink">
              {selectedAction?.title} を完了しますか？ ✨
            </DialogTitle>
          </DialogHeader>

          <div className="py-5 space-y-4">
            <p className="text-[15.5px] text-center text-hoshii-ink/70 leading-relaxed">
              よかったら写真を添えてシェアしてね！
            </p>

            {/* Image Preview */}
            {uploadedImage ? (
              <motion.div 
                className="relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <img
                  src={uploadedImage}
                  alt="Uploaded proof"
                  className="w-full h-48 object-cover rounded-2xl border-2 border-hoshii-green/20 shadow-soft"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setUploadedImage(null)}
                >
                  ✕
                </Button>
              </motion.div>
            ) : (
              <motion.div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-hoshii-green/40 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-hoshii-green hover:bg-hoshii-mint/50 transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera className="h-12 w-12 text-hoshii-green mb-3" strokeWidth={1.5} />
                <p className="text-base text-hoshii-ink font-medium">
                  写真を選択
                </p>
                <p className="text-sm text-hoshii-ink/60 mt-1.5">
                  タップして写真を選んでください
                </p>
              </motion.div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-3">
            <motion.div className="w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleConfirmComplete}
                className="w-full"
                size="lg"
              >
                {uploadedImage ? '写真付きで完了！' : '完了する'}
              </Button>
            </motion.div>
            <Button
              variant="outline"
              onClick={() => setSelectedAction(null)}
              className="w-full"
            >
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Envelope Thanks Modal */}
      <EnvelopeModal
        open={thanksModal.open}
        onOpenChange={(open) => setThanksModal({ ...thanksModal, open })}
        from={thanksModal.from}
        stampsEarned={thanksModal.stamps}
      />
    </div>
  );
}
