import { Habit } from "@/types";

export const getHabit = (habit: Partial<Habit>): Habit => {
  return {
    id: habit.id || "test-habit",
    name: habit.name || "Test Habit",
    type: habit.type || "boolean",
    target: habit.target || 1,
    frequencyDays: habit.frequencyDays || 7,
    history: habit.history || {},
    createdAt: habit.createdAt || new Date().toISOString(),
    order: habit.order || 0,
    color: habit.color || "#000000",
    isArchived: habit.isArchived || false,
  }
}

export const fillHistory = (habit: Habit, days: number, value: number, getValue?: (index: number) => number) => {
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    habit.history[d.toISOString().slice(0, 10)] = getValue ? getValue(i) : value;
  }
}