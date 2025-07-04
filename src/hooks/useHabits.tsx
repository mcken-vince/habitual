import { Habit } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updatedHabit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  updateCompletion: (habitId: string, date: string, value: number) => void;
  reorderHabits: (startIndex: number, endIndex: number) => void;
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
  const [updateTrigger, setUpdateTrigger] = useState(0); // State to trigger updates
  const [habits, setHabits] = useState<Habit[]>(() => {
    // Initialize habits from localStorage
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      try {
        const parsedHabits = JSON.parse(savedHabits) as Habit[];
        // Ensure all habits have an order field, assign based on array index if missing
        return parsedHabits.map((habit, index) => ({
          ...habit,
          order: habit.order !== undefined ? habit.order : index
        })).sort((a, b) => a.order - b.order);
      } catch (error) {
        console.error("Failed to parse habits from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  // Save habits to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("habits", JSON.stringify(habits));
    } catch (error) {
      console.error("Failed to save habits to localStorage:", error);
    }
  }, [habits, updateTrigger]);

  const addHabit = (habit: Habit) => {
    // Assign the next order value
    const maxOrder = habits.length > 0 ? Math.max(...habits.map(h => h.order)) : -1;
    const habitWithOrder = { ...habit, order: maxOrder + 1 };
    setHabits((prevHabits) => [...prevHabits, habitWithOrder]);
    setUpdateTrigger((prev) => prev + 1); // Trigger update
  };

  const updateHabit = (id: string, updatedHabit: Partial<Habit>) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, ...updatedHabit } : habit
      )
    );
    setUpdateTrigger((prev) => prev + 1); // Trigger update
  };

  const deleteHabit = (id: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
    setUpdateTrigger((prev) => prev + 1); // Trigger update
  };

  const updateCompletion = (habitId: string, date: string, value: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? {
            ...habit,
            history: {
              ...habit.history,
              [date]: value,
            },
          }
          : habit
      )
    );
    setUpdateTrigger((prev) => prev + 1); // Trigger update
  };

  const reorderHabits = (startIndex: number, endIndex: number) => {
    setHabits((prevHabits) => {
      const sortedHabits = [...prevHabits].sort((a, b) => a.order - b.order);
      const [reorderedItem] = sortedHabits.splice(startIndex, 1);
      sortedHabits.splice(endIndex, 0, reorderedItem);

      // Update order values
      return sortedHabits.map((habit, index) => ({
        ...habit,
        order: index
      }));
    });
    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <HabitsContext.Provider
      value={{ habits, addHabit, updateHabit, deleteHabit, updateCompletion, reorderHabits }}
    >
      {children}
    </HabitsContext.Provider>
  );
};