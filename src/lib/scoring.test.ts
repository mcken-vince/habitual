import { calculateHabitScore } from './scoring';
import {
  createPerfectHabit,
  createPartialHabit,
  createRecentlyActiveHabit,
  createPatternHabit,
  createHabitWithCustomDate,
  setHistoryEntries,
  fillPeriod,
  getMeasurableHabit,
  getBooleanHabit
} from './test-utils';

describe('calculateHabitScore', () => {
  describe('Boolean Habits - Perfect Completion', () => {
    it('returns 100 for daily boolean habit with perfect completion', () => {
      const habit = createPerfectHabit({
        type: 'boolean',
        target: 1,
        frequencyDays: 1,
      });

      expect(Math.round(calculateHabitScore(habit))).toBeGreaterThanOrEqual(99);
    });

    it('returns 100 for weekly boolean habit with perfect completion', () => {
      const habit = createPerfectHabit({
        type: 'boolean',
        target: 1,
        frequencyDays: 7,
      });

      expect(Math.round(calculateHabitScore(habit))).toBe(100);
    });

    it('returns 100 for boolean habit requiring multiple completions per period', () => {
      const habit = createPerfectHabit({
        type: 'boolean',
        target: 3,
        frequencyDays: 7,
      });

      expect(Math.round(calculateHabitScore(habit))).toBeGreaterThanOrEqual(99);
    });
  });

  describe('Boolean Habits - Partial Completion', () => {
    it('returns ~80% score for daily boolean habit missing every 5th day', () => {
      const habit = createPatternHabit(
        [1, 1, 1, 1, 0], // Miss every 5th day
        {
          type: 'boolean',
          target: 1,
          frequencyDays: 1,
        }
      );

      const score = calculateHabitScore(habit);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThan(70);
    });

    it('returns ~67% score for weekly boolean habit missing every 3rd week', () => {
      const habit = createPatternHabit(
        [1, 1, 0], // Miss every 3rd week
        {
          type: 'boolean',
          target: 1,
          frequencyDays: 7,
        }
      );

      const score = calculateHabitScore(habit);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThan(50);
    });

    it('returns ~50% score for boolean habit achieving half the target', () => {
      const habit = createPartialHabit(0.5, {
        type: 'boolean',
        target: 4,
        frequencyDays: 7,
      });

      const score = calculateHabitScore(habit);
      expect(score).toBeGreaterThan(40);
      expect(score).toBeLessThan(60);
    });
  });

  describe('Measurable Habits - Perfect Completion', () => {
    it('returns 100 for measurable daily habit meeting target', () => {
      const habit = createPerfectHabit({
        type: 'measurable',
        target: 2,
        frequencyDays: 1,
      });

      expect(Math.round(calculateHabitScore(habit))).toBe(100);
    });

    it('returns 100 for measurable weekly habit meeting target', () => {
      const habit = createPerfectHabit({
        type: 'measurable',
        target: 7,
        frequencyDays: 7,
      });

      expect(Math.round(calculateHabitScore(habit))).toBe(100);
    });
  });

  describe('Measurable Habits - Partial Completion', () => {
    it('returns ~75% score for measurable habit achieving 75% of target', () => {
      const habit = createPartialHabit(0.75, {
        type: 'measurable',
        target: 2,
        frequencyDays: 1,
      });

      const score = calculateHabitScore(habit);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThan(60);
    });

    it('returns ~50% score for measurable weekly habit achieving half target', () => {
      const habit = createPartialHabit(0.5, {
        type: 'measurable',
        target: 14,
        frequencyDays: 7,
      });

      const score = calculateHabitScore(habit);
      expect(score).toBeLessThan(60);
      expect(score).toBeGreaterThan(40);
    });
  });

  describe('Measurable Habits - Over-Achievement', () => {
    it('caps score at 100 for measurable habit exceeding target', () => {
      const habit = getMeasurableHabit(1, 1);

      // Set values way above target for last 120 days
      setHistoryEntries(habit, Array.from({ length: 120 }, (_, i) => ({
        daysAgo: i,
        value: 10 // 10x the target
      })));

      const score = calculateHabitScore(habit);
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeGreaterThanOrEqual(99);
    });
  });

  describe('Edge Cases', () => {
    it('returns 0 for habit with empty history', () => {
        const habit = getBooleanHabit(1, 1);

      expect(calculateHabitScore(habit)).toBe(0);
    });

    it('returns 0 for habit with no target', () => {
      const habit = getMeasurableHabit(0, 7);

      // Add some values to history
      setHistoryEntries(habit, Array.from({ length: 84 }, (_, i) => ({
        daysAgo: i,
        value: 1
      })));

      expect(calculateHabitScore(habit)).toBe(0);
    });

    it('handles habits with very short frequency periods', () => {
      const habit = getBooleanHabit(1, 1);

      // Fill only first 5 days
      setHistoryEntries(habit, Array.from({ length: 5 }, (_, i) => ({
        daysAgo: i,
        value: 1
      })));

      const score = calculateHabitScore(habit);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(25);
    });

    it('handles habits with very long frequency periods (monthly)', () => {
      const habit = createPerfectHabit({
        type: 'boolean',
        target: 1,
        frequencyDays: 30,
      });

      const score = calculateHabitScore(habit);
      expect(Math.round(score)).toBeGreaterThanOrEqual(99);
    });
  });

  describe('Time-Based Weighting', () => {
    it('weights recent periods more heavily than older ones', () => {
      // Create two habits: one with recent completions, one with old completions
      const recentHabit = createRecentlyActiveHabit(9, {
        type: 'boolean',
        target: 1,
        frequencyDays: 7,
      });

      const oldHabit = getBooleanHabit(1, 7);
      // Fill only the oldest 9 periods (weeks 9-17)
      for (let i = 9; i < 18; i++) {
        fillPeriod(oldHabit, i, [1]);
      }

      const recentScore = calculateHabitScore(recentHabit);
      const oldScore = calculateHabitScore(oldHabit);

      expect(recentScore).toBeGreaterThan(oldScore);
    });
  });

  describe('Custom Reference Date', () => {
    it('calculates score correctly with custom reference date', () => {
      const customDate = new Date('2025-01-01T12:00:00Z');
      const habit = createHabitWithCustomDate(customDate, {
        type: 'boolean',
        target: 1,
        frequencyDays: 1,
      });

      const score = calculateHabitScore(habit, customDate);
      expect(Math.round(score)).toBe(100);
    });
  });

  describe('Complex Scenarios', () => {
    it('handles boolean habit with mixed performance patterns', () => {
      const habit = getBooleanHabit(2, 7);

      // Create a mixed pattern: good weeks, bad weeks, perfect weeks
      const pattern = [2, 1, 0, 2, 1, 2]; // Completions per week
      
      for (let week = 0; week < 18; week++) {
        const completions = pattern[week % pattern.length];
        const values = Array(7).fill(0);
        for (let i = 0; i < completions; i++) {
          values[i] = 1;
        }
        fillPeriod(habit, week, values);
      }

      const score = calculateHabitScore(habit);
      expect(score).toBeGreaterThan(60);
      expect(score).toBeLessThan(90);
    });

    it('handles measurable habit with irregular but sufficient values', () => {
      const habit = getMeasurableHabit(10, 7);

      // Irregular daily values that sum to weekly targets
      for (let week = 0; week < 18; week++) {
        const weekValues = [5, 2, 1, 0, 2, 0, 0]; // Sums to 10
        fillPeriod(habit, week, weekValues);
      }

      const score = calculateHabitScore(habit);
      expect(Math.round(score)).toBeGreaterThanOrEqual(99);
    });
  });
});
