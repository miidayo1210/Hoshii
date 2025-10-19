'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dataLayer, ActionDomain } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';

export default function NewEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    place: '',
    domain: 'community' as ActionDomain,
    stamps: 1,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const event = dataLayer.createEvent({
      ...formData,
      orgId: 'demo',
    });

    router.push(`/events/${event.id}`);
  };

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

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle>新しいイベントを作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">イベント名 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="例：チーム花見大会"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">日時 *</Label>
              <Input
                id="time"
                type="datetime-local"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place">場所 *</Label>
              <Input
                id="place"
                value={formData.place}
                onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                required
                placeholder="例：代々木公園"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">カテゴリ *</Label>
              <select
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value as ActionDomain })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="health">健康</option>
                <option value="environment">環境</option>
                <option value="community">コミュニティ</option>
                <option value="learning">学習</option>
                <option value="wellbeing">ウェルビーイング</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stamps">スタンプ報酬</Label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎫</span>
                <Input
                  id="stamps"
                  type="number"
                  value={formData.stamps}
                  onChange={(e) => setFormData({ ...formData, stamps: parseInt(e.target.value) || 1 })}
                  required
                  min="1"
                  max="5"
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">（通常は1個）</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="参加者に伝えたいことを書いてください..."
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                キャンセル
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                イベント作成
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
