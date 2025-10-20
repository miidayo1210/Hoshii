'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';

const actionSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().min(1, '説明は必須です').max(500, '説明は500文字以内で入力してください'),
  imageUrl: z.string().url('有効な画像URLを入力してください').optional().or(z.literal('')),
  tags: z.array(z.string()).min(1, '少なくとも1つのタグを選択してください'),
  communityId: z.string().min(1, 'コミュニティを選択してください'),
});

type ActionFormData = z.infer<typeof actionSchema>;

interface CreateActionModalProps {
  children: React.ReactNode;
  onActionCreated?: (action: ActionFormData) => void;
}

const mockCommunities = [
  { id: 'community-1', name: 'Green Valley' },
  { id: 'community-2', name: 'Learning Hub' },
  { id: 'community-3', name: 'Care Community' },
];

const availableTags = ['環境', '教育', '高齢者', '防災', '祭り', 'コミュニティ', '清掃', '子ども', '読書', 'ボランティア', '福祉', '安全', '訓練', '地域', 'イベント'];

export function CreateActionModal({ children, onActionCreated }: CreateActionModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ActionFormData>({
    title: '',
    description: '',
    imageUrl: '',
    tags: [],
    communityId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: keyof ActionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleAddCustomTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleTagAdd(newTag.trim());
      setNewTag('');
    }
  };

  const handleSubmit = async () => {
    try {
      const validatedData = actionSchema.parse(formData);
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onActionCreated?.(validatedData);
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        tags: [],
        communityId: '',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>アクションカードを作成</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              placeholder="アクションのタイトルを入力してください"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">説明 *</Label>
            <Textarea
              id="description"
              placeholder="アクションの詳細を説明してください"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">画像URL</Label>
            <div className="flex space-x-2">
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className={errors.imageUrl ? 'border-red-500' : ''}
              />
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-1" />
                アップロード
              </Button>
            </div>
            {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
            
            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="mt-2">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Community Selection */}
          <div className="space-y-2">
            <Label htmlFor="community">コミュニティ *</Label>
            <select
              id="community"
              value={formData.communityId}
              onChange={(e) => handleInputChange('communityId', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md focus:border-community-purple focus:ring-community-purple/20"
            >
              <option value="">コミュニティを選択してください</option>
              {mockCommunities.map(community => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
            {errors.communityId && <p className="text-sm text-red-500">{errors.communityId}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>タグ *</Label>
            
            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="default" className="bg-community-purple">
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 hover:bg-community-purple/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Available Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {availableTags
                .filter(tag => !formData.tags.includes(tag))
                .map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => handleTagAdd(tag)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
            </div>

            {/* Custom Tag Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="カスタムタグを追加"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
              />
              <Button onClick={handleAddCustomTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-community-purple hover:bg-community-purple/90"
            >
              {isSubmitting ? '作成中...' : 'アクションを作成'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
