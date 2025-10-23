'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Mock data types (in real implementation, these would come from your database)
interface Organization {
  id: string;
  name: string;
  description: string;
  product: 'business' | 'community';
  createdAt: string;
}

interface Place {
  id: string;
  name: string;
  description: string;
  orgId: string;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  time: string;
  place: string;
  orgId: string;
  target_star_count: number;
  public_id: string;
  status: 'active' | 'completed';
  createdAt: string;
}

interface ActionPackage {
  id: string;
  name: string;
  description: string;
  actions: Array<{
    id: string;
    title: string;
    description: string;
    value: number;
  }>;
}

// Mock data storage (in real implementation, this would be database operations)
let mockOrganizations: Organization[] = [];
let mockPlaces: Place[] = [];
let mockEvents: Event[] = [];
let mockActionPackages: ActionPackage[] = [
  {
    id: 'pkg-1',
    name: 'Environmental Actions',
    description: '環境保護に関するアクション',
    actions: [
      { id: 'action-1', title: 'ゴミを拾う', description: '公園内のゴミを10個以上拾ってください', value: 1 },
      { id: 'action-2', title: '植物に水をやる', description: '植木鉢や花壇の植物に水をやってください', value: 1 },
      { id: 'action-3', title: '環境教育に参加', description: '環境保護についての短いセッションに参加してください', value: 2 },
    ],
  },
  {
    id: 'pkg-2',
    name: 'Health & Wellness Actions',
    description: '健康とウェルネスに関するアクション',
    actions: [
      { id: 'action-4', title: '散歩する', description: '30分間の散歩をしてください', value: 1 },
      { id: 'action-5', title: '水分補給', description: '1日2リットルの水を飲んでください', value: 1 },
      { id: 'action-6', title: '瞑想する', description: '10分間の瞑想をしてください', value: 2 },
    ],
  },
];

// Generate a random public ID
function generatePublicId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Organization Actions
export async function createOrganization(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const theme = formData.get('theme') as string;

  if (!name || !description) {
    throw new Error('Name and description are required');
  }

  const newOrg: Organization = {
    id: `org-${Date.now()}`,
    name,
    description,
    product: 'community',
    createdAt: new Date().toISOString(),
  };

  mockOrganizations.push(newOrg);
  
  revalidatePath('/community/dashboard');
  redirect(`/community/org/${newOrg.id}`);
}

export async function getOrganizations(): Promise<Organization[]> {
  return mockOrganizations;
}

export async function getOrganization(orgId: string): Promise<Organization | null> {
  return mockOrganizations.find(org => org.id === orgId) || null;
}

// Place Actions
export async function createPlace(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const orgId = formData.get('orgId') as string;

  if (!name || !description || !orgId) {
    throw new Error('Name, description, and orgId are required');
  }

  const newPlace: Place = {
    id: `place-${Date.now()}`,
    name,
    description,
    orgId,
    createdAt: new Date().toISOString(),
  };

  mockPlaces.push(newPlace);
  
  revalidatePath(`/community/org/${orgId}`);
  redirect(`/community/org/${orgId}`);
}

export async function getPlaces(orgId: string): Promise<Place[]> {
  return mockPlaces.filter(place => place.orgId === orgId);
}

// Event Actions
export async function createEvent(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const time = formData.get('time') as string;
  const place = formData.get('place') as string;
  const orgId = formData.get('orgId') as string;
  const targetStarCount = parseInt(formData.get('target_star_count') as string);
  const packageId = formData.get('packageId') as string;

  if (!title || !description || !time || !place || !orgId || !targetStarCount || !packageId) {
    throw new Error('All fields are required');
  }

  const newEvent: Event = {
    id: `event-${Date.now()}`,
    title,
    description,
    time,
    place,
    orgId,
    target_star_count: targetStarCount,
    public_id: generatePublicId(),
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  mockEvents.push(newEvent);
  
  revalidatePath(`/community/org/${orgId}`);
  redirect(`/community/org/${orgId}/events/${newEvent.id}`);
}

export async function getEvents(orgId: string): Promise<Event[]> {
  return mockEvents.filter(event => event.orgId === orgId);
}

export async function getEvent(eventId: string): Promise<Event | null> {
  return mockEvents.find(event => event.id === eventId) || null;
}

export async function getEventByPublicId(publicId: string): Promise<Event | null> {
  return mockEvents.find(event => event.public_id === publicId) || null;
}

// Action Package Actions
export async function getActionPackages(): Promise<ActionPackage[]> {
  return mockActionPackages;
}

export async function getActionPackage(packageId: string): Promise<ActionPackage | null> {
  return mockActionPackages.find(pkg => pkg.id === packageId) || null;
}

// Scan Actions
export async function recordActionScan(
  publicId: string,
  actions: string[],
  meta?: Record<string, any>
) {
  const event = await getEventByPublicId(publicId);
  
  if (!event) {
    throw new Error('Event not found');
  }

  // In a real implementation, you would:
  // 1. Validate the actions against the event's action package
  // 2. Create action records in the database
  // 3. Create star entries
  // 4. Update event progress

  const actionId = `action-${Date.now()}`;
  const starId = `star-${Date.now()}`;
  const starsAwarded = actions.length; // Simple calculation

  // Mock: Update event progress (in real implementation, this would be a database update)
  const eventIndex = mockEvents.findIndex(e => e.id === event.id);
  if (eventIndex !== -1) {
    // Simulate updating star count
    // mockEvents[eventIndex].current_stars += starsAwarded;
  }

  revalidatePath(`/community/org/${event.orgId}/events/${event.id}`);
  
  return {
    actionId,
    starId,
    starsAwarded,
    eventId: event.id,
  };
}

// Utility Actions
export async function getEventProgress(eventId: string) {
  const event = await getEvent(eventId);
  
  if (!event) {
    return null;
  }

  // In a real implementation, you would calculate this from the database
  const currentStars = Math.floor(Math.random() * event.target_star_count);
  const progress = (currentStars / event.target_star_count) * 100;

  return {
    eventId,
    currentStars,
    targetStars: event.target_star_count,
    progress,
    isComplete: currentStars >= event.target_star_count,
  };
}

export async function getConstellationData(eventId: string) {
  const event = await getEvent(eventId);
  
  if (!event) {
    return null;
  }

  // In a real implementation, you would generate this from actual star data
  return {
    eventId,
    title: event.title,
    stars: [
      { id: 'star-1', x: 100, y: 150, value: 1, completedAt: new Date().toISOString() },
      { id: 'star-2', x: 200, y: 100, value: 2, completedAt: new Date().toISOString() },
      { id: 'star-3', x: 150, y: 200, value: 1, completedAt: new Date().toISOString() },
    ],
    connections: [
      { from: 'star-1', to: 'star-2' },
      { from: 'star-2', to: 'star-3' },
    ],
    totalStars: 3,
    targetStars: event.target_star_count,
    progress: 15, // percentage
  };
}
