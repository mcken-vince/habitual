import { useState } from "react";
import { Habit } from "@/types";

interface HabitFormOptions {
  open: boolean;
  initialHabit: Habit | undefined;
}

export function useHabitForm() {
  const [habitFormOptions, setHabitFormOptions] = useState<HabitFormOptions>({
    open: false,
    initialHabit: undefined,
  });

  const handleCreateHabit = () => {
    setHabitFormOptions({ open: true, initialHabit: undefined });
  };

  const handleEditHabit = (habitToEdit?: Habit) => {
    if (habitToEdit) {
      setHabitFormOptions({ open: true, initialHabit: habitToEdit });
    }
  };
  
  const resetHabitForm = () => {
    setHabitFormOptions({ open: false, initialHabit: undefined });
  };

  return {
    habitFormOptions,
    handleCreateHabit,
    handleEditHabit,
    resetHabitForm,
  };
}