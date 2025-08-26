/**
 * Date utilities for testing
 */

/**
 * Create a date string in YYYY-MM-DD format
 */
export const createDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Create a date string for X days ago
 */
export const createDateStringDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return createDateString(date);
};

/**
 * Create a date string for X days from now
 */
export const createDateStringDaysFromNow = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return createDateString(date);
};

/**
 * Create an array of date strings for a range
 */
export const createDateRange = (startDaysAgo: number, endDaysAgo: number = 0): string[] => {
  const dates: string[] = [];
  for (let i = startDaysAgo; i >= endDaysAgo; i--) {
    dates.push(createDateStringDaysAgo(i));
  }
  return dates;
};

/**
 * Mock Date.now() to return a specific timestamp
 */
export const mockDateNow = (timestamp: number) => {
  const originalDateNow = Date.now;
  Date.now = jest.fn(() => timestamp);
  return () => {
    Date.now = originalDateNow;
  };
};

/**
 * Create a fixed date for consistent testing
 */
export const FIXED_TEST_DATE = new Date('2024-01-15T10:00:00.000Z');
export const FIXED_TEST_DATE_STRING = createDateString(FIXED_TEST_DATE);
