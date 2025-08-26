import { createTestHabit, createTestHabits, setupLocalStorage } from '@/test-utils';

describe('Test Setup Verification', () => {
  describe('createTestHabit', () => {
    it('should create a habit with default values', () => {
      const habit = createTestHabit();
      
      expect(habit).toHaveProperty('id');
      expect(habit.name).toBe('Test Habit');
      expect(habit.type).toBe('boolean');
      expect(habit.color).toBe('#3b82f6');
      expect(habit.target).toBe(1);
      expect(habit.isArchived).toBe(false);
      expect(habit.history).toEqual({});
    });

    it('should allow overriding default values', () => {
      const habit = createTestHabit({
        name: 'Custom Habit',
        type: 'measurable',
        target: 10,
        unit: 'minutes',
      });
      
      expect(habit.name).toBe('Custom Habit');
      expect(habit.type).toBe('measurable');
      expect(habit.target).toBe(10);
      expect(habit.unit).toBe('minutes');
    });
  });

  describe('createTestHabits', () => {
    it('should create multiple habits with different properties', () => {
      const habits = createTestHabits(3);
      
      expect(habits).toHaveLength(3);
      expect(habits[0].name).toBe('Test Habit 1');
      expect(habits[1].name).toBe('Test Habit 2');
      expect(habits[2].name).toBe('Test Habit 3');
      
      // Check alternating types
      expect(habits[0].type).toBe('boolean');
      expect(habits[1].type).toBe('measurable');
      expect(habits[2].type).toBe('boolean');
    });
  });

  describe('localStorage mocks', () => {
    it('should setup localStorage with data', () => {
      const testData = { key1: 'value1', key2: 'value2' };
      setupLocalStorage(testData);
      
      // These should work with our mocked localStorage
      expect(localStorage.getItem('key1')).toBe(JSON.stringify('value1'));
      expect(localStorage.getItem('key2')).toBe(JSON.stringify('value2'));
      expect(localStorage.getItem('nonexistent')).toBe(null);
    });
  });
});
