import { Habit } from "@/types";

export type FrequencyType = "everyDay" | "everyXDays" | "timesPerWeek" | "timesPerMonth" | "timesInXDays";

export type PartialHabit = Partial<Habit> & {
  name: string;
  type: "boolean" | "measurable";
  color: string;
  target: number;
};

export const getFrequencySummary = (habit: PartialHabit) => {
  if (habit.frequencyDays === 1 && habit.target === 1) return "Every day";
  if (habit.frequencyDays && habit.target === 1) return `Every ${habit.frequencyDays} days`;
  if (habit.frequencyDays === 7) return `${habit.target || 1} times per week`;
  if (habit.frequencyDays === 30) return `${habit.target || 1} times per month`;
  if (habit.frequencyDays && habit.target) return `${habit.target} times in ${habit.frequencyDays} days`;
  return "Select frequency";
};

export const getDialogFrequencyType = (habit: PartialHabit) => {
  if (habit.frequencyDays === 1 && habit.target === 1) return "everyDay";
  if (habit.frequencyDays && habit.target === 1) return "everyXDays";
  if (habit.frequencyDays === 7) return "timesPerWeek";
  if (habit.frequencyDays === 30) return "timesPerMonth";
  if (habit.frequencyDays && habit.target) return "timesInXDays";
  return "everyDay";
};
