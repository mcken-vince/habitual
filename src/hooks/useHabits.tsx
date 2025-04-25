import { Habit } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updatedHabit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  updateCompletion: (habitId: string, date: string, value: number) => void;
}

export const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitsProvider");
  }
  return context;
};

export const HabitsProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from localStorage on app initialization
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit: Habit) => {
    setHabits((prevHabits) => [...prevHabits, habit]);
  };

  const updateHabit = (id: string, updatedHabit: Partial<Habit>) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, ...updatedHabit } : habit
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  };

  const updateCompletion = (habitId: string, date: string, value: number) => {
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === habitId
            ? {
                ...habit,
                history: {
                  ...habit.history,
                  [date]: (habit.history[date] || 0) + value,
                },
              }
            : habit
        )
      );
    };

  return (
    <HabitsContext.Provider value={{ habits, addHabit, updateHabit, deleteHabit, updateCompletion }}>
      {children}
    </HabitsContext.Provider>
  );
};