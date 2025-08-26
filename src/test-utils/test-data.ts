import { Habit } from '@/types/habit';
import { FrequencyType } from '@/types/frequency';

/**
 * Factory function to create test habits with sensible defaults
 */
export const createTestHabit = (overrides: Partial<Habit> = {}): Habit => {
  const defaultHabit: Habit = {
    id: `test-habit-${Date.now()}`,
    name: 'Test Habit',
    description: 'A test habit for testing purposes',
    type: 'boolean',
    color: '#3b82f6',
    target: 1,
    unit: '',
    history: {},
    frequencyDays: 1,
    isArchived: false,
    createdAt: new Date().toISOString(),
    order: 0,
  };

  return { ...defaultHabit, ...overrides };
};

/**
 * Factory function to create test habit history entry
 */
export const createTestHistoryEntry = (
  date: string = new Date().toISOString().split('T')[0],
  value: number = 1
): Record<string, number> => {
  return { [date]: value };
};

/**
 * Factory function to create test frequencies
 */
export const createTestFrequency = (
  type: FrequencyType = 'everyDay'
): FrequencyType => {
  return type;
};

/**
 * Create multiple test habits with different properties
 */
export const createTestHabits = (count: number = 3): Habit[] => {
  return Array.from({ length: count }, (_, index) =>
    createTestHabit({
      id: `test-habit-${index}`,
      name: `Test Habit ${index + 1}`,
      order: index,
      color: ['#3b82f6', '#ef4444', '#10b981'][index % 3],
      type: index % 2 === 0 ? 'boolean' : 'measurable',
      target: index % 2 === 0 ? 1 : 10,
      unit: index % 2 === 0 ? '' : 'minutes',
    })
  );
};

/**
 * Create test habits with history for testing charts and widgets
 */
export const createTestHabitsWithHistory = (
  habitCount: number = 3,
  daysBack: number = 30
): Habit[] => {
  const habits = createTestHabits(habitCount);
  
  return habits.map(habit => {
    const history: Record<string, number> = {};
    
    for (let i = 0; i < daysBack; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Simulate some randomness in completions
      const isCompleted = Math.random() > 0.3; // 70% completion rate
      
      if (isCompleted) {
        history[dateString] = habit.type === 'boolean' ? 1 : Math.floor(Math.random() * habit.target * 1.5);
      }
    }
    
    return { ...habit, history };
  });
};
