// Data Models
export interface User {
  id: string;
  name: string;
  email: string;
  stamps: number; // Changed from points to stamps
  orgId: string;
  createdAt: string;
}

export type ActionDomain = 'health' | 'environment' | 'community' | 'learning' | 'wellbeing';

export interface Action {
  id: string;
  title: string;
  description: string;
  domain: ActionDomain;
  stampsValue: number; // Changed from pointsValue, always 1
  suggestedFor?: string; // user id
  createdAt: string;
}

export interface ActionLog {
  id: string;
  userId: string;
  actionId: string;
  completedAt: string;
  stampsAwarded: number; // Changed from pointsAwarded, always 1
  imageUrl?: string; // Added: proof image
}

export interface Event {
  id: string;
  title: string;
  time: string;
  place: string;
  domain: ActionDomain;
  stamps: number; // Changed from points, always 1
  description: string;
  orgId: string;
  createdAt: string;
}

export interface EventParticipation {
  id: string;
  eventId: string;
  userId: string;
  joinedAt: string;
  completedAt?: string;
  stampsAwarded?: number; // Changed from pointsAwarded, always 1
  imageUrl?: string; // Added: proof image
}

export interface RedeemItem {
  id: string;
  title: string;
  description: string;
  stampsCost: number; // Changed from pointsCost
  category: string;
  imageUrl?: string;
  available: boolean;
}

export interface Redemption {
  id: string;
  userId: string;
  itemId: string;
  redeemedAt: string;
  stampsSpent: number; // Changed from pointsSpent
  status: 'pending' | 'fulfilled' | 'cancelled';
}

// Data Layer Interface
export interface DataLayer {
  // User
  getCurrentUser(): User | null;
  updateUserStamps(userId: string, stamps: number): void;

  // Actions
  getActions(): Action[];
  getActionById(id: string): Action | null;
  getTodaysSuggestedActions(): Action[];
  createAction(action: Omit<Action, 'id' | 'createdAt'>): Action;

  // Action Logs
  getActionLogs(): ActionLog[];
  getUserActionLogs(userId: string): ActionLog[];
  completeAction(userId: string, actionId: string, stampsAwarded: number, imageUrl?: string): ActionLog;

  // Events
  getEvents(): Event[];
  getEventById(id: string): Event | null;
  createEvent(event: Omit<Event, 'id' | 'createdAt'>): Event;
  
  // Event Participation
  getEventParticipations(): EventParticipation[];
  getUserEventParticipations(userId: string): EventParticipation[];
  joinEvent(userId: string, eventId: string): EventParticipation;
  completeEvent(userId: string, eventId: string, stampsAwarded: number, imageUrl?: string): EventParticipation;
  
  // Redeem Items
  getRedeemItems(): RedeemItem[];
  getRedeemItemById(id: string): RedeemItem | null;
  
  // Redemptions
  getRedemptions(): Redemption[];
  getUserRedemptions(userId: string): Redemption[];
  redeemItem(userId: string, itemId: string, stampsCost: number): Redemption;
  
  // Organization Analytics
  getOrgTotalStamps(orgId: string): number;
  getOrgDomainBreakdown(orgId: string): Record<ActionDomain, number>;
  getOrgMonthlyTrend(orgId: string): Array<{ month: string; stamps: number }>;
}

// LocalStorage Implementation
class LocalStorageDataLayer implements DataLayer {
  private storageKey = 'hoshii_data';

  private getData() {
    if (typeof window === 'undefined') return this.getDefaultData();
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : this.getDefaultData();
  }

