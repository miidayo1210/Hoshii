'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Share2, Download, Copy } from 'lucide-react';

interface QRPreviewProps {
  url: string;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function QRPreview({ url, title, description, size = 'md' }: QRPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'QRコード',
          text: description || 'このQRコードをスキャンしてください',
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      // You could show a toast notification here
    }
  };

  const handleDownload = () => {
    // In a real implementation, you would generate and download the QR code image
    // For now, we'll just copy the URL
    navigator.clipboard.writeText(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    // You could show a toast notification here
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          <QrCode className="w-4 h-4 mr-2" />
          QRコード
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title || 'QRコード'}</DialogTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </DialogHeader>
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className={`${sizeClasses[size]} bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center`}>
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
          </div>

          {/* URL Display */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 break-all">{url}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              共有
            </Button>
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              コピー
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              QRコードをスキャンしてイベントに参加してください
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Standalone QR Code component for inline use
interface QRCodeProps {
  url: string;
  size?: 'sm' | 'md' | 'lg';
  showUrl?: boolean;
  className?: string;
}

export function QRCode({ url, size = 'md', showUrl = false, className = '' }: QRCodeProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  return (
    <div className={`text-center ${className}`}>
      <div className={`${sizeClasses[size]} bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2`}>
        <QrCode className="w-12 h-12 text-gray-400" />
      </div>
      {showUrl && (
        <p className="text-xs text-gray-500 break-all">{url}</p>
      )}
    </div>
  );
}
