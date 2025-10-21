'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schemas
const createActionSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().min(1, '説明は必須です').max(500, '説明は500文字以内で入力してください'),
  imageUrl: z.string().url('有効な画像URLを入力してください').optional().or(z.literal('')),
  tags: z.array(z.string()).min(1, '少なくとも1つのタグを選択してください'),
  communityId: z.string().min(1, 'コミュニティを選択してください'),
});

const createCommunitySchema = z.object({
  name: z.string().min(1, 'コミュニティ名は必須です').max(50, 'コミュニティ名は50文字以内で入力してください'),
  description: z.string().min(1, '説明は必須です').max(200, '説明は200文字以内で入力してください'),
  coverUrl: z.string().url('有効な画像URLを入力してください').optional().or(z.literal('')),
  tags: z.array(z.string()).min(1, '少なくとも1つのタグを選択してください'),
});

// Mock data storage (in real implementation, this would be database operations)
let mockActions: any[] = [];
let mockCommunities: any[] = [];
let mockStars: any[] = [];

// Action operations
export async function createAction(formData: FormData) {
  try {
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      communityId: formData.get('communityId') as string,
    };

    const validatedData = createActionSchema.parse(data);

    const newAction = {
      id: `action-${Date.now()}`,
      ...validatedData,
      starsCount: 0,
      creatorId: 'user-1', // Mock user ID
      createdAt: new Date().toISOString(),
    };

    mockActions.push(newAction);
    
    revalidatePath('/community/home');
    revalidatePath('/community/discover');
    
    return { success: true, action: newAction };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues };
    }
    throw error;
  }
}

export async function getActions(filters?: {
  communityId?: string;
  creatorId?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}) {
  let filteredActions = [...mockActions];

  if (filters?.communityId) {
    filteredActions = filteredActions.filter(action => action.communityId === filters.communityId);
  }

  if (filters?.creatorId) {
    filteredActions = filteredActions.filter(action => action.creatorId === filters.creatorId);
  }

  if (filters?.tags && filters.tags.length > 0) {
    filteredActions = filteredActions.filter(action =>
      filters.tags!.some(tag => action.tags.includes(tag))
    );
  }

  // Sort by creation date (newest first)
  filteredActions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply pagination
  if (filters?.limit) {
    const offset = filters.offset || 0;
    filteredActions = filteredActions.slice(offset, offset + filters.limit);
  }

  return filteredActions;
}

export async function getActionById(actionId: string) {
  return mockActions.find(action => action.id === actionId) || null;
}

// Community operations
export async function createCommunity(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      coverUrl: formData.get('coverUrl') as string,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
    };

    const validatedData = createCommunitySchema.parse(data);

    const newCommunity = {
      id: `community-${Date.now()}`,
      ...validatedData,
      actionsCount: 0,
      membersCount: 1,
      creatorId: 'user-1', // Mock user ID
      createdAt: new Date().toISOString(),
    };

    mockCommunities.push(newCommunity);
    
    revalidatePath('/community/home');
    revalidatePath('/community/discover');
    
    return { success: true, community: newCommunity };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues };
    }
    throw error;
  }
}

export async function getCommunities(filters?: {
  creatorId?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}) {
  let filteredCommunities = [...mockCommunities];

  if (filters?.creatorId) {
    filteredCommunities = filteredCommunities.filter(community => community.creatorId === filters.creatorId);
  }

  if (filters?.tags && filters.tags.length > 0) {
    filteredCommunities = filteredCommunities.filter(community =>
      filters.tags!.some(tag => community.tags.includes(tag))
    );
  }

  // Sort by creation date (newest first)
  filteredCommunities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply pagination
  if (filters?.limit) {
    const offset = filters.offset || 0;
    filteredCommunities = filteredCommunities.slice(offset, offset + filters.limit);
  }

  return filteredCommunities;
}

export async function getCommunityById(communityId: string) {
  return mockCommunities.find(community => community.id === communityId) || null;
}

