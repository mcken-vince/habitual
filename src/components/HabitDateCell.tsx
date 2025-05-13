import { Habit } from "@/types";
import { Button } from "./ui/button";

interface HabitDateCellProps {
  habit: Habit;
  date: string;
  onClick: () => void;
}

export const HabitDateCell = ({ habit, date, onClick }: HabitDateCellProps) => {
  const isCompleted = habit.history[date];
  const textColor = isCompleted ? habit.color : "var(--color-gray-200)";

  return (
    <div key={date} className="flex flex-col items-center">
      <Button
        
        onClick={onClick}
        variant="ghost"
        className="w-10 h-10 flex items-center justify-center rounded-md bg-transparent hover:bg-inherit"
      >
        {habit.type === "boolean" ? (
          <span style={{color: textColor}} className="text-2xl font-bold">
            {isCompleted ? "✓" : "✗"}
          </span>
        ) : (
          <div 
          style={{color: textColor}}
          className="flex flex-col items-center">
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