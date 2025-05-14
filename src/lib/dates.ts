export function getDatesInRange(start: Date = new Date(), lengthDays: number, reverse?: boolean): string[] {
  const startDate = new Date(start);
  const dates = Array.from({ length: lengthDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() - i);
    return date.toISOString().split("T")[0];
  });
  if (reverse) {
    return dates.reverse();
  }
  return dates;
}
