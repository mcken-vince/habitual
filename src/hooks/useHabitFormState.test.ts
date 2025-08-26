import { renderHook, act } from '@testing-library/react';
import { useHabitFormState } from './useHabitFormState';
import { createTestHabit } from '@/test-utils/test-data';

describe('useHabitFormState', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default values when no initial habit provided', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      expect(result.current.habitType).toBeNull();
      expect(result.current.habit).toEqual({
        name: "",
        description: "",
        type: "boolean",
        target: 1,
        unit: "",
        frequencyDays: undefined,
        color: "#FF0000",
        isArchived: false,
      });
      expect(result.current.errors).toEqual({});
    });

    it('should initialize with provided initial habit', () => {
      const initialHabit = createTestHabit({
        name: 'Test Habit',
        type: 'measurable',
        target: 10,
        unit: 'minutes'
      });
      
      const { result } = renderHook(() => useHabitFormState(mockOnSave, initialHabit));
      
      expect(result.current.habitType).toBe('measurable');
      expect(result.current.habit.name).toBe('Test Habit');
      expect(result.current.habit.type).toBe('measurable');
      expect(result.current.habit.target).toBe(10);
      expect(result.current.habit.unit).toBe('minutes');
    });
  });

  describe('type selection', () => {
    it('should handle boolean type selection', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.handleTypeSelection('boolean');
      });
      
      expect(result.current.habitType).toBe('boolean');
      expect(result.current.habit.type).toBe('boolean');
      expect(result.current.habit.target).toBe(1);
      expect(result.current.habit.unit).toBe('');
      expect(result.current.habit.frequencyDays).toBeUndefined();
    });

    it('should handle measurable type selection', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.handleTypeSelection('measurable');
      });
      
      expect(result.current.habitType).toBe('measurable');
      expect(result.current.habit.type).toBe('measurable');
      expect(result.current.habit.frequencyDays).toBeUndefined();
    });

    it('should reset type-specific fields when changing from measurable to boolean', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      // Set measurable first
      act(() => {
        result.current.handleTypeSelection('measurable');
        result.current.updateHabit({ target: 10, unit: 'km' });
      });
      
      expect(result.current.habit.target).toBe(10);
      expect(result.current.habit.unit).toBe('km');
      
      // Change to boolean
      act(() => {
        result.current.handleTypeSelection('boolean');
      });
      
      expect(result.current.habit.target).toBe(1);
      expect(result.current.habit.unit).toBe('');
    });
  });

  describe('habit updates', () => {
    it('should update habit properties', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.updateHabit({
          name: 'Updated Name',
          description: 'Updated Description',
          color: '#00FF00'
        });
      });
      
      expect(result.current.habit.name).toBe('Updated Name');
      expect(result.current.habit.description).toBe('Updated Description');
      expect(result.current.habit.color).toBe('#00FF00');
    });

    it('should merge updates with existing habit state', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.updateHabit({ name: 'First Update' });
      });
      
      act(() => {
        result.current.updateHabit({ description: 'Second Update' });
      });
      
      expect(result.current.habit.name).toBe('First Update');
      expect(result.current.habit.description).toBe('Second Update');
    });
  });

  describe('frequency updates', () => {
    it('should handle everyDay frequency', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.updateHabitFrequency('everyDay', 0, 0);
      });
      
      expect(result.current.habit.frequencyDays).toBe(1);
      expect(result.current.habit.target).toBe(1);
    });

    it('should handle everyXDays frequency', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.updateHabitFrequency('everyXDays', 3, 0);
      });
      
      expect(result.current.habit.frequencyDays).toBe(3);
      expect(result.current.habit.target).toBe(1);
    });

    it('should handle timesPerWeek frequency', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.updateHabitFrequency('timesPerWeek', 0, 5);
      });
      
      expect(result.current.habit.frequencyDays).toBe(7);
      expect(result.current.habit.target).toBe(5);
    });

    it('should handle timesPerMonth frequency', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.updateHabitFrequency('timesPerMonth', 0, 10);
      });
      
      expect(result.current.habit.frequencyDays).toBe(30);
      expect(result.current.habit.target).toBe(10);
    });

    it('should handle timesInXDays frequency', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.updateHabitFrequency('timesInXDays', 14, 8);
      });
      
      expect(result.current.habit.frequencyDays).toBe(14);
      expect(result.current.habit.target).toBe(8);
    });
  });

  describe('validation', () => {
    it('should validate boolean habit successfully', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.handleTypeSelection('boolean');
        result.current.updateHabit({ name: 'Valid Habit' });
        result.current.updateHabitFrequency('everyDay', 0, 0);
      });
      
      const errors = result.current.validate();
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should validate measurable habit successfully', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.handleTypeSelection('measurable');
        result.current.updateHabit({ 
          name: 'Valid Habit',
          unit: 'minutes',
          target: 30
        });
        result.current.updateHabitFrequency('everyDay', 0, 0);
      });
      
      const errors = result.current.validate();
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should return validation errors for empty name', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      const errors = result.current.validate();
      expect(errors.name).toBe('Name is required.');
    });

    it('should return validation errors for measurable habit without unit', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.handleTypeSelection('measurable');
        result.current.updateHabit({ name: 'Test Habit' });
      });
      
      const errors = result.current.validate();
      expect(errors.unit).toBe('Unit is required.');
    });

    it('should return validation errors for measurable habit with invalid target', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.handleTypeSelection('measurable');
        result.current.updateHabit({ 
          name: 'Test Habit',
          unit: 'minutes',
          target: 0
        });
      });
      
      const errors = result.current.validate();
      expect(errors.target).toBe('Target must be a positive number.');
    });

    it('should return validation errors for habit without frequency', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.updateHabit({ name: 'Test Habit' });
      });
      
      const errors = result.current.validate();
      expect(errors.frequencyDays).toBe('Frequency is required.');
    });
  });

  describe('save functionality', () => {
    it('should call onSave when validation passes', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.handleTypeSelection('boolean');
        result.current.updateHabit({ name: 'Valid Habit' });
        result.current.updateHabitFrequency('everyDay', 0, 0);
      });
      
      act(() => {
        result.current.handleSave();
      });
      
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Valid Habit',
          type: 'boolean',
          frequencyDays: 1,
          target: 1
        })
      );
      expect(result.current.errors).toEqual({});
    });

    it('should not call onSave when validation fails', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.handleSave();
      });
      
      expect(mockOnSave).not.toHaveBeenCalled();
      expect(Object.keys(result.current.errors)).toHaveLength(2); // name and frequencyDays
    });

    it('should set errors when validation fails', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.handleSave();
      });
      
      expect(result.current.errors.name).toBe('Name is required.');
      expect(result.current.errors.frequencyDays).toBe('Frequency is required.');
    });
  });

  describe('error management', () => {
    it('should clear errors manually', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      // Trigger validation errors
      act(() => {
        result.current.handleSave();
      });
      expect(Object.keys(result.current.errors)).toHaveLength(2);
      
      // Clear errors
      act(() => {
        result.current.setErrors({});
      });
      expect(result.current.errors).toEqual({});
    });

    it('should set specific errors', () => {
      const { result } = renderHook(() => useHabitFormState(mockOnSave));
      
      act(() => {
        result.current.setErrors({ name: 'Custom error' });
      });
      
      expect(result.current.errors.name).toBe('Custom error');
    });
  });
});
