import { Habit } from "@/types";
import { toDateStringLocal } from "./dates";

export function calculateHabitScore(habit: Habit, asOfDate?: Date): number {
  const { type, target, frequencyDays, history } = habit;

  const windowDays = frequencyDays || 7;
  const referenceDate = asOfDate || new Date();
  
  // Calculate number of complete frequency periods to evaluate
  const numPeriods = Math.max(12, Math.ceil(120 / windowDays));
  
  let weightedSum = 0;
  let totalWeight = 0;
  const alpha = 0.07;

  // Process each frequency period
  for (let periodIndex = 0; periodIndex < numPeriods; periodIndex++) {
    const weight = alpha * Math.pow(1 - alpha, periodIndex);
    totalWeight += weight;

    // Calculate the start and end dates for this period
    const periodEndDate = new Date(referenceDate);
    periodEndDate.setDate(referenceDate.getDate() - (periodIndex * windowDays));
    
    const periodStartDate = new Date(periodEndDate);
    periodStartDate.setDate(periodEndDate.getDate() - windowDays + 1);

    // Aggregate values within this period
    let periodSum = 0;
    let periodCount = 0;

    for (let dayOffset = 0; dayOffset < windowDays; dayOffset++) {
      const date = new Date(periodStartDate);
      date.setDate(periodStartDate.getDate() + dayOffset);
      const dateStr = toDateStringLocal(date);
      
      const value = history[dateStr] || 0;
      periodSum += value;
      if (value > 0) periodCount++;
    }

    // Calculate achievement rate for this period
    let achievementRate = 0;
    
    if (type === "boolean") {
      // For boolean habits: target = number of completions needed per period
      const effectiveTarget = target || 1;
      achievementRate = Math.min(periodCount / effectiveTarget, 1);
    } else if (type === "measurable" && target) {
      // For measurable habits: target = total amount needed per period
      achievementRate = Math.min(periodSum / target, 1);
    }

    weightedSum += achievementRate * weight;
  }

  // Calculate final score
  const score = totalWeight > 0 ? Math.min((weightedSum / totalWeight) * 100, 100) : 0;
  return score;
}