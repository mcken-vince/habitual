export interface Habit {
  id: string;
  name: string;
  description: string;
  type: 'boolean' | 'measurable'; // Yes/No or Volume-based
  target?: number; // Target value for numeric habits
  unit?: string; // Unit for numeric habits (e.g., "km", "minutes")
  history: Record<string, number>; // Date-to-value mapping
}