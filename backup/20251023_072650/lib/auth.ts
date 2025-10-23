// Mock authentication system for community module
// In a real implementation, this would integrate with your actual auth system

export interface User {
  id: string;
  name: string;
  email: string;
  orgMemberships: string[]; // Array of organization IDs
}

// Mock current user (in real implementation, this would come from session/auth)
export function getCurrentUser(): User | null {
  // Mock user with membership in org-1
  return {
    id: 'user-1',
    name: '管理者',
    email: 'admin@example.com',
    orgMemberships: ['org-1'], // User is a member of org-1
  };
}

export function isOrgMember(orgId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  return user.orgMemberships.includes(orgId);
}

export function requireOrgMembership(orgId: string): void {
  if (!isOrgMember(orgId)) {
    throw new Error('Unauthorized: Not a member of this organization');
  }
}

// Mock function to add user to organization
export function addUserToOrganization(orgId: string, userId: string): void {
  // In a real implementation, this would update the database
  console.log(`Adding user ${userId} to organization ${orgId}`);
}

// Mock function to remove user from organization
export function removeUserFromOrganization(orgId: string, userId: string): void {
  // In a real implementation, this would update the database
  console.log(`Removing user ${userId} from organization ${orgId}`);
}
