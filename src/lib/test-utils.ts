import { Habit } from "@/types";
import { toDateStringLocal } from "./dates";

type TestHabit = Habit & { target: number; frequencyDays: number };

export const getHabit = (habit: Partial<Habit>): TestHabit => {
  return {
    id: habit.id || "test-habit",
    name: habit.name || "Test Habit",
    type: habit.type || "boolean",
    target: habit.target || 1,
    frequencyDays: habit.frequencyDays || 7,
    history: habit.history || {},
    createdAt: habit.createdAt || new Date().toISOString(),
    order: habit.order || 0,
    color: habit.color || "#000000",
    isArchived: habit.isArchived || false,
  }
}

export const getBooleanHabit = (target: number, frequencyDays: number, overrides: Partial<Habit> = {}): TestHabit => {
  return getHabit({
    type: 'boolean',
    target,
    frequencyDays,
    ...overrides
  });
}

export const getMeasurableHabit = (target: number, frequencyDays: number, overrides: Partial<Habit> = {}): TestHabit => {
  return getHabit({
    type: 'measurable',
    target,
    frequencyDays,
    ...overrides
  });
}

export const fillHistory = (habit: TestHabit, days: number, value: number, getValue?: (index: number) => number) => {
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    habit.history[toDateStringLocal(d)] = getValue ? getValue(i) : value;
  }
}

// Enhanced utilities for more specific testing scenarios

/**
 * Creates a habit with perfect completion history for the specified number of periods
 */
export const createPerfectHabit = (overrides: Partial<Habit> = {}): TestHabit => {
  const habit = getHabit(overrides);
  const periodsCount = Math.max(12, Math.ceil(120 / habit.frequencyDays));
  
  fillPerfectHistory(habit, periodsCount);
  
  return habit;
};

/**
 * Creates a habit with partial completion history
 */
export const createPartialHabit = (completionRate: number, overrides: Partial<Habit> = {}): TestHabit => {
  const habit = getHabit(overrides);
  const periodsCount = Math.max(12, Math.ceil(120 / habit.frequencyDays));
  
  fillPartialHistory(habit, periodsCount, completionRate);
  
  return habit;
};

/**
 * Creates a habit with weighted history (recent periods filled, older periods empty)
 */
export const createRecentlyActiveHabit = (activePeriods: number, overrides: Partial<Habit> = {}): TestHabit => {
  const habit = getHabit(overrides);
  const totalPeriods = Math.max(12, Math.ceil(120 / habit.frequencyDays));
  
  fillRecentHistory(habit, activePeriods, totalPeriods);
  
  return habit;
};

/**
 * Creates a habit with pattern-based history (e.g., miss every nth period)
 */
export const createPatternHabit = (pattern: number[], overrides: Partial<Habit> = {}): TestHabit => {
  const habit = getHabit(overrides);
  const periodsCount = Math.max(12, Math.ceil(120 / habit.frequencyDays));
  
  fillPatternHistory(habit, pattern, periodsCount);
  
  return habit;
};

/**
 * Creates a habit with custom reference date and fills history backward from it
 */
export const createHabitWithCustomDate = (referenceDate: Date, overrides: Partial<Habit> = {}): TestHabit => {
  const habit = getHabit(overrides);
  const periodsCount = Math.max(12, Math.ceil(120 / habit.frequencyDays));
  const totalDays = periodsCount * habit.frequencyDays;
  
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(referenceDate);
    d.setDate(referenceDate.getDate() - i);
    const dateStr = toDateStringLocal(d);
    habit.history[dateStr] = habit.target;
  }
  return habit;
};

// Private helper functions

function fillPerfectHistory(habit: TestHabit, periodsCount: number): void {
  const totalDays = periodsCount * habit.frequencyDays;
  
  for (let i = 0; i < totalDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = toDateStringLocal(d);
    
    if (habit.type === 'boolean') {
      const dayInPeriod = i % habit.frequencyDays;
      habit.history[dateStr] = dayInPeriod < habit.target ? 1 : 0;
    } else {
      const valuePerDay = habit.target / habit.frequencyDays;
      habit.history[dateStr] = valuePerDay;
    }
  }
}

function fillPartialHistory(habit: TestHabit, periodsCount: number, completionRate: number): void {
  const totalDays = periodsCount * habit.frequencyDays;
  
  for (let i = 0; i < totalDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = toDateStringLocal(d);
    
    if (habit.type === 'boolean') {
      const completionsPerPeriod = Math.round(habit.target * completionRate);
      const dayInPeriod = i % habit.frequencyDays;
      habit.history[dateStr] = dayInPeriod < completionsPerPeriod ? 1 : 0;
    } else {
      const valuePerDay = (habit.target * completionRate) / habit.frequencyDays;
      habit.history[dateStr] = valuePerDay;
    }
  }
}

function fillRecentHistory(habit: TestHabit, activePeriods: number, totalPeriods: number): void {
  const totalDays = totalPeriods * habit.frequencyDays;
  const activeDays = activePeriods * habit.frequencyDays;
  
  for (let i = 0; i < totalDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = toDateStringLocal(d);
    
    if (i < activeDays) {
      if (habit.type === 'boolean') {
        const dayInPeriod = i % habit.frequencyDays;
        habit.history[dateStr] = dayInPeriod < habit.target ? 1 : 0;
      } else {
        const valuePerDay = habit.target / habit.frequencyDays;
        habit.history[dateStr] = valuePerDay;
      }
    } else {
      habit.history[dateStr] = 0;
    }
  }
}

function fillPatternHistory(habit: TestHabit, pattern: number[], periodsCount: number): void {
  const totalDays = periodsCount * habit.frequencyDays;
  
  for (let i = 0; i < totalDays; i++) {
    const periodIndex = Math.floor(i / habit.frequencyDays);
    const patternValue = pattern[periodIndex % pattern.length];
    
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = toDateStringLocal(d);
    
    if (habit.type === 'boolean') {
      const dayInPeriod = i % habit.frequencyDays;
      if (patternValue > 0) {
        habit.history[dateStr] = dayInPeriod < Math.min(patternValue, habit.target) ? 1 : 0;
      } else {
        habit.history[dateStr] = 0;
      }
    } else {
      habit.history[dateStr] = (patternValue * habit.target) / habit.frequencyDays;
    }
  }
}

// Additional utilities for testing specific scenarios

/**
 * Sets multiple history entries at once with a callback
 */
export const setHistoryEntries = (habit: TestHabit, entries: Array<{ daysAgo: number; value: number }>, referenceDate?: Date): void => {
  const baseDate = referenceDate || new Date();
  
  entries.forEach(({ daysAgo, value }) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - daysAgo);
    const dateStr = toDateStringLocal(d);
    habit.history[dateStr] = value;
  });
};

/**
 * Fills a specific period with values
 */
export const fillPeriod = (habit: TestHabit, periodIndex: number, values: number[], referenceDate?: Date): void => {
  const baseDate = referenceDate || new Date();
  const startDay = periodIndex * habit.frequencyDays;
  
  values.forEach((value, dayOffset) => {
    if (dayOffset < habit.frequencyDays) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() - startDay - dayOffset);
      const dateStr = toDateStringLocal(d);
      habit.history[dateStr] = value;
    }
  });
};
