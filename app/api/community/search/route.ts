import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const tags = searchParams.get('tags') || '';
  const type = searchParams.get('type') || '';
  const area = searchParams.get('area') || '';

  try {
    // In a real implementation, you would:
    // 1. Build dynamic SQL query based on filters
    // 2. Search across actions and communities tables
    // 3. Apply pagination
    // 4. Return combined results

    // Mock search results
    const mockActions = [
      {
        id: 'action-1',
        title: '公園の清掃活動',
        description: '地域の公園を美しく保つための清掃活動',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
        tags: ['環境', 'コミュニティ', '清掃'],
        starsCount: 24,
        creator: {
          id: 'user-1',
          name: '田中太郎',
          iconUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32'
        },
        community: {
          id: 'community-1',
          name: 'Green Valley'
        },
        type: 'action'
      },
      {
        id: 'action-2',
        title: '地域の子どもたちと絵本読み聞かせ',
        description: '地域の図書館で子どもたちに絵本の読み聞かせを行いました',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        tags: ['教育', '子ども', '読書'],
        starsCount: 18,
        creator: {
          id: 'user-2',
          name: '佐藤花子',
          iconUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32'
        },
        community: {
          id: 'community-2',
          name: 'Learning Hub'
        },
        type: 'action'
      }
    ];

    const mockCommunities = [
      {
        id: 'community-1',
        name: 'Green Valley',
        description: '環境保護とサステナビリティに取り組むコミュニティ',
        coverUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
        tags: ['環境', '自然', 'サステナビリティ'],
        actionsCount: 45,
        membersCount: 128,
        creator: {
          id: 'user-1',
          name: '田中太郎',
          iconUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32'
        },
        type: 'community'
      }
    ];

    // Apply filters
    let filteredActions = mockActions;
    let filteredCommunities = mockCommunities;

    if (q) {
      const query = q.toLowerCase();
      filteredActions = filteredActions.filter(action =>
        action.title.toLowerCase().includes(query) ||
        action.description.toLowerCase().includes(query) ||
        action.tags.some(tag => tag.toLowerCase().includes(query))
      );
      filteredCommunities = filteredCommunities.filter(community =>
        community.name.toLowerCase().includes(query) ||
        community.description.toLowerCase().includes(query) ||
        community.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      filteredActions = filteredActions.filter(action =>
        tagArray.some(tag => action.tags.includes(tag))
      );
      filteredCommunities = filteredCommunities.filter(community =>
        tagArray.some(tag => community.tags.includes(tag))
      );
    }

    if (type) {
      if (type === 'action') {
        filteredCommunities = [];
      } else if (type === 'community') {
        filteredActions = [];
      }
    }

    // Combine results
    const results = [
      ...filteredActions,
      ...filteredCommunities
    ];

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
      filters: {
        q,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        type,
        area
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
