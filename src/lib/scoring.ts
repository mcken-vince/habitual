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
  const scoringWindow = Math.max(windowDays * 12, 120); // Extend window for longer memory
  const today = new Date();
  let weightedSum = 0;
  let totalWeight = 0;

  // Exponential smoothing parameters
  // Lower alpha = longer memory, slower to reach 100%
  const alpha = 0.07; // Smoothing factor (0 < alpha <= 1), adjust as needed

  for (let i = 0; i < scoringWindow; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    // Exponential weight: alpha * (1 - alpha)^i
    const weight = alpha * Math.pow(1 - alpha, i);
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
    // For daily habits, expect 1 completion per day
    const isDaily = frequencyDays === 1;
    const freq = isDaily ? 1 : (target || windowDays);
    const daysPerWindow = isDaily ? 1 : windowDays;
    const weightedTarget = totalWeight * (freq / daysPerWindow);
    score = Math.min((weightedSum / weightedTarget) * 100, 100);
  } else if (type === "measurable" && target) {
    score = Math.min((weightedSum / totalWeight) * 100, 100);
  }

  return score;
}