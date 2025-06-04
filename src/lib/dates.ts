// Convert a Date to a local "YYYY-MM-DD" string
export function toDateStringLocal(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Parse a "YYYY-MM-DD" string as a local date (midnight local)
export function parseDateStringLocal(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Get today's date as a local "YYYY-MM-DD" string
export function todayLocalString(): string {
  return toDateStringLocal(new Date());
}

export function getDatesInRange(start: Date, lengthDays: number, reverse?: boolean): string[] {
  const startDate = new Date(start);
  const dates = Array.from({ length: lengthDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() - i);
    return toDateStringLocal(date);
  });
  if (reverse) {
    return dates.reverse();
  }
  return dates;
}
