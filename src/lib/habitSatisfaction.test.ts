import { isHabitSatisfiedOnDate } from './habitSatisfaction'
import * as dates from './dates'
import { Habit } from '@/types'

describe('isHabitSatisfiedOnDate', () => {
  // Always parse date string as midnight local for deterministic tests
  beforeAll(() => {
    jest.spyOn(dates, 'parseDateStringLocal').mockImplementation((str: string) => {
      const [y, m, d] = str.split('-').map(Number)
      return new Date(y, m - 1, d, 0, 0, 0, 0)
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('returns true when completions meet target for frequencyDays=1', () => {
    const habit: Habit = {
      frequencyDays: 1,
      target: 1,
      history: { '2024-06-10': 1 },
      color: 'blue',
      name: 'Test Habit',
      id: '1',
      createdAt: '2025-06-24',
      type: 'boolean',
    }
    expect(isHabitSatisfiedOnDate(habit, '2024-06-10')).toBe(true)
  })

  it('returns false when completions below target for frequencyDays=1', () => {
    const habit: Habit = {
      frequencyDays: 1,
      target: 2,
      history: { '2024-06-10': 1 },
      color: 'blue',
      name: 'Test Habit',
      id: '1',
      createdAt: '2025-06-24',
      type: 'measurable',
    }
    expect(isHabitSatisfiedOnDate(habit, '2024-06-10')).toBe(false)
  })

  it('sums completions over frequencyDays window', () => {
    const habit: Habit = {
      frequencyDays: 3,
      target: 3,
      history: {
        '2024-06-08': 1,
        '2024-06-09': 1,
        '2024-06-10': 1
      },
      color: 'blue',
      name: 'Test Habit',
      id: '1',
      createdAt: '2025-06-24',
      type: 'measurable',
    }
    expect(isHabitSatisfiedOnDate(habit, '2024-06-10')).toBe(true)
  })

  it('returns false if sum in window is below target', () => {
    const habit: Habit = {
      frequencyDays: 3,
      target: 4,
      history: {
        '2024-06-08': 1,
        '2024-06-09': 1,
        '2024-06-10': 1
      },
      color: 'blue',
      name: 'Test Habit',
      id: '1',
      createdAt: '2025-06-24',
      type: 'measurable',
    }
    expect(isHabitSatisfiedOnDate(habit, '2024-06-10')).toBe(false)
  })

  it('ignores completions outside the window', () => {
    const habit: Habit = {
      frequencyDays: 2,
      target: 2,
      history: {
        '2024-06-08': 5, // outside window
        '2024-06-09': 1,
        '2024-06-10': 1
      },
      color: 'blue',
      name: 'Test Habit',
      id: '2',
      createdAt: '2025-06-24',
      type: 'measurable',
    }
    expect(isHabitSatisfiedOnDate(habit, '2024-06-10')).toBe(true)
  })

  it('handles missing frequencyDays (defaults to 1)', () => {
    const habit: Habit = {
      history: { '2024-06-10': 1 },
      color: 'blue',
      name: 'Test Habit',
      id: '3',
      createdAt: '2025-06-24',
      type: 'boolean',
      target: 1,
    }
    expect(isHabitSatisfiedOnDate(habit, '2024-06-10')).toBe(true)
  })

  it('returns false if no completions in window', () => {
    const habit: Habit = {
      frequencyDays: 2,
      target: 1,
      history: {},
      color: 'blue',
      name: 'Test Habit',
      id: '4',
      createdAt: '2025-06-24',
      type: 'boolean',
    }
    expect(isHabitSatisfiedOnDate(habit, '2024-06-10')).toBe(false)
  })

  it('handles missing days in window (treats as 0)', () => {
    const habit: Habit = {
      frequencyDays: 3,
      target: 2,
      history: {
        '2024-06-08': 1,
        // '2024-06-09' missing
        '2024-06-10': 1
      },
      color: 'blue',
      name: 'Test Habit',
      id: '5',
      createdAt: '2025-06-24',
      type: 'measurable',
    }
    expect(isHabitSatisfiedOnDate(habit, '2024-06-10')).toBe(true)
  })

  it('works for target > sum in window', () => {
    const habit: Habit = {
      frequencyDays: 2,
      target: 3,
      history: {
        '2024-06-09': 1,
        '2024-06-10': 1
      },
      color: 'blue',
      name: 'Test Habit',
      id: '6',
      createdAt: '2025-06-24',
      type: 'measurable',
    }
    expect(isHabitSatisfiedOnDate(habit, '2024-06-10')).toBe(false)
  })

  it('works for frequencyDays = 1, target = 1, history = 0', () => {
    const habit: Habit = {
      frequencyDays: 1,
      target: 1,
      history: { '2024-06-10': 0 },
      color: 'blue',
      name: 'Test Habit',
      id: '7',
      createdAt: '2025-06-24',
      type: 'boolean',
    }
    expect(isHabitSatisfiedOnDate(habit, '2024-06-10')).toBe(false)
  })
})