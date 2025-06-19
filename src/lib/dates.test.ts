import {
toDateStringLocal,
parseDateStringLocal,
todayLocalString,
getDatesInRange,
} from './dates';

describe('toDateStringLocal', () => {
  it('formats a date as YYYY-MM-DD', () => {
    const date = new Date(2025, 0, 5); // Jan 5, 2025
    expect(toDateStringLocal(date)).toBe('2025-01-05');
  });

  it('pads month and day with zeros', () => {
    const date = new Date(2025, 8, 9); // Sep 9, 2025
    expect(toDateStringLocal(date)).toBe('2025-09-09');
  });
});

describe('parseDateStringLocal', () => {
it('parses a YYYY-MM-DD string to a Date at midnight local', () => {
  const date = parseDateStringLocal('2025-01-05');
  expect(date.getFullYear()).toBe(2025);
  expect(date.getMonth()).toBe(0);
  expect(date.getDate()).toBe(5);
  expect(date.getHours()).toBe(0);
  expect(date.getMinutes()).toBe(0);
});

it('handles single-digit months and days', () => {
  const date = parseDateStringLocal('2025-09-09');
  expect(date.getFullYear()).toBe(2025);
  expect(date.getMonth()).toBe(8);
  expect(date.getDate()).toBe(9);
});
});

describe('todayLocalString', () => {
it('returns today as YYYY-MM-DD', () => {
  const today = new Date();
  const expected = toDateStringLocal(today);
  expect(todayLocalString()).toBe(expected);
});
});

describe('getDatesInRange', () => {
it('returns an array of date strings counting backwards', () => {
  const start = new Date(2025, 0, 5); // Jan 5, 2025
  expect(getDatesInRange(start, 3)).toEqual([
    '2025-01-05',
    '2025-01-04',
    '2025-01-03',
  ]);
});

it('returns an array of date strings in reverse order if reverse=true', () => {
  const start = new Date(2025, 0, 5);
  expect(getDatesInRange(start, 3, true)).toEqual([
    '2025-01-03',
    '2025-01-04',
    '2025-01-05',
  ]);
});

it('returns an empty array if lengthDays is 0', () => {
  const start = new Date(2025, 0, 5);
  expect(getDatesInRange(start, 0)).toEqual([]);
});

it('handles lengthDays = 1', () => {
  const start = new Date(2025, 0, 5);
  expect(getDatesInRange(start, 1)).toEqual(['2025-01-05']);
});
});
