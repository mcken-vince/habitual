import { useState } from "react";
import { Habit } from "@/types";

export function useHabitSelection() {
  const [selectedListHabit, setSelectedListHabit] = useState<Habit | null>(null);

  const handleSelectListHabit = (habit: Habit) => {
    setSelectedListHabit(habit);
  };

  const handleDeselectListHabit = () => {
    setSelectedListHabit(null);
  };

  return {
    selectedListHabit,
    handleSelectListHabit,
    handleDeselectListHabit,
  };
}