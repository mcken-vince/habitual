import { renderHook, act } from '@testing-library/react';
import { useHabitSelection } from './useHabitSelection';
import { createTestHabit } from '@/test-utils/test-data';

describe('useHabitSelection', () => {
  it('should initialize with no selected habit', () => {
    const { result } = renderHook(() => useHabitSelection());
    
    expect(result.current.selectedListHabit).toBeNull();
  });

  it('should handle selecting a habit', () => {
    const { result } = renderHook(() => useHabitSelection());
    const testHabit = createTestHabit({ name: 'Test Habit' });
    
    act(() => {
      result.current.handleSelectListHabit(testHabit);
    });
    
    expect(result.current.selectedListHabit).toEqual(testHabit);
  });

  it('should handle deselecting a habit', () => {
    const { result } = renderHook(() => useHabitSelection());
    const testHabit = createTestHabit({ name: 'Test Habit' });
    
    // First select a habit
    act(() => {
      result.current.handleSelectListHabit(testHabit);
    });
    expect(result.current.selectedListHabit).toEqual(testHabit);
    
    // Then deselect
    act(() => {
      result.current.handleDeselectListHabit();
    });
    expect(result.current.selectedListHabit).toBeNull();
  });

  it('should handle selecting different habits', () => {
    const { result } = renderHook(() => useHabitSelection());
    const testHabit1 = createTestHabit({ name: 'Habit 1', id: 'habit-1' });
    const testHabit2 = createTestHabit({ name: 'Habit 2', id: 'habit-2' });
    
    // Select first habit
    act(() => {
      result.current.handleSelectListHabit(testHabit1);
    });
    expect(result.current.selectedListHabit).toEqual(testHabit1);
    
    // Select second habit (should replace first)
    act(() => {
      result.current.handleSelectListHabit(testHabit2);
    });
    expect(result.current.selectedListHabit).toEqual(testHabit2);
  });

  it('should handle selecting the same habit multiple times', () => {
    const { result } = renderHook(() => useHabitSelection());
    const testHabit = createTestHabit({ name: 'Test Habit' });
    
    // Select habit
    act(() => {
      result.current.handleSelectListHabit(testHabit);
    });
    expect(result.current.selectedListHabit).toEqual(testHabit);
    
    // Select same habit again
    act(() => {
      result.current.handleSelectListHabit(testHabit);
    });
    expect(result.current.selectedListHabit).toEqual(testHabit);
  });

  it('should handle multiple selection/deselection cycles', () => {
    const { result } = renderHook(() => useHabitSelection());
    const testHabit = createTestHabit({ name: 'Test Habit' });
    
    // Cycle 1
    act(() => {
      result.current.handleSelectListHabit(testHabit);
    });
    expect(result.current.selectedListHabit).toEqual(testHabit);
    
    act(() => {
      result.current.handleDeselectListHabit();
    });
    expect(result.current.selectedListHabit).toBeNull();
    
    // Cycle 2
    act(() => {
      result.current.handleSelectListHabit(testHabit);
    });
    expect(result.current.selectedListHabit).toEqual(testHabit);
    
    act(() => {
      result.current.handleDeselectListHabit();
    });
    expect(result.current.selectedListHabit).toBeNull();
  });
});
