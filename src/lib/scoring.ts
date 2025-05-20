import { Habit } from "@/types";

/**
 * Calculates the score for a habit based on its performance.
 * Recent completions are weighted more heavily, but all history is considered.
 * @param habit - The habit object.
 * @returns The calculated score as a number.
 */
export function calculateHabitScore(habit: Habit): number {
  const { type, target, frequencyTimes, frequencyDays, history } = habit;

  // Parameters for weighting
  const windowDays = frequencyDays || 7;
  const allDates = Object.keys(history).sort(); // Ascending order
  if (allDates.length === 0) return 0;

  // Calculate weights: recent dates get higher weights
  const today = new Date();
  let weightedSum = 0;
  let totalWeight = 0;

  for (const dateStr of allDates) {
    const date = new Date(dateStr);
    // Days ago (0 = today)
    const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    // Weight: linearly decreases, but minimum weight is 0.2
    const weight = Math.max(1 - daysAgo / (windowDays * 2), 0.2);
    totalWeight += weight;

    if (type === "boolean") {
      weightedSum += (history[dateStr] ? 1 : 0) * weight;
    } else if (type === "measurable" && target) {
      weightedSum += (history[dateStr] / target) * weight;
    }
  }

  // Normalize score to percentage
  let score = 0;
  if (type === "boolean") {
    // Compare to desired frequency
    const freq = frequencyTimes || windowDays;
    score = Math.min((weightedSum / totalWeight) * 100 / freq * windowDays, 100);
  } else if (type === "measurable" && target) {
    // Compare to target per window
    score = Math.min((weightedSum / totalWeight) * 100, 100);
  }

  return score;
}