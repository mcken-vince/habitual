import { Habit } from "@/types";

export type PeriodType = "week" | "month" | "quarter" | "year";

/**
 * Gets the start and end date for a given period
 * @param period - The period type (week, month, quarter, year)
 * @param startDayOfWeek - The first day of the week (0 = Sunday, 1 = Monday, etc.)
 * @return An object with start and end dates
 */
export function getPeriodRange(period: PeriodType, startDayOfWeek: number = 0) {
  const now = new Date()
  let start: Date
  let end: Date
  switch (period) {
    case "week": {
      start = new Date(now);
      // Adjust to user start day
      const day = now.getDay();
      const diff = (day - startDayOfWeek + 7) % 7;
      start.setDate(now.getDate() - diff);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    }
    case "month": {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      break
    }
    case "quarter": {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      start = new Date(now.getFullYear(), quarterStartMonth, 1)
      end = new Date(now.getFullYear(), quarterStartMonth + 3, 0)
      break
    }
    case "year": {
      start = new Date(now.getFullYear(), 0, 1)
      end = new Date(now.getFullYear(), 12, 0)
      break
    }
  }
  return { start, end }
}

/**
 * Calculates the progress for a habit within a specific period
 * @param habit - The habit object
 * @param period - The period type (week, month, quarter, year) 
 * @param startDayOfWeek - The first day of the week (0 = Sunday, 1 = Monday, etc.)
 * @return An object with the current value and target for the period
 */
export function getProgress(habit: Habit, period: PeriodType, startDayOfWeek: number = 0) {
  const { start, end } = getPeriodRange(period, startDayOfWeek);
  let total = 0
  let days = 0
  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    const key = d.toISOString().slice(0, 10)
    total += habit.history[key] || 0
    days++
  }
  let target = habit.target / (habit.frequencyDays ?? 1) * days
  if (habit.type === 'boolean') {
    // Clamp boolean habit target to not exceed days in period
    target = Math.min(target, days)
  }

  return { value: total, target: Math.round(target) }
}
