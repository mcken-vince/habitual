import { Habit } from "@/types";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";

interface HabitDateCellProps {
  habit: Habit;
  date: string;
  onClick: () => void;
}

export const HabitDateCell = ({ habit, date, onClick }: HabitDateCellProps) => {
  const isCompleted = habit.history[date];
  const textColor = isCompleted ? habit.color : "var(--color-gray-200)";
  const [isPressing, setIsPressing] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPressing) {
      timerRef.current = setTimeout(() => {
        setLongPressTriggered(true);
        onClick();
      }, 500);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    // Cleanup on unmount or when isPressing changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPressing, onClick]);

  const startPress = () => {
    setLongPressTriggered(false);
    setIsPressing(true);
  };

  const endPress = (e?: React.SyntheticEvent) => {
    setIsPressing(false);
    if (longPressTriggered && e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div key={date} className="flex flex-col items-center no-select">
      <Button
        onPointerDown={startPress}
        onPointerUp={endPress}
        onPointerLeave={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        variant="ghost"
        className="w-10 h-10 flex items-center justify-center rounded-md bg-transparent hover:bg-inherit select-none"
      >
        {habit.type === "boolean" ? (
          <span style={{ color: textColor }} className="text-2xl font-bold">
            {isCompleted ? "✓" : "✗"}
          </span>
        ) : (
          <div
            style={{ color: textColor }}
            className="flex flex-col items-center"
          >
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