import { toDateStringLocal, parseDateStringLocal, getDatesInRange } from "@/lib/dates";
import { Habit } from "@/types";

/**
 * Calculates the current streak of consecutive completions.
 * 
 * @param history - Record of dates with completion values
 * @returns Number of consecutive days completed (including today if completed)
 */
export function calculateCurrentStreak(history: Record<string, number>): number {
  if (Object.keys(history).length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  const todayStr = toDateStringLocal(currentDate);

  // Check if today has an entry and is completed
  if (history[todayStr] && history[todayStr] > 0) {
    streak = 1;
    currentDate.setDate(currentDate.getDate() - 1);
  } else {
    // If today is not completed, check yesterday for active streak
    currentDate.setDate(currentDate.getDate() - 1);
    const yesterdayStr = toDateStringLocal(currentDate);
    
    if (history[yesterdayStr] && history[yesterdayStr] > 0) {
      streak = 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      return 0; // No recent activity
    }
  }

  // Continue backwards until we find a missing or incomplete day
  while (true) {
    const dateStr = toDateStringLocal(currentDate);
    
    if (history[dateStr] && history[dateStr] > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculates the longest streak of consecutive completions.
 * 
 * @param history - Record of dates with completion values
 * @returns Maximum number of consecutive days completed
 */
export function calculateLongestStreak(history: Record<string, number>): number {
  const completedDates = Object.keys(history)
    .filter(date => history[date] > 0)
    .sort((a, b) => parseDateStringLocal(a).getTime() - parseDateStringLocal(b).getTime());

  if (completedDates.length === 0) return 0;
  if (completedDates.length === 1) return 1;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = parseDateStringLocal(completedDates[i - 1]);
    const currDate = parseDateStringLocal(completedDates[i]);

    // Calculate the difference in days
    const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      // Consecutive days
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      // Gap in dates, reset streak
      currentStreak = 1;
    }
  }

  return maxStreak;
};

/**
 * Calculates the total number of completions across all dates.
 * 
 * @param history - Record of dates with completion values
 * @returns Sum of all completion values
 */
export function calculateTotalCompletions(history: Record<string, number>): number {
  return Object.values(history).reduce((sum, value) => sum + (value || 0), 0);
};

/**
 * Gets recent activity for the specified number of days up to and including today.
 * 
 * @param history - Record of dates with completion values
 * @param days - Number of recent days to include
 * @returns Array of activity data for each day
 */
export function getRecentActivity(
  history: Record<string, number>,
  days: number
): Array<{ date: string; completed: boolean; value: number }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Use the getDatesInRange utility to get dates
  const dates = getDatesInRange(today, days, true);
  
  return dates.map(dateStr => ({
    date: dateStr,
    completed: (history[dateStr] || 0) > 0,
    value: history[dateStr] || 0
  }));
};

/**
 * Formats a completion count with appropriate units.
 * 
 * @param count - The completion count
 * @param unit - The unit to display (optional)
 * @returns Formatted string with count and unit
 */
export function formatCompletionCount(count: number, unit?: string): string {
  if (!unit) return `${count} completions`;
  
  // Handle plural forms
  if (count === 1) {
    return `${count} ${unit}`;
  }
  
  // Add 's' for plural if unit doesn't already end with 's'
  const pluralUnit = unit.endsWith('s') ? unit : `${unit}s`;
  return `${count} ${pluralUnit}`;
};

/**
 * Determines the color intensity for the activity indicator.
 * 
 * @param value - The completion value
 * @param target - The target value
 * @returns Opacity value between 0 and 1
 */
export function getActivityOpacity(value: number, target: number): number {
  if (value === 0) return 0.3;
  if (value >= target) return 1;
  // Scale between 0.5 and 1 based on percentage of target
  return 0.5 + (0.5 * (value / target));
};

/**
 * Creates overview statistics for a habit.
 * 
 * @param habit - The habit object
 * @returns Object containing all overview statistics
 */
export function createOverviewStats(habit: Habit) {
  return {
    currentStreak: calculateCurrentStreak(habit.history),
    longestStreak: calculateLongestStreak(habit.history),
    totalCompletions: calculateTotalCompletions(habit.history),
    recentActivity: getRecentActivity(habit.history, 30)
  };
};
