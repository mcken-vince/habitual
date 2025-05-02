import { Habit } from "@/types";
import { Button } from "./ui/button";

interface HabitDateCellProps {
  habit: Habit;
  date: string;
  onClick: () => void;
}

export const HabitDateCell = ({ habit, date, onClick }: HabitDateCellProps) => {
  return (<div key={date} className="flex flex-col items-center">
    <Button
      onClick={onClick}
      variant="ghost"
      className={`w-12 h-12 flex items-center justify-center rounded-md bg-transparent hover:bg-inherit`}

    >
      <div className={`${habit.history[date] ? "" : "text-gray-200"} `}>
        {habit.type === "boolean" ? (
          habit.history[date] ? (
            "✔"
          ) : (
            "✖"
          )
        ) : (
          <>
            <span className="text-lg font-semibold flex flex-col">{habit?.history[date] || 0}</span>
            {habit.type === "measurable" && (
              <span className="text-xs mt-1">{habit.unit}</span>
            )}
          </>
        )}
      </div>
    </Button>
  </div>)
}