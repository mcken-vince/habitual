import { Habit } from "@/types";

export function calculateHabitScore(habit: Habit): number {
  const { type, target, frequencyDays, history } = habit;

  const windowDays = frequencyDays || 7;
  const scoringWindow = Math.max(windowDays * 12, 120);
  const today = new Date();
  let weightedSum = 0;
  let totalWeight = 0;

  const alpha = 0.07;

  for (let i = 0; i < scoringWindow; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    const weight = alpha * Math.pow(1 - alpha, i);
    totalWeight += weight;

    if (type === "boolean") {
      weightedSum += (history[dateStr] ? 1 : 0) * weight;
    } else if (type === "measurable" && target) {
      weightedSum += ((history[dateStr] || 0) / target) * weight;
    }
  }

  let score = 0;
  if (type === "boolean") {
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