  private saveData(data: any) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private getDefaultData() {
    const now = new Date().toISOString();
    return {
      users: [
        {
          id: 'user-1',
          name: 'Alex Chen',
          email: 'alex@demo.com',
          stamps: 15,
          orgId: 'demo',
          createdAt: now,
        },
      ] as User[],
      actions: [
        {
          id: 'action-1',
          title: 'Take a mindful walk',
          description: 'Step outside for a 10-minute walk and observe your surroundings',
          domain: 'wellbeing' as ActionDomain,
          stampsValue: 1,
          suggestedFor: 'user-1',
          createdAt: now,
        },
        {
          id: 'action-2',
          title: 'Use reusable container',
          description: 'Bring your own container for lunch today',
          domain: 'environment' as ActionDomain,
          stampsValue: 1,
          suggestedFor: 'user-1',
          createdAt: now,
        },
        {
          id: 'action-3',
          title: 'Share a skill',
          description: 'Teach a colleague something you know',
          domain: 'community' as ActionDomain,
          stampsValue: 1,
          suggestedFor: 'user-1',
          createdAt: now,
        },
        {
          id: 'action-4',
          title: 'Learn something new',
          description: 'Complete a 15-minute online tutorial',
          domain: 'learning' as ActionDomain,
          stampsValue: 1,
          createdAt: now,
        },
        {
          id: 'action-5',
          title: 'Stretch break',
          description: 'Take a 5-minute stretch break',
          domain: 'health' as ActionDomain,
          stampsValue: 1,
          createdAt: now,
        },
      ] as Action[],
      actionLogs: [] as ActionLog[],
      events: [
        {
          id: 'event-1',
          title: 'Community Garden Day',
          time: '2025-10-20T14:00:00Z',
          place: 'City Garden, Block A',
          domain: 'environment' as ActionDomain,
          stamps: 1,
          description: 'Join us for a community gardening session. Help plant vegetables and flowers!',
          orgId: 'demo',
          createdAt: now,
        },
        {
          id: 'event-2',
          title: 'Wellness Workshop',
          time: '2025-10-18T10:00:00Z',
          place: 'Office Conference Room',
          domain: 'wellbeing' as ActionDomain,
          stamps: 1,
          description: 'Learn stress management techniques and mindfulness practices.',
          orgId: 'demo',
          createdAt: now,
        },
      ] as Event[],
      eventParticipations: [] as EventParticipation[],
      redeemItems: [
        {
          id: 'item-1',
          title: 'Coffee Voucher',
          description: 'Get a free coffee at our cafe',
          stampsCost: 5,
          category: 'food',
          available: true,
        },
        {
          id: 'item-2',
          title: 'Tree Planting Donation',
          description: 'Plant a tree in your name',
          stampsCost: 10,
          category: 'environment',
          available: true,
        },
        {
          id: 'item-3',
          title: 'Yoga Class Pass',
          description: 'One free yoga class',
          stampsCost: 8,
          category: 'wellness',
          available: true,
        },
        {
          id: 'item-4',
          title: 'Book Voucher',
          description: '$20 voucher for our bookstore',
          stampsCost: 15,
          category: 'learning',
          available: true,
        },
        {
          id: 'item-5',
          title: 'Charity Donation',
          description: 'Donate to a local charity',
          stampsCost: 20,
          category: 'community',
          available: true,
        },
      ] as RedeemItem[],
      redemptions: [] as Redemption[],
    };
  }

  getCurrentUser(): User | null {
    const data = this.getData();
    return data.users[0] || null;
  }

  updateUserStamps(userId: string, stamps: number): void {
    const data = this.getData();
    const user = data.users.find((u: User) => u.id === userId);
    if (user) {
      user.stamps = stamps;
      this.saveData(data);
    }
  }

  getActions(): Action[] {
    return this.getData().actions;
  }

  getActionById(id: string): Action | null {
    return this.getData().actions.find((a: Action) => a.id === id) || null;
  }

  getTodaysSuggestedActions(): Action[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    return this.getData().actions
      .filter((a: Action) => a.suggestedFor === user.id)
      .slice(0, 3);
  }

