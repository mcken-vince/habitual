export interface Habit {
  id: string;
  name: string;
  description?: string;
  type: 'boolean' | 'measurable'; // Yes/No or Volume-based
  target: number; // Target value
  unit?: string; // Unit for measurable habits (e.g., "km", "minutes")
  history: Record<string, number>; // Date-to-value mapping
  frequencyDays?: number; // Number of days for frequency target
  color: string; // Color for the habit
  createdAt: string; // ISO date string
  order: number; // Order position for sorting
}