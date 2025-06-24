import { calculateHabitScore } from './scoring';
import type { Habit } from '@/types';

const MOCK_TODAY = new Date('2025-06-10T12:00:00Z');

function mockDate(date: Date) {
  // jest.spyOn(global, 'Date').mockImplementation(() => new Date(date));
  // For Date.now()
  jest.spyOn(Date, 'now').mockImplementation(() => date.getTime());
};

describe('calculateHabitScore', () => {
  beforeEach(() => {
    mockDate(MOCK_TODAY);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.skip('returns 100 for boolean daily habit with perfect completion', () => {
    const habit: Habit = {
      id: '1',
      name: 'Daily Boolean',
      type: 'boolean',
      target: 1,
      frequencyDays: 1,
      history: {},
      color: '#fff',
      createdAt: '2025-01-01',
    };
    // Fill history for scoring window (default 120 days)
    for (let i = 0; i < 120; i++) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i);
      habit.history[d.toISOString().slice(0, 10)] = 1;
    }
    expect(Math.round(calculateHabitScore(habit))).toBe(100);
  });

  it('returns less than 100 for boolean daily habit with missed days', () => {
    const habit: Habit = {
      id: '2',
      name: 'Daily Boolean Missed',
      type: 'boolean',
      target: 1,
      frequencyDays: 1,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    // Miss every 5th day
    for (let i = 0; i < 120; i++) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i);
      habit.history[d.toISOString().slice(0, 10)] = (i % 5 === 0 ? 0 : 1);
    }
    expect(calculateHabitScore(habit)).toBeLessThan(100);
    expect(calculateHabitScore(habit)).toBeGreaterThan(0);
  });

  it.skip('returns 100 for boolean weekly habit with perfect completion', () => {
    const habit: Habit = {
      id: '3',
      name: 'Weekly Boolean',
      type: 'boolean',
      target: 1,
      frequencyDays: 7,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    // One completion per week for 12 weeks
    for (let i = 0; i < 12; i++) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i * 7);
      habit.history[d.toISOString().slice(0, 10)] = 1;
    }
    expect(Math.round(calculateHabitScore(habit))).toBe(100);
  });

  it.skip('returns less than 100 for boolean weekly habit with missed weeks', () => {
    const habit: Habit = {
      id: '4',
      name: 'Weekly Boolean Missed',
      type: 'boolean',
      target: 1,
      frequencyDays: 7,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    // Miss every 3rd week
    for (let i = 0; i < 12; i++) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i * 7);
      habit.history[d.toISOString().slice(0, 10)] = (i % 3 === 0 ? 0 : 1);
    }
    expect(calculateHabitScore(habit)).toBeLessThan(100);
    expect(calculateHabitScore(habit)).toBeGreaterThan(0);
  });

  it.skip('returns 100 for measurable daily habit always meeting target', () => {
    const habit: Habit = {
      id: '5',
      name: 'Measurable Daily',
      type: 'measurable',
      target: 2,
      frequencyDays: 1,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    for (let i = 0; i < 120; i++) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i);
      habit.history[d.toISOString().slice(0, 10)] = 2;
    }
    expect(Math.round(calculateHabitScore(habit))).toBe(100);
  });

  it('returns less than 100 for measurable daily habit with partial completions', () => {
    const habit: Habit = {
      id: '6',
      name: 'Measurable Daily Partial',
      type: 'measurable',
      target: 2,
      frequencyDays: 1,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    for (let i = 0; i < 120; i++) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i);
      habit.history[d.toISOString().slice(0, 10)] = (i % 2 === 0 ? 1 : 2);
    }
    const score = calculateHabitScore(habit);
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThan(0);
  });

  it.skip('returns 100 for measurable weekly habit meeting target', () => {
    const habit: Habit = {
      id: '7',
      name: 'Measurable Weekly',
      type: 'measurable',
      target: 7,
      frequencyDays: 7,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    // 1 per day for 12 weeks
    for (let i = 0; i < 12 * 7; i++) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i);
      habit.history[d.toISOString().slice(0, 10)] = 1;
    }
    expect(Math.round(calculateHabitScore(habit))).toBe(100);
  });

  it('returns less than 100 for measurable weekly habit below target', () => {
    const habit: Habit = {
      id: '8',
      name: 'Measurable Weekly Below',
      type: 'measurable',
      target: 14,
      frequencyDays: 7,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    // 1 per day for 12 weeks (target is 14 per week)
    for (let i = 0; i < 12 * 7; i++) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i);
      habit.history[d.toISOString().slice(0, 10)] = 1;
    }
    expect(calculateHabitScore(habit)).toBeLessThan(100);
    expect(calculateHabitScore(habit)).toBeGreaterThan(0);
  });

  it('returns 0 for habit with empty history', () => {
    const habit: Habit = {
      id: '9',
      name: 'Empty History',
      type: 'boolean',
      target: 1,
      frequencyDays: 1,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    expect(calculateHabitScore(habit)).toBe(0);
  });

  it('handles missing frequencyDays (defaults to 7)', () => {
    const habit: Habit = {
      id: '10',
      name: 'No Frequency',
      type: 'boolean',
      target: 1,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    for (let i = 0; i < 84; i++) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i);
      habit.history[d.toISOString().slice(0, 10)] = 1;
    }
    expect(Math.round(calculateHabitScore(habit))).toBe(100);
  });

  it('score never exceeds 100', () => {
    const habit: Habit = {
      id: '11',
      name: 'Overachiever',
      type: 'measurable',
      target: 1,
      frequencyDays: 1,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    // Overachieve every day
    for (let i = 0; i < 120; i++) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i);
      habit.history[d.toISOString().slice(0, 10)] = 10;
    }
    expect(calculateHabitScore(habit)).toBeLessThanOrEqual(100);
  });

  it('returns 0 if no completions', () => {
    const habit: Habit = {
      id: '12',
      name: 'No Completions',
      type: 'measurable',
      target: 1,
      frequencyDays: 1,
      history: {},
      color: '#fff',
      createdAt: '2024-01-01',
    };
    expect(calculateHabitScore(habit)).toBe(0);
  });
});