import { toDateStringLocal, parseDateStringLocal, getDatesInRange } from "@/lib/dates";
import { addAlpha as defaultAddAlpha } from "@/lib/color";

/**
 * Pads the beginning of a date array with dates to ensure the first date
 * starts on the specified day of the week.
 * 
 * @param dates - Array of date strings in YYYY-MM-DD format
 * @param startDayOfWeek - Day of week to start on (0 = Sunday, 1 = Monday, etc.)
 * @returns Array of date strings padded to start on the specified day
 */
export function padDatesToWeekStart(dates: string[], startDayOfWeek: number): string[] {
  if (dates.length === 0) return [];
  
  const firstDate = parseDateStringLocal(dates[0]);
  const dayOfWeek = firstDate.getDay();
  
  // Calculate how many days to pad before the first date
  const pad = (dayOfWeek - startDayOfWeek + 7) % 7;
  const paddedDates = [...dates];
  
  for (let i = 1; i <= pad; i++) {
    const d = new Date(firstDate);
    d.setDate(firstDate.getDate() - i);
    paddedDates.unshift(toDateStringLocal(d));
  }
  
  return paddedDates;
}

/**
 * Groups an array of dates into weeks.
 * 
 * @param dates - Array of chronological date strings in YYYY-MM-DD format
 * @returns Array of arrays, where each inner array represents a week (7 days)
 */
export function groupDatesByWeek(dates: string[]): string[][] {
  const weeks: string[][] = [];
  
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }
  
  return weeks;
}

/**
 * Gets all dates in a given year up to today (for current year).
 * 
 * @param year - The year to get dates for
 * @returns Array of date strings in YYYY-MM-DD format
 */
export function getDatesInYear(year: number): string[] {
  const yearStart = new Date(year, 0, 1);
  let yearEnd = new Date(year, 11, 31);
  
  if (year === new Date().getFullYear()) {
    yearEnd = new Date(); // Do not include future dates in the current year
  }
  
  const daysInYear = Math.ceil((yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return getDatesInRange(yearEnd, daysInYear, true);
}

/**
 * Determines if a week should display a month label.
 * 
 * @param week - Array of date strings representing a week
 * @returns Object with visibility flag and month name
 */
export function getMonthLabelForWeek(week: string[]): { visible: boolean; month: string } {
  if (week.length === 0 || !week[0]) {
    return { visible: false, month: "" };
  }
  
  const firstDayOfWeek = parseDateStringLocal(week[0]);
  const firstDayIsNewMonth = firstDayOfWeek.getDate() < 8; // Check if the first day is in the first week of the month
  const currentMonth = firstDayOfWeek.toLocaleString("en-US", { month: "short" });
  
  return {
    visible: firstDayIsNewMonth,
    month: currentMonth
  };
}

/**
 * Calculate the year range for navigation.
 * 
 * @param habitDates - Array of date strings from habit history
 * @param currentYear - The current year
 * @param isEditMode - Whether the calendar is in edit mode
 * @returns Object with minYear and maxYear
 */
export function getYearRange(
  habitDates: string[],
  currentYear: number,
  isEditMode: boolean
): { minYear: number; maxYear: number } {
  const minYear = habitDates.length > 0 
    ? Math.min(...habitDates.map(date => parseDateStringLocal(date).getFullYear()))
    : currentYear;
    
  // Allow users to go back at least 10 years in edit mode
  const effectiveMinYear = isEditMode ? Math.min(minYear, currentYear - 10) : minYear;
  
  return {
    minYear: effectiveMinYear,
    maxYear: currentYear
  };
}

/**
 * Extract alpha value from an rgba color string.
 * 
 * @param color - Color string that might be in rgba format
 * @returns Alpha value or 1 if not found
 */
export function extractAlpha(color: string): number {
  const alphaMatch = color.match(/rgba\([^)]+, ([\d.]+)\)/);
  return alphaMatch ? parseFloat(alphaMatch[1]) : 1;
}

/**
 * Calculate the color intensity based on the completion value.
 * 
 * @param value - The current value
 * @param target - The target value
 * @param color - The base color
 * @param addAlpha - Function to add alpha to a color
 * @returns Color string with appropriate alpha
 */
export function getColorIntensity(
  value: number,
  target: number,
  color: string,
  addAlpha: (color: string, alpha: number) => string = defaultAddAlpha
): string {
  if (value === 0) return "var(--color-gray-200)"; // No completion
  if (value < target / 2) return addAlpha(color, 0.3); // Less than half completion
  if (value < target) return addAlpha(color, 0.5); // Over half completion
  return addAlpha(color, 0.7); // Full completion (lighter for accessibility)
}
