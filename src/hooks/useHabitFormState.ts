import type { Habit, PartialHabit, FrequencyType } from "@/types";
import { useState } from "react";

export const useHabitFormState = (onSave: (habit: PartialHabit) => void, initialHabit?: Habit) => {
  const [habitType, setHabitType] = useState<"boolean" | "measurable" | null>(
    initialHabit?.type || null
  );
  const [habit, setHabit] = useState<PartialHabit>(
    initialHabit || {
      name: "",
      description: "",
      type: "boolean",
      target: 1,
      unit: "",
      frequencyDays: undefined,
      color: "#FF0000",
      isArchived: false,
    }
  );

  const updateHabit = (updates: Partial<PartialHabit>) => {
    setHabit((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleTypeSelection = (type: "boolean" | "measurable") => {
    setHabitType(type);
    setHabit((prev) => ({
      ...prev,
      type,
      // Reset type-specific fields when changing type
      target: type === "boolean" ? 1 : prev.target,
      unit: type === "boolean" ? "" : prev.unit,
      frequencyDays: undefined,
    }));
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!habit.name.trim()) newErrors.name = "Name is required.";
    if (habit.type === "measurable") {
      if (!habit.unit?.trim()) newErrors.unit = "Unit is required.";
      if (!habit.target || isNaN(habit.target) || habit.target <= 0) newErrors.target = "Target must be a positive number.";
      if (!habit.frequencyDays) newErrors.frequencyDays = "Frequency is required.";
    }
    if (habit.type === "boolean") {
      if (!habit.frequencyDays) newErrors.frequencyDays = "Frequency is required.";
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSave(habit);
    }
  };

  const updateHabitFrequency = (type: FrequencyType, days: number, times: number) => {
    const frequencyMap: Record<FrequencyType, { frequencyDays: number; target: number }> = {
      everyDay: { frequencyDays: 1, target: 1 },
      everyXDays: { frequencyDays: days, target: 1 },
      timesPerWeek: { frequencyDays: 7, target: times },
      timesPerMonth: { frequencyDays: 30, target: times },
      timesInXDays: { frequencyDays: days, target: times },
    };
    setHabit((prev) => ({
      ...prev,
      ...frequencyMap[type],
    }));
  };


  return { habit, setHabit, habitType, setHabitType, handleTypeSelection, updateHabitFrequency, updateHabit, errors, setErrors, validate, handleSave };
}