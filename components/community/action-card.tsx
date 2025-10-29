'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, User, MapPin } from 'lucide-react';
import { useState } from 'react';

interface ActionCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  starsCount: number;
  creator: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  community?: {
    id: string;
    name: string;
  };
  isStarred?: boolean;
  onStar?: (actionId: string) => void;
}

export function ActionCard({
  id,
  title,
  description,
  imageUrl,
  tags,
  starsCount,
  creator,
  community,
  isStarred = false,
  onStar
}: ActionCardProps) {
  const [isStarring, setIsStarring] = useState(false);

  const handleStar = async () => {
    if (!onStar) return;
    
    setIsStarring(true);
    try {
      await onStar(id);
    } finally {
      setIsStarring(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
      <Link href={`/community/action/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-community-purple/20 to-community-lavender/20 flex items-center justify-center">
              <Heart className="w-12 h-12 text-community-purple/40" />
            </div>
          )}
          
          {/* Star button overlay */}
          <div className="absolute top-3 right-3">
            <Button
              size="sm"
              variant={isStarred ? "default" : "secondary"}
              className={`rounded-full w-10 h-10 p-0 ${
                isStarred 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                  : 'bg-white/90 hover:bg-white text-gray-700'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleStar();
              }}
              disabled={isStarring}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Creator info */}
          <div className="flex items-center space-x-2">
            {creator.iconUrl ? (
              <Image
                src={creator.iconUrl}
                alt={creator.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-community-purple/20 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-community-purple" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">{creator.name}</span>
            {community && (
              <>
                <span className="text-gray-400">•</span>
                <Link 
                  href={`/community/board/${community.id}`}
                  className="text-sm text-community-purple hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {community.name}
                </Link>
              </>
            )}
          </div>
          
          {/* Title and description */}
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {description}
            </p>
          </div>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* Stars count */}
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Star className="w-4 h-4" />
            <span>{starsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BoardCardProps {
  id: string;
  name: string;
  description: string;
  coverUrl?: string;
  tags: string[];
  actionsCount: number;
  membersCount: number;
  creator: {
    id: string;
    name: string;
    iconUrl?: string;
  };
}

export function BoardCard({
  id,
  name,
  description,
  coverUrl,
  tags,
  actionsCount,
  membersCount,
  creator
}: BoardCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
      <Link href={`/community/board/${id}`}>
        <div className="relative aspect-[3/2] overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-community-purple/30 to-community-lavender/30 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-community-purple/60" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Board info overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-bold text-lg mb-1">{name}</h3>
            <p className="text-sm opacity-90 line-clamp-2">{description}</p>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Creator info */}
          <div className="flex items-center space-x-2">
            {creator.iconUrl ? (
              <Image
                src={creator.iconUrl}
                alt={creator.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <div className="w-5 h-5 bg-community-purple/20 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-community-purple" />
              </div>
            )}
            <span className="text-sm text-gray-600">{creator.name}</span>
          </div>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge className="text-xs">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          )}
          
          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{actionsCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{membersCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
