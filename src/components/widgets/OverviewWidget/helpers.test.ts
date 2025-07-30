import { describe, it, expect } from '@jest/globals';
import { 
  calculateCurrentStreak, 
  calculateLongestStreak, 
  calculateTotalCompletions,
  getRecentActivity,
  formatCompletionCount,
  getActivityOpacity
} from './helpers';
import { toDateStringLocal } from '@/lib/dates';

describe('OverviewWidget helpers', () => {
  describe('calculateCurrentStreak', () => {
    it('returns 0 for empty history', () => {
      expect(calculateCurrentStreak({})).toBe(0);
    });

    it('counts streak including today if completed', () => {
      const today = toDateStringLocal(new Date());
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = toDateStringLocal(yesterday);
      
      const history = {
        [today]: 1,
        [yesterdayStr]: 1
      };
      
      expect(calculateCurrentStreak(history)).toBe(2);
    });

    it('counts streak from yesterday if today not completed', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = toDateStringLocal(yesterday);
      
      const dayBefore = new Date();
      dayBefore.setDate(dayBefore.getDate() - 2);
      const dayBeforeStr = toDateStringLocal(dayBefore);
      
      const history = {
        [yesterdayStr]: 1,
        [dayBeforeStr]: 1
      };
      
      expect(calculateCurrentStreak(history)).toBe(2);
    });

    it('returns 0 if no recent activity', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 5);
      const oldDateStr = toDateStringLocal(oldDate);
      
      const history = {
        [oldDateStr]: 1
      };
      
      expect(calculateCurrentStreak(history)).toBe(0);
    });
  });

  describe('calculateLongestStreak', () => {
    it('returns 0 for empty history', () => {
      expect(calculateLongestStreak({})).toBe(0);
    });

    it('finds the longest consecutive streak', () => {
      const history = {
        '2024-01-01': 1,
        '2024-01-02': 1,
        '2024-01-03': 1,
        '2024-01-05': 1,
        '2024-01-06': 1
      };
      
      expect(calculateLongestStreak(history)).toBe(3);
    });

    it('handles single day streak', () => {
      const history = {
        '2024-01-01': 1
      };
      
      expect(calculateLongestStreak(history)).toBe(1);
    });
  });

  describe('calculateTotalCompletions', () => {
    it('returns 0 for empty history', () => {
      expect(calculateTotalCompletions({})).toBe(0);
    });

    it('sums all completion values', () => {
      const history = {
        '2024-01-01': 2,
        '2024-01-02': 3,
        '2024-01-03': 1
      };
      
      expect(calculateTotalCompletions(history)).toBe(6);
    });
  });

  describe('getRecentActivity', () => {
    it('includes today in recent activity', () => {
      const today = toDateStringLocal(new Date());
      const history = {
        [today]: 1
      };
      
      const activity = getRecentActivity(history, 7);
      
      expect(activity).toHaveLength(7);
      expect(activity[activity.length - 1].date).toBe(today);
      expect(activity[activity.length - 1].completed).toBe(true);
    });

    it('returns correct number of days', () => {
      const activity = getRecentActivity({}, 30);
      expect(activity).toHaveLength(30);
    });

    it('marks uncompleted days correctly', () => {
      const activity = getRecentActivity({}, 7);
      
      activity.forEach(day => {
        expect(day.completed).toBe(false);
        expect(day.value).toBe(0);
      });
    });
  });

  describe('formatCompletionCount', () => {
    it('uses default text when no unit provided', () => {
      expect(formatCompletionCount(5)).toBe('5 completions');
    });

    it('handles singular units', () => {
      expect(formatCompletionCount(1, 'session')).toBe('1 session');
    });

    it('handles plural units', () => {
      expect(formatCompletionCount(5, 'session')).toBe('5 sessions');
    });

    it('handles units already ending in s', () => {
      expect(formatCompletionCount(5, 'minutes')).toBe('5 minutes');
    });
  });

  describe('getActivityOpacity', () => {
    it('returns 0.3 for zero value', () => {
      expect(getActivityOpacity(0, 10)).toBe(0.3);
    });

    it('returns 1 for value at or above target', () => {
      expect(getActivityOpacity(10, 10)).toBe(1);
      expect(getActivityOpacity(15, 10)).toBe(1);
    });

    it('scales opacity between 0.5 and 1 for partial completion', () => {
      expect(getActivityOpacity(5, 10)).toBe(0.75);
      expect(getActivityOpacity(2, 10)).toBe(0.6);
    });
  });
});
