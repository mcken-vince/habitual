import { Habit } from "@/types";
import { Button } from "./ui/button";

interface HabitDateCellProps {
  habit: Habit;
  date: string;
  onClick: () => void;
}

export const HabitDateCell = ({ habit, date, onClick }: HabitDateCellProps) => {
  const isCompleted = habit.history[date];
  const textColorClass = isCompleted ? "text-foreground" : "text-gray-200";

  return (
    <div key={date} className="flex flex-col items-center">
      <Button
        
        onClick={onClick}
        variant="ghost"
        className="w-12 h-12 flex items-center justify-center rounded-md bg-transparent hover:bg-inherit"
      >
        {habit.type === "boolean" ? (
          <span className={`text-2xl font-bold ${textColorClass}`}>
            {isCompleted ? "✓" : "✗"}
          </span>
        ) : (
          <div className={`flex flex-col items-center ${textColorClass}`}>
            <span className="text-lg font-semibold">{habit.history[date] || 0}</span>
            {habit.type === "measurable" && (
              <span className="text-xs mt-1">{habit.unit}</span>
            )}
          </div>
        )}
      </Button>
    </div>
  );
};