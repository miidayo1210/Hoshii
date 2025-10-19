/**
 * Tests for Hoshii Data Layer
 * 
 * To run tests: npm test
 * 
 * Note: These tests require Jest configuration.
 * For a quick validation, you can also test manually in the browser console.
 */

import { dataLayer } from '@/lib/data';

describe('Data Layer - Points System', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('Action Completion', () => {
    it('should award points when completing an action', () => {
      const user = dataLayer.getCurrentUser();
      expect(user).not.toBeNull();
      
      if (user) {
        const initialPoints = user.points;
        const action = dataLayer.getActions()[0];
        
        dataLayer.completeAction(user.id, action.id, action.pointsValue);
        
        const updatedUser = dataLayer.getCurrentUser();
        expect(updatedUser?.points).toBe(initialPoints + action.pointsValue);
      }
    });

    it('should create an action log with correct points', () => {
      const user = dataLayer.getCurrentUser();
      const action = dataLayer.getActions()[0];
      
      if (user) {
        const log = dataLayer.completeAction(user.id, action.id, action.pointsValue);
        
        expect(log.userId).toBe(user.id);
        expect(log.actionId).toBe(action.id);
        expect(log.pointsAwarded).toBe(action.pointsValue);
        expect(log.completedAt).toBeDefined();
      }
    });

    it('should track multiple action completions', () => {
      const user = dataLayer.getCurrentUser();
      if (!user) return;

      const actions = dataLayer.getActions().slice(0, 3);
      const totalPoints = actions.reduce((sum, a) => sum + a.pointsValue, 0);
      const initialPoints = user.points;

      actions.forEach((action) => {
        dataLayer.completeAction(user.id, action.id, action.pointsValue);
      });

      const updatedUser = dataLayer.getCurrentUser();
      expect(updatedUser?.points).toBe(initialPoints + totalPoints);
    });
  });

  describe('Event Participation', () => {
    it('should allow user to join an event', () => {
      const user = dataLayer.getCurrentUser();
      const event = dataLayer.getEvents()[0];
      
      if (user) {
        const participation = dataLayer.joinEvent(user.id, event.id);
        
        expect(participation.userId).toBe(user.id);
        expect(participation.eventId).toBe(event.id);
        expect(participation.joinedAt).toBeDefined();
        expect(participation.completedAt).toBeUndefined();
      }
    });

    it('should award points when completing an event', () => {
      const user = dataLayer.getCurrentUser();
      const event = dataLayer.getEvents()[0];
      
      if (user) {
        const initialPoints = user.points;
        
        dataLayer.joinEvent(user.id, event.id);
        dataLayer.completeEvent(user.id, event.id, event.points);
        
        const updatedUser = dataLayer.getCurrentUser();
        expect(updatedUser?.points).toBe(initialPoints + event.points);
      }
    });

    it('should track event completion status', () => {
      const user = dataLayer.getCurrentUser();
      const event = dataLayer.getEvents()[0];
      
      if (user) {
        dataLayer.joinEvent(user.id, event.id);
        const participation = dataLayer.completeEvent(user.id, event.id, event.points);
        
        expect(participation.completedAt).toBeDefined();
        expect(participation.pointsAwarded).toBe(event.points);
      }
    });
  });

  describe('Redemption System', () => {
    it('should deduct points when redeeming an item', () => {
      const user = dataLayer.getCurrentUser();
      const item = dataLayer.getRedeemItems()[0];
      
      if (user && user.points >= item.pointsCost) {
        const initialPoints = user.points;
        
        dataLayer.redeemItem(user.id, item.id, item.pointsCost);
        
        const updatedUser = dataLayer.getCurrentUser();
        expect(updatedUser?.points).toBe(initialPoints - item.pointsCost);
      }
    });

    it('should prevent redemption with insufficient points', () => {
      const user = dataLayer.getCurrentUser();
      
      if (user) {
        const expensiveItem = {
          id: 'expensive',
          pointsCost: user.points + 1000,
        };
        
        expect(() => {
          dataLayer.redeemItem(user.id, expensiveItem.id, expensiveItem.pointsCost);
        }).toThrow('Insufficient points');
      }
    });

    it('should create redemption record', () => {
      const user = dataLayer.getCurrentUser();
      const item = dataLayer.getRedeemItems().find((i) => user && i.pointsCost <= user.points);
      
      if (user && item) {
        const redemption = dataLayer.redeemItem(user.id, item.id, item.pointsCost);
        
        expect(redemption.userId).toBe(user.id);
        expect(redemption.itemId).toBe(item.id);
        expect(redemption.pointsSpent).toBe(item.pointsCost);
        expect(redemption.status).toBe('pending');
      }
    });
  });

  describe('Organization Analytics', () => {
    it('should calculate organization total points', () => {
      const orgTotal = dataLayer.getOrgTotalPoints('demo');
      expect(typeof orgTotal).toBe('number');
      expect(orgTotal).toBeGreaterThanOrEqual(0);
    });

    it('should provide domain breakdown', () => {
      const breakdown = dataLayer.getOrgDomainBreakdown('demo');
      
      expect(breakdown).toHaveProperty('health');
      expect(breakdown).toHaveProperty('environment');
      expect(breakdown).toHaveProperty('community');
      expect(breakdown).toHaveProperty('learning');
      expect(breakdown).toHaveProperty('wellbeing');
      
      Object.values(breakdown).forEach((value) => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    it('should track monthly trends', () => {
      const user = dataLayer.getCurrentUser();
      if (!user) return;

      // Complete some actions
      const actions = dataLayer.getActions().slice(0, 2);
      actions.forEach((action) => {
        dataLayer.completeAction(user.id, action.id, action.pointsValue);
      });

      const trend = dataLayer.getOrgMonthlyTrend('demo');
      
      expect(Array.isArray(trend)).toBe(true);
      if (trend.length > 0) {
        expect(trend[0]).toHaveProperty('month');
        expect(trend[0]).toHaveProperty('points');
        expect(typeof trend[0].points).toBe('number');
      }
    });

    it('should update domain breakdown after action completion', () => {
      const user = dataLayer.getCurrentUser();
      if (!user) return;

      const initialBreakdown = dataLayer.getOrgDomainBreakdown('demo');
      const healthAction = dataLayer.getActions().find((a) => a.domain === 'health');
      
      if (healthAction) {
        dataLayer.completeAction(user.id, healthAction.id, healthAction.pointsValue);
        const updatedBreakdown = dataLayer.getOrgDomainBreakdown('demo');
        
        expect(updatedBreakdown.health).toBe(initialBreakdown.health + healthAction.pointsValue);
      }
    });
  });

  describe('Data Persistence', () => {
    it('should persist data in localStorage', () => {
      if (typeof window === 'undefined') return;

      const user = dataLayer.getCurrentUser();
      const action = dataLayer.getActions()[0];
      
      if (user) {
        dataLayer.completeAction(user.id, action.id, action.pointsValue);
        
        // Check localStorage directly
        const stored = localStorage.getItem('hoshii_data');
        expect(stored).not.toBeNull();
        
        if (stored) {
          const data = JSON.parse(stored);
          expect(data.actionLogs.length).toBeGreaterThan(0);
        }
      }
    });
  });
});

// Manual testing guide (for browser console):
/*
// Test action completion
const user = dataLayer.getCurrentUser();
const action = dataLayer.getActions()[0];
console.log('Initial points:', user.points);
dataLayer.completeAction(user.id, action.id, action.pointsValue);
console.log('After action:', dataLayer.getCurrentUser().points);

// Test event completion
const event = dataLayer.getEvents()[0];
dataLayer.joinEvent(user.id, event.id);
dataLayer.completeEvent(user.id, event.id, event.points);
console.log('After event:', dataLayer.getCurrentUser().points);

// Test redemption
const item = dataLayer.getRedeemItems()[0];
console.log('Can afford?', user.points >= item.pointsCost);
dataLayer.redeemItem(user.id, item.id, item.pointsCost);
console.log('After redemption:', dataLayer.getCurrentUser().points);

// Test analytics
console.log('Org total:', dataLayer.getOrgTotalPoints('demo'));
console.log('Domain breakdown:', dataLayer.getOrgDomainBreakdown('demo'));
console.log('Monthly trend:', dataLayer.getOrgMonthlyTrend('demo'));
*/

export {};


