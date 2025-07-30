import { parseDateStringLocal } from "@/lib/dates";
import { Habit } from "@/types";

export type Grouping = "week" | "month" | "quarter" | "year";
type HistoryEntry = {
  period: string;
  completions: number;
  key: string;
};

// ===== Date Utilities =====

/**
 * Generates a period key for a date based on the grouping method
 * @param date - The date to generate the key for
 * @param grouping - The grouping method (week, month, quarter, year)
 * @return A string representing the period key
 */
export function getPeriodKey(date: Date, grouping: Grouping): string {
  const year = date.getFullYear();
  
  switch (grouping) {
    case "week":
      return getWeekKey(date, year)
    case "month":
      return `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    case "quarter":
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `${year}-Q${quarter}`;
    case "year":
      return `${year}`;
    default:
      return "";
  }
};

/**
 * Calculates week key for a given date
 * @param date - The date to calculate the week key for
 * @param year - The year of the date
 * @return A string representing the week key in the format "YYYY-Wn"
 */
export function getWeekKey(date: Date, year: number): string {
  // ISO week number
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${year}-W${week}`;
};

/**
 * Formats period key into human readable label
 * @param key - The period key to format
 * @param grouping - The grouping method (week, month, quarter, year)
 * @return A string representing the formatted period label
 */
export function getPeriodLabel(key: string, grouping: Grouping): string {
  switch (grouping) {
    case "week":
      return key.replace("-", " W");
    case "month":
      const [year, month] = key.split("-");
      return `${year} ${parseDateStringLocal(`${year}-${month}-01`).toLocaleString("default", { month: "short" })}`;
    case "quarter":
      return key.replace("-", " ");
    case "year":
    default:
      return key;
  }
};

/**
 * Calculates first day of a given week
 * @param year - The year of the week
 * @param week - The week number (1-53)
 * @param startDayOfWeek - The user's preferred start day of the week (0-6, where 0 is Sunday)
 * @return A Date object representing the first day of the week
 */
export function getFirstDayOfWeek(year: number, week: number, startDayOfWeek: number): Date {
  const jan1 = new Date(year, 0, 1);
  const jan1Day = jan1.getDay();
  const daysOffset = (startDayOfWeek - jan1Day + 7) % 7;
  const firstWeekStart = new Date(jan1);
  firstWeekStart.setDate(jan1.getDate() + daysOffset);
  
  const weekStart = new Date(firstWeekStart);
  weekStart.setDate(firstWeekStart.getDate() + (week - 1) * 7);
  return weekStart;
};

/**
 * Generates a readable label for week periods
 * @param key - The week key in the format "YYYY-Wn"
 * @param prevKey - The previous week key for comparison, or null for the first entry
 * @param startDayOfWeek - The user's preferred start day of the week (0-6, where 0 is Sunday)
 * @return A string representing the formatted week label
 */
export function getWeekLabel(key: string, prevKey: string | null, startDayOfWeek: number): string {
  const [yearStr, weekStr] = key.split("-W");
  const year = Number(yearStr);
  const week = Number(weekStr);
  const firstDay = getFirstDayOfWeek(year, week, startDayOfWeek);
  
  // Create month+year format for first entry or when month/year changes
  const monthYearFormat = `${firstDay.toLocaleString("default", { month: "short" })} '${String(year).slice(-2)}`;
  
  if (!prevKey) {
    return monthYearFormat;
  }

  const [prevYearStr, prevWeekStr] = prevKey.split("-W");
  const prevYear = Number(prevYearStr);
  const prevWeek = Number(prevWeekStr);
  const prevFirstDay = getFirstDayOfWeek(prevYear, prevWeek, startDayOfWeek);

  const isNewMonthOrYear =
    firstDay.getMonth() !== prevFirstDay.getMonth() ||
    firstDay.getFullYear() !== prevFirstDay.getFullYear();
  
  return isNewMonthOrYear 
    ? monthYearFormat
    : firstDay.toLocaleDateString(undefined, { day: "numeric" });
};

// ===== Data Processing =====

/**
 * Gets all period keys between the first and last dates in habit history
 * @param habit - The habit object containing history data
 * @param grouping - The grouping method (week, month, quarter, year)
 * @return An array of period keys in the specified grouping
 */
export function getAllPeriodKeys(habit: Habit, grouping: Grouping): string[] {
  const dateStrings = Object.keys(habit.history);
  if (dateStrings.length === 0) return [];
  
  // Find min and max dates
  const dates = dateStrings.map(parseDateStringLocal);
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Always include up to today
  const today = new Date();
  if (maxDate < today) maxDate.setTime(today.getTime());

  switch (grouping) {
    case "week":
      return getWeeklyPeriodKeys(minDate, maxDate);
    case "month":
      return getMonthlyPeriodKeys(minDate, maxDate);
    case "quarter":
      return getQuarterlyPeriodKeys(minDate, maxDate);
    case "year":
      return getYearlyPeriodKeys(minDate, maxDate);
    default:
      return [];
  }
};

/**
 * Gets all weekly period keys between start and end dates
 * @param startDate - The start date of the range
 * @param endDate - The end date of the range
 * @return An array of weekly period keys in the format "YYYY-Wn"
 */
export function getWeeklyPeriodKeys(startDate: Date, endDate: Date): string[] {
  const keys: string[] = [];
  const current = new Date(startDate);
  // Set to Monday of the first week
  current.setDate(current.getDate() - ((current.getDay() + 6) % 7));
  
  while (current <= endDate) {
    keys.push(getPeriodKey(current, "week"));
    current.setDate(current.getDate() + 7);
  }

  return keys;
};

/**
 * Gets all monthly period keys between start and end dates
 * @param startDate - The start date of the range
 * @param endDate - The end date of the range
 * @return An array of monthly period keys in the format "YYYY-MM"
 */
export function getMonthlyPeriodKeys(startDate: Date, endDate: Date): string[] {
  const keys: string[] = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  while (current <= endDate) {
    keys.push(getPeriodKey(current, "month"));
    current.setMonth(current.getMonth() + 1);
  }

  return keys;
};

/**
 * Gets all quarterly period keys between start and end dates
 * @param startDate - The start date of the range
 * @param endDate - The end date of the range
 * @return An array of quarterly period keys in the format "YYYY-Qn"
 */
export function getQuarterlyPeriodKeys(startDate: Date, endDate: Date): string[] {
  const keys: string[] = [];
  const current = new Date(startDate.getFullYear(), Math.floor(startDate.getMonth() / 3) * 3, 1);
  
  while (current <= endDate) {
    keys.push(getPeriodKey(current, "quarter"));
    current.setMonth(current.getMonth() + 3);
  }

  return keys;
};

/**
 * Gets all yearly period keys between start and end dates
 * @param startDate - The start date of the range
 * @param endDate - The end date of the range
 * @return An array of yearly period keys in the format "YYYY"
 */
export function getYearlyPeriodKeys(startDate: Date, endDate: Date): string[] {
  const keys: string[] = [];
  const current = new Date(startDate.getFullYear(), 0, 1);

  while (current <= endDate) {
    keys.push(getPeriodKey(current, "year"));
    current.setFullYear(current.getFullYear() + 1);
  }

  return keys;
};

/**
 * Transforms habit history into grouped period data
 * @param habit - The habit object containing history data
 * @param grouping - The grouping method (week, month, quarter, year)
 * @param startDayOfWeek - The user's preferred start day of the week (0-6, where 0 is Sunday)
 * @return An array of HistoryEntry objects with period labels and completion counts
 */
export function transformHistoryData(
  habit: Habit, 
  grouping: Grouping, 
  startDayOfWeek: number
): HistoryEntry[] {
  // Calculate completion counts by period
  const counts: Record<string, number> = {};
  Object.entries(habit.history).forEach(([dateStr, value]) => {
    const date = parseDateStringLocal(dateStr);
    const key = getPeriodKey(date, grouping);
    counts[key] = (counts[key] || 0) + value;
  });

  // Get all period keys in range, even if no completions
  const allKeys = getAllPeriodKeys(habit, grouping);
  const sortedKeys = allKeys.length > 0 ? allKeys : Object.keys(counts).sort();

  // Create formatted data entries
  return sortedKeys.map((key, idx) => {
    let label = getPeriodLabel(key, grouping);
    if (grouping === "week") {
      const prevKey = idx > 0 ? sortedKeys[idx - 1] : null;
      label = getWeekLabel(key, prevKey, startDayOfWeek);
    }
    
    return {
      period: label,
      completions: counts[key] || 0,
      key,
    };
  })
};

/**
 * Calculates Y-axis labels for the chart
 * @param data - The history data entries
 * @return An array of numbers representing Y-axis labels
 * This is based on the maximum completions in the data
 * and generates evenly spaced ticks
 */
export function calculateYAxisLabels(data: HistoryEntry[]): number[] {
  const maxCompletions = data.reduce((max, d) => Math.max(max, d.completions), 0);
  const yTicks = maxCompletions <= 5 ? maxCompletions : 5;

  return Array.from(
    { length: yTicks + 1 }, 
    (_, i) => Math.round((maxCompletions / yTicks) * (yTicks - i))
  );
};