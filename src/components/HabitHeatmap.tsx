import { Habit } from "@/types";

interface HabitHeatmapProps {
  habit: Habit;
  dates: string[];
}

export const HabitHeatmap = ({ habit, dates }: HabitHeatmapProps) => {
  const getColorIntensity = (value: number) => {
    if (value === 0) return "bg-gray-200"; // No completion
    if (value < habit.target! / 2) return "bg-green-200"; // Partial completion
    if (value < habit.target!) return "bg-green-400"; // Near completion
    return "bg-green-600"; // Full completion
  };

  return (
    <div className="flex flex-col flex-wrap max-h-70 gap-1 w-fit">
      {dates.map((date) => {
        const value = habit.history[date] || 0;
        return (
          <div
            key={date}
            className={`w-8 h-8 pt-1 rounded flex align-center justify-center ${getColorIntensity(value)}`}
            title={`${date}: ${value} ${habit.unit || ""}`}
          >{new Date(date).getDate()}</div>
        );
      })}
    </div>
  );
};