import {
  padDatesToWeekStart,
  groupDatesByWeek,
  getDatesInYear,
  getColorIntensity,
  getMonthLabelForWeek,
  getYearRange,
  extractAlpha
} from './calendarHelpers';

describe('calendarHelpers', () => {
  describe('padDatesToWeekStart', () => {
    it('returns empty array when input is empty', () => {
      expect(padDatesToWeekStart([], 0)).toEqual([]);
    });

    it('pads dates to start on Sunday (0)', () => {
      // Wednesday, Jan 3, 2024
      const dates = ['2024-01-03', '2024-01-04', '2024-01-05'];
      const result = padDatesToWeekStart(dates, 0);
      
      // Should add Sunday, Monday, Tuesday before Wednesday
      expect(result).toEqual([
        '2023-12-31', // Sunday
        '2024-01-01', // Monday
        '2024-01-02', // Tuesday
        '2024-01-03', // Wednesday (original)
        '2024-01-04',
        '2024-01-05'
      ]);
    });

    it('pads dates to start on Monday (1)', () => {
      // Wednesday, Jan 3, 2024
      const dates = ['2024-01-03', '2024-01-04', '2024-01-05'];
      const result = padDatesToWeekStart(dates, 1);
      
      // Should add Monday, Tuesday before Wednesday
      expect(result).toEqual([
        '2024-01-01', // Monday
        '2024-01-02', // Tuesday
        '2024-01-03', // Wednesday (original)
        '2024-01-04',
        '2024-01-05'
      ]);
    });

    it('does not pad when first date is already on start day', () => {
      // Sunday, Dec 31, 2023
      const dates = ['2023-12-31', '2024-01-01', '2024-01-02'];
      const result = padDatesToWeekStart(dates, 0);
      
      expect(result).toEqual(dates); // No padding needed
    });

    it('handles start day greater than current day', () => {
      // Monday, Jan 1, 2024
      const dates = ['2024-01-01', '2024-01-02'];
      const result = padDatesToWeekStart(dates, 3); // Start on Wednesday
      
      // Should pad back to previous Wednesday (Dec 27)
      expect(result.length).toBe(7); // 5 padded days + 2 original
      expect(result[0]).toBe('2023-12-27'); // Wednesday
    });
  });

  describe('groupDatesByWeek', () => {
    it('returns empty array for empty input', () => {
      expect(groupDatesByWeek([])).toEqual([]);
    });

    it('groups dates into weeks of 7', () => {
      const dates = Array.from({ length: 14 }, (_, i) => 
        `2024-01-${(i + 1).toString().padStart(2, '0')}`
      );
      const result = groupDatesByWeek(dates);
      
      expect(result.length).toBe(2);
      expect(result[0].length).toBe(7);
      expect(result[1].length).toBe(7);
    });

    it('handles partial weeks', () => {
      const dates = Array.from({ length: 10 }, (_, i) => 
        `2024-01-${(i + 1).toString().padStart(2, '0')}`
      );
      const result = groupDatesByWeek(dates);
      
      expect(result.length).toBe(2);
      expect(result[0].length).toBe(7);
      expect(result[1].length).toBe(3); // Partial week
    });

    it('handles single week', () => {
      const dates = ['2024-01-01', '2024-01-02', '2024-01-03'];
      const result = groupDatesByWeek(dates);
      
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(dates);
    });
  });

  describe('getDatesInYear', () => {
    beforeEach(() => {
      // Mock current date to Jan 15, 2024
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 0, 15));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns all dates for past years', () => {
      const dates = getDatesInYear(2023);
      
      expect(dates.length).toBe(365); // 2023 is not a leap year
      expect(dates[0]).toBe('2023-01-01');
      expect(dates[364]).toBe('2023-12-31');
    });

    it('returns dates up to today for current year', () => {
      const dates = getDatesInYear(2024);
      
      expect(dates.length).toBe(15); // Jan 1 to Jan 15
      expect(dates[0]).toBe('2024-01-01');
      expect(dates[14]).toBe('2024-01-15');
    });

    it('handles leap years', () => {
      const dates = getDatesInYear(2020);
      
      expect(dates.length).toBe(366); // 2020 is a leap year
      expect(dates[59]).toBe('2020-02-29'); // Leap day
    });

    it('returns dates in chronological order', () => {
      const dates = getDatesInYear(2023);
      
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        expect(currDate.getTime()).toBeGreaterThan(prevDate.getTime());
      }
    });
  });

  describe('getYearRange', () => {
    const currentYear = 2024;

    it('returns current year when no habit dates exist', () => {
      const result = getYearRange([], currentYear, false);
      expect(result).toEqual({
        minYear: currentYear,
        maxYear: currentYear
      });
    });

    it('finds minimum year from habit dates in view mode', () => {
      const habitDates = ['2020-01-01', '2022-06-15', '2024-01-01'];
      const result = getYearRange(habitDates, currentYear, false);
      
      expect(result.minYear).toBe(2020);
      expect(result.maxYear).toBe(currentYear);
    });

    it('allows 10 years back in edit mode', () => {
      const habitDates = ['2022-01-01', '2023-01-01'];
      const result = getYearRange(habitDates, currentYear, true);
      
      expect(result.minYear).toBe(2014); // currentYear - 10
      expect(result.maxYear).toBe(currentYear);
    });

    it('uses habit data min year if older than 10 years in edit mode', () => {
      const habitDates = ['2010-01-01', '2023-01-01'];
      const result = getYearRange(habitDates, currentYear, true);
      
      expect(result.minYear).toBe(2010); // Habit data is older
      expect(result.maxYear).toBe(currentYear);
    });

    it('handles single date', () => {
      const habitDates = ['2021-07-15'];
      const result = getYearRange(habitDates, currentYear, false);
      
      expect(result.minYear).toBe(2021);
      expect(result.maxYear).toBe(currentYear);
    });
  });

  describe('extractAlpha', () => {
    it('extracts alpha from rgba string', () => {
      expect(extractAlpha('rgba(255, 0, 0, 0.5)')).toBe(0.5);
      expect(extractAlpha('rgba(0, 0, 0, 0.75)')).toBe(0.75);
      expect(extractAlpha('rgba(100, 100, 100, 1)')).toBe(1);
    });

    it('returns 1 for non-rgba colors', () => {
      expect(extractAlpha('#ff0000')).toBe(1);
      expect(extractAlpha('rgb(255, 0, 0)')).toBe(1);
      expect(extractAlpha('red')).toBe(1);
    });

    it('handles decimal alpha values', () => {
      expect(extractAlpha('rgba(255, 0, 0, 0.333)')).toBe(0.333);
      expect(extractAlpha('rgba(255, 0, 0, 0.99999)')).toBe(0.99999);
    });

    it('handles edge cases', () => {
      expect(extractAlpha('')).toBe(1);
      expect(extractAlpha('transparent')).toBe(1);
      expect(extractAlpha('rgba(255, 0, 0, 0)')).toBe(0);
    });
  });
});

  describe('getColorIntensity', () => {
    const mockAddAlpha = (color: string, alpha: number) => `rgba(${color}, ${alpha})`;

    it('returns gray for zero value', () => {
      const result = getColorIntensity(0, 10, '#ff0000', mockAddAlpha);
      expect(result).toBe('var(--color-gray-200)');
    });

    it('returns 30% alpha for less than half completion', () => {
      const result = getColorIntensity(3, 10, '#ff0000', mockAddAlpha);
      expect(result).toBe('rgba(#ff0000, 0.3)');
    });

    it('returns 50% alpha for over half completion', () => {
      const result = getColorIntensity(7, 10, '#ff0000', mockAddAlpha);
      expect(result).toBe('rgba(#ff0000, 0.5)');
    });

    it('returns 70% alpha for full completion', () => {
      const result = getColorIntensity(10, 10, '#ff0000', mockAddAlpha);
      expect(result).toBe('rgba(#ff0000, 0.7)');
    });

    it('returns 70% alpha for over completion', () => {
      const result = getColorIntensity(15, 10, '#ff0000', mockAddAlpha);
      expect(result).toBe('rgba(#ff0000, 0.7)');
    });

    it('handles edge case at exactly half', () => {
      const result = getColorIntensity(5, 10, '#ff0000', mockAddAlpha);
      expect(result).toBe('rgba(#ff0000, 0.5)');
    });
  });

  describe('getMonthLabelForWeek', () => {
    it('returns not visible for empty week', () => {
      const result = getMonthLabelForWeek([]);
      expect(result).toEqual({ visible: false, month: '' });
    });

    it('returns not visible for week with null first date', () => {
      const week = [null, '2024-01-02', '2024-01-03'] as any[];
      const result = getMonthLabelForWeek(week);
      expect(result).toEqual({ visible: false, month: '' });
    });

    it('shows label for week starting in first 7 days of month', () => {
      const week = ['2024-01-01', '2024-01-02', '2024-01-03'];
      const result = getMonthLabelForWeek(week);
      expect(result.visible).toBe(true);
      expect(result.month).toBe('Jan');
    });

    it('hides label for week starting after 7th of month', () => {
      const week = ['2024-01-08', '2024-01-09', '2024-01-10'];
      const result = getMonthLabelForWeek(week);
      expect(result.visible).toBe(false);
      expect(result.month).toBe('Jan');
    });

    it('shows label for week starting on 7th', () => {
      const week = ['2024-01-07', '2024-01-08', '2024-01-09'];
      const result = getMonthLabelForWeek(week);
      expect(result.visible).toBe(true);
      expect(result.month).toBe('Jan');
    });
  });
