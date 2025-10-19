'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dataLayer, ActionDomain } from '@/lib/data';

interface EventQuickFormProps {
  onSuccess?: (eventId: string) => void;
}

export function EventQuickForm({ onSuccess }: EventQuickFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    place: '',
    domain: 'community' as ActionDomain,
    stamps: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const event = dataLayer.createEvent({
      ...formData,
      description: '',
      orgId: 'demo',
    });

    if (onSuccess) {
      onSuccess(event.id);
    }

    // Reset form
    setFormData({
      title: '',
      time: '',
      place: '',
      domain: 'community',
      stamps: 1,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>クイックイベント作成</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="quick-title">Title *</Label>
            <Input
              id="quick-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Event name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-time">Date & Time *</Label>
            <Input
              id="quick-time"
              type="datetime-local"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-place">Location *</Label>
            <Input
              id="quick-place"
              value={formData.place}
              onChange={(e) => setFormData({ ...formData, place: e.target.value })}
              required
              placeholder="Event location"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quick-domain">Category</Label>
              <select
                id="quick-domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value as ActionDomain })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="health">Health</option>
                <option value="environment">Environment</option>
                <option value="community">Community</option>
                <option value="learning">Learning</option>
                <option value="wellbeing">Wellbeing</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quick-stamps">スタンプ</Label>
              <Input
                id="quick-stamps"
                type="number"
                value={formData.stamps}
                onChange={(e) => setFormData({ ...formData, stamps: parseInt(e.target.value) || 1 })}
                min="1"
                max="5"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
            イベント作成
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

