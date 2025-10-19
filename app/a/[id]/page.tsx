'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnvelopeModal } from '@/components/envelope-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { dataLayer, Action } from '@/lib/data';
import { ArrowLeft, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDomainColor } from '@/lib/domain-colors';
import type { ThanksFrom } from '@/lib/thanks-templates';

export default function ActionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [action, setAction] = useState<Action | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [thanksModal, setThanksModal] = useState<{
    open: boolean;
    from: ThanksFrom;
    stamps: number;
  }>({ open: false, from: 'peer', stamps: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const actionData = dataLayer.getActionById(params.id);
    setAction(actionData);
  }, [params.id]);

  const handleCompleteClick = () => {
    setShowImageUpload(true);
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
    const user = dataLayer.getCurrentUser();
    if (!user || !action) return;

    dataLayer.completeAction(user.id, action.id, 1, uploadedImage || undefined);
    setCompleted(true);

    // Determine thanks source based on domain
    const thanksFrom: ThanksFrom = 
      action.domain === 'environment' ? 'environment' :
      action.domain === 'community' ? 'society' : 'peer';

    setShowImageUpload(false);
    setUploadedImage(null);

    setThanksModal({
      open: true,
      from: thanksFrom,
      stamps: 1,
    });
  };

  if (!action) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-muted-foreground">アクションが見つかりません</p>
      </div>
    );
  }

  const domainColor = getDomainColor(action.domain);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        戻る
      </Button>

      <Card className="overflow-hidden border-purple-200">
        <div className={`h-3 ${domainColor}`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">{action.title}</h1>
            <Badge variant="outline" className="flex items-center gap-1 shrink-0">
              <span className="text-lg">🎫</span>
              ×1
            </Badge>
          </div>

          <div className="mb-6">
            <Badge variant="secondary" className="capitalize">
              {action.domain}
            </Badge>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">説明</h2>
            <p className="text-muted-foreground">{action.description}</p>
          </div>

          <div className="space-y-2">
            {!completed ? (
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500" 
                size="lg" 
                onClick={handleCompleteClick}
              >
                完了する
              </Button>
            ) : (
              <Button className="w-full" size="lg" disabled>
                ✓ 完了済み
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Upload Dialog */}
      <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white/95 backdrop-blur border-0 shadow-card">
          <DialogHeader>
            <DialogTitle className="text-center text-hoshii-ink">
              {action.title} を完了しますか？ ✨
            </DialogTitle>
          </DialogHeader>

          <div className="py-5 space-y-4">
            <p className="text-[15.5px] text-center text-hoshii-ink/70 leading-relaxed">
              よかったら写真を添えてシェアしてね！
            </p>

            {uploadedImage ? (
              <motion.div 
                className="relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <img
                  src={uploadedImage}
                  alt="アップロード"
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
                  写真を選択（任意）
                </p>
                <p className="text-sm text-hoshii-ink/60 mt-1.5">
                  タップして写真を選べます
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
              onClick={() => setShowImageUpload(false)}
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
