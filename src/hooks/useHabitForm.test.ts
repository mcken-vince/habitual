import { renderHook, act } from '@testing-library/react';
import { useHabitForm } from './useHabitForm';
import { createTestHabit } from '@/test-utils/test-data';

describe('useHabitForm', () => {
  it('should initialize with closed form and no initial habit', () => {
    const { result } = renderHook(() => useHabitForm());
    
    expect(result.current.habitFormOptions.open).toBe(false);
    expect(result.current.habitFormOptions.initialHabit).toBeUndefined();
  });

  it('should handle creating a new habit', () => {
    const { result } = renderHook(() => useHabitForm());
    
    act(() => {
      result.current.handleCreateHabit();
    });
    
    expect(result.current.habitFormOptions.open).toBe(true);
    expect(result.current.habitFormOptions.initialHabit).toBeUndefined();
  });

  it('should handle editing an existing habit', () => {
    const { result } = renderHook(() => useHabitForm());
    const testHabit = createTestHabit({ name: 'Test Habit' });
    
    act(() => {
      result.current.handleEditHabit(testHabit);
    });
    
    expect(result.current.habitFormOptions.open).toBe(true);
    expect(result.current.habitFormOptions.initialHabit).toEqual(testHabit);
  });

  it('should not open form when editing with undefined habit', () => {
    const { result } = renderHook(() => useHabitForm());
    
    act(() => {
      result.current.handleEditHabit(undefined);
    });
    
    expect(result.current.habitFormOptions.open).toBe(false);
    expect(result.current.habitFormOptions.initialHabit).toBeUndefined();
  });

  it('should reset the form', () => {
    const { result } = renderHook(() => useHabitForm());
    const testHabit = createTestHabit({ name: 'Test Habit' });
    
    // First, open the form with a habit
    act(() => {
      result.current.handleEditHabit(testHabit);
    });
    
    expect(result.current.habitFormOptions.open).toBe(true);
    expect(result.current.habitFormOptions.initialHabit).toEqual(testHabit);
    
    // Then reset
    act(() => {
      result.current.resetHabitForm();
    });
    
    expect(result.current.habitFormOptions.open).toBe(false);
    expect(result.current.habitFormOptions.initialHabit).toBeUndefined();
  });

  it('should handle multiple form interactions', () => {
    const { result } = renderHook(() => useHabitForm());
    const testHabit1 = createTestHabit({ name: 'Habit 1' });
    const testHabit2 = createTestHabit({ name: 'Habit 2' });
    
    // Create new habit
    act(() => {
      result.current.handleCreateHabit();
    });
    expect(result.current.habitFormOptions.open).toBe(true);
    expect(result.current.habitFormOptions.initialHabit).toBeUndefined();
    
    // Reset
    act(() => {
      result.current.resetHabitForm();
    });
    expect(result.current.habitFormOptions.open).toBe(false);
    
    // Edit habit 1
    act(() => {
      result.current.handleEditHabit(testHabit1);
    });
    expect(result.current.habitFormOptions.open).toBe(true);
    expect(result.current.habitFormOptions.initialHabit).toEqual(testHabit1);
    
    // Edit habit 2 (should replace habit 1)
    act(() => {
      result.current.handleEditHabit(testHabit2);
    });
    expect(result.current.habitFormOptions.open).toBe(true);
    expect(result.current.habitFormOptions.initialHabit).toEqual(testHabit2);
  });
});