// Star operations
export async function starAction(actionId: string, userId: string = 'user-1') {
  // Check if already starred
  const existingStar = mockStars.find(star => 
    star.actionId === actionId && star.userId === userId
  );

  if (existingStar) {
    return { success: false, message: 'Already starred' };
  }

  // Add star
  const newStar = {
    id: `star-${Date.now()}`,
    actionId,
    userId,
    createdAt: new Date().toISOString(),
  };

  mockStars.push(newStar);

  // Update action stars count
  const action = mockActions.find(a => a.id === actionId);
  if (action) {
    action.starsCount += 1;
  }

  revalidatePath('/community/home');
  revalidatePath('/community/discover');
  revalidatePath(`/community/action/${actionId}`);

  return { success: true, star: newStar };
}

export async function unstarAction(actionId: string, userId: string = 'user-1') {
  const starIndex = mockStars.findIndex(star => 
    star.actionId === actionId && star.userId === userId
  );

  if (starIndex === -1) {
    return { success: false, message: 'Not starred' };
  }

  // Remove star
  mockStars.splice(starIndex, 1);

  // Update action stars count
  const action = mockActions.find(a => a.id === actionId);
  if (action) {
    action.starsCount = Math.max(0, action.starsCount - 1);
  }

  revalidatePath('/community/home');
  revalidatePath('/community/discover');
  revalidatePath(`/community/action/${actionId}`);

  return { success: true };
}

export async function getUserStars(userId: string = 'user-1') {
  return mockStars.filter(star => star.userId === userId);
}

// Feed operations
export async function getFeed(scope: 'personal' | 'community' = 'personal', userId: string = 'user-1') {
  if (scope === 'personal') {
    // Get user's starred actions and their own actions
    const userStars = await getUserStars(userId);
    const starredActionIds = userStars.map(star => star.actionId);
    
    const starredActions = mockActions.filter(action => starredActionIds.includes(action.id));
    const userActions = mockActions.filter(action => action.creatorId === userId);
    
    return [...starredActions, ...userActions];
  } else {
    // Get all actions (community scope)
    return mockActions;
  }
}

// Search operations
export async function searchContent(query: string, filters?: {
  type?: 'action' | 'community' | 'all';
  tags?: string[];
  area?: string;
}) {
  const searchQuery = query.toLowerCase();
  
  let results: any[] = [];

  if (!filters?.type || filters.type === 'action' || filters.type === 'all') {
    const actionResults = mockActions.filter(action =>
      action.title.toLowerCase().includes(searchQuery) ||
      action.description.toLowerCase().includes(searchQuery) ||
      action.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery))
    );
    results.push(...actionResults.map(action => ({ ...action, type: 'action' })));
  }

  if (!filters?.type || filters.type === 'community' || filters.type === 'all') {
    const communityResults = mockCommunities.filter(community =>
      community.name.toLowerCase().includes(searchQuery) ||
      community.description.toLowerCase().includes(searchQuery) ||
      community.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery))
    );
    results.push(...communityResults.map(community => ({ ...community, type: 'community' })));
  }

  // Apply additional filters
  if (filters?.tags && filters.tags.length > 0) {
    results = results.filter(item =>
      filters.tags!.some(tag => item.tags.includes(tag))
    );
  }

  return results;
}

// Notification operations
export async function getNotifications(userId: string = 'user-1') {
  // Mock notifications
  return [
    {
      id: 'notif-1',
      type: 'star',
      message: 'あなたのアクション「公園の清掃活動」にスターが付けられました',
      actionId: 'action-1',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
    },
    {
      id: 'notif-2',
      type: 'goal',
      message: 'コミュニティ「Green Valley」の目標が達成されました！',
      communityId: 'community-1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
    },
    {
      id: 'notif-3',
      type: 'participation',
      message: '新しいメンバーがコミュニティ「Learning Hub」に参加しました',
      communityId: 'community-2',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
    },
  ];
}