  createAction(action: Omit<Action, 'id' | 'createdAt'>): Action {
    const data = this.getData();
    const newAction: Action = {
      ...action,
      id: `action-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    data.actions.push(newAction);
    this.saveData(data);
    return newAction;
  }

  getActionLogs(): ActionLog[] {
    return this.getData().actionLogs;
  }

  getUserActionLogs(userId: string): ActionLog[] {
    return this.getData().actionLogs.filter((log: ActionLog) => log.userId === userId);
  }

  completeAction(userId: string, actionId: string, stampsAwarded: number, imageUrl?: string): ActionLog {
    const data = this.getData();
    const log: ActionLog = {
      id: `log-${Date.now()}`,
      userId,
      actionId,
      completedAt: new Date().toISOString(),
      stampsAwarded,
      imageUrl,
    };
    data.actionLogs.push(log);
    
    // Update user stamps
    const user = data.users.find((u: User) => u.id === userId);
    if (user) {
      user.stamps += stampsAwarded;
    }
    
    this.saveData(data);
    return log;
  }

  getEvents(): Event[] {
    return this.getData().events;
  }

  getEventById(id: string): Event | null {
    return this.getData().events.find((e: Event) => e.id === id) || null;
  }

  createEvent(event: Omit<Event, 'id' | 'createdAt'>): Event {
    const data = this.getData();
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    data.events.push(newEvent);
    this.saveData(data);
    return newEvent;
  }

  getEventParticipations(): EventParticipation[] {
    return this.getData().eventParticipations;
  }

  getUserEventParticipations(userId: string): EventParticipation[] {
    return this.getData().eventParticipations.filter(
      (p: EventParticipation) => p.userId === userId
    );
  }

  joinEvent(userId: string, eventId: string): EventParticipation {
    const data = this.getData();
    const participation: EventParticipation = {
      id: `participation-${Date.now()}`,
      eventId,
      userId,
      joinedAt: new Date().toISOString(),
    };
    data.eventParticipations.push(participation);
    this.saveData(data);
    return participation;
  }

  completeEvent(userId: string, eventId: string, stampsAwarded: number, imageUrl?: string): EventParticipation {
    const data = this.getData();
    const participation = data.eventParticipations.find(
      (p: EventParticipation) => p.userId === userId && p.eventId === eventId
    );
    
    if (participation) {
      participation.completedAt = new Date().toISOString();
      participation.stampsAwarded = stampsAwarded;
      participation.imageUrl = imageUrl;
      
      // Update user stamps
      const user = data.users.find((u: User) => u.id === userId);
      if (user) {
        user.stamps += stampsAwarded;
      }
      
      this.saveData(data);
    }
    
    return participation;
  }

  getRedeemItems(): RedeemItem[] {
    return this.getData().redeemItems;
  }

  getRedeemItemById(id: string): RedeemItem | null {
    return this.getData().redeemItems.find((i: RedeemItem) => i.id === id) || null;
  }

  getRedemptions(): Redemption[] {
    return this.getData().redemptions;
  }

  getUserRedemptions(userId: string): Redemption[] {
    return this.getData().redemptions.filter((r: Redemption) => r.userId === userId);
  }

  redeemItem(userId: string, itemId: string, stampsCost: number): Redemption {
    const data = this.getData();
    const user = data.users.find((u: User) => u.id === userId);
    
    if (!user || user.stamps < stampsCost) {
      throw new Error('Insufficient stamps');
    }
    
    const redemption: Redemption = {
      id: `redemption-${Date.now()}`,
      userId,
      itemId,
      redeemedAt: new Date().toISOString(),
      stampsSpent: stampsCost,
      status: 'pending',
    };
    
    data.redemptions.push(redemption);
    user.stamps -= stampsCost;
    this.saveData(data);
    
    return redemption;
  }

  getOrgTotalStamps(orgId: string): number {
    const data = this.getData();
    return data.users
      .filter((u: User) => u.orgId === orgId)
      .reduce((sum: number, u: User) => sum + u.stamps, 0);
  }

  getOrgDomainBreakdown(orgId: string): Record<ActionDomain, number> {
    const data = this.getData();
    const orgUserIds = data.users
      .filter((u: User) => u.orgId === orgId)
      .map((u: User) => u.id);
    
    const breakdown: Record<ActionDomain, number> = {
      health: 0,
      environment: 0,
      community: 0,
      learning: 0,
      wellbeing: 0,
    };
    
    // Count action completions by domain
    data.actionLogs.forEach((log: ActionLog) => {
      if (orgUserIds.includes(log.userId)) {
        const action = data.actions.find((a: Action) => a.id === log.actionId);
        if (action) {
          breakdown[action.domain] += log.stampsAwarded;
        }
      }
    });
    
    // Count event completions by domain
    data.eventParticipations.forEach((p: EventParticipation) => {
      if (orgUserIds.includes(p.userId) && p.completedAt) {
        const event = data.events.find((e: Event) => e.id === p.eventId);
        if (event) {
          breakdown[event.domain] += p.stampsAwarded || 0;
        }
      }
    });
    
    return breakdown;
  }

  getOrgMonthlyTrend(orgId: string): Array<{ month: string; stamps: number }> {
    const data = this.getData();
    const orgUserIds = data.users
      .filter((u: User) => u.orgId === orgId)
      .map((u: User) => u.id);
    
    const monthlyData: Record<string, number> = {};
    
    // Aggregate action logs by month
    data.actionLogs.forEach((log: ActionLog) => {
      if (orgUserIds.includes(log.userId)) {
        const month = log.completedAt.substring(0, 7); // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + log.stampsAwarded;
      }
    });
    
    // Aggregate event completions by month
    data.eventParticipations.forEach((p: EventParticipation) => {
      if (orgUserIds.includes(p.userId) && p.completedAt) {
        const month = p.completedAt.substring(0, 7);
        monthlyData[month] = (monthlyData[month] || 0) + (p.stampsAwarded || 0);
      }
    });
    
    // Convert to array and sort
    return Object.entries(monthlyData)
      .map(([month, stamps]) => ({ month, stamps }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}

// Export singleton instance
export const dataLayer: DataLayer = new LocalStorageDataLayer();

