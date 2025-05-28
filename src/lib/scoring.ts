import { Habit } from "@/types";

/**
 * Calculates the score for a habit based on its performance.
 * Recent completions are weighted more heavily, but all history is considered.
 * Days without entries are treated as misses.
 * @param habit - The habit object.
 * @returns The calculated score as a number.
 */
export function calculateHabitScore(habit: Habit): number {
  const { type, target, frequencyDays, history } = habit;

  // Parameters for weighting
  const windowDays = frequencyDays || 7;
  const scoringWindow = Math.max(windowDays * 2, 100); // Ensure at least 100 days
  const today = new Date();
  let weightedSum = 0;
  let totalWeight = 0;

  for (let i = 0; i < scoringWindow; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    // Days ago (0 = today)
    const daysAgo = i;
    // Weight: linearly decreases, but minimum weight is 0.2
    const weight = Math.max(1 - daysAgo / scoringWindow, 0.2);
    totalWeight += weight;

    if (type === "boolean") {
      weightedSum += (history[dateStr] ? 1 : 0) * weight;
    } else if (type === "measurable" && target) {
      weightedSum += ((history[dateStr] || 0) / target) * weight;
    }
  }

  // Normalize score to percentage
  let score = 0;
  if (type === "boolean") {
    const freq = target || windowDays;
    score = Math.min((weightedSum / totalWeight) * 100 / freq * windowDays, 100);
  } else if (type === "measurable" && target) {
    score = Math.min((weightedSum / totalWeight) * 100, 100);
  }

  return score;
}