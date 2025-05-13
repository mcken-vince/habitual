export function getDatesInRange(start: Date, end: Date): string[] {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const length = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return Array.from({ length }, (_, i) => {
    const date = new Date();
    date.setDate(startDate.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();
}
