import { Habit } from "@/types";

/**
 * Calculates the score for a habit based on its performance.
 * @param habit - The habit object.
 * @returns The calculated score as a number.
 */
export function calculateHabitScore(habit: Habit): number {
  const { type, target, frequencyTimes, frequencyDays, history } = habit;

  // Get the last `frequencyDays` days of history
  const today = new Date();
  const relevantDates = Array.from({ length: frequencyDays || 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date.toISOString().split("T")[0];
  });

  // Sum up the performance over the relevant dates
  const performance = relevantDates.reduce((sum, date) => sum + (history[date] || 0), 0);

  if (type === "boolean") {
    // For boolean habits, calculate the percentage of days completed
    const targetTimes = frequencyTimes || relevantDates.length;
    return Math.min((performance / targetTimes) * 100, 100); // Cap at 100%
  } else if (type === "measurable" && target) {
    // For measurable habits, calculate the percentage of the target achieved
    const totalTarget = target * (frequencyDays || 7);
    return Math.min((performance / totalTarget) * 100, 100); // Cap at 100%
  }

  return 0; // Default score if no valid type or target
}