import { Habit } from "@/types";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { isHabitSatisfiedOnDate } from "@/lib/habitSatisfaction";

interface HabitDateCellProps {
  habit: Habit;
  date: string;
  onPress: () => void;
  onLongPress: () => void;
}

export const HabitDateCell = ({ habit, date, onPress, onLongPress }: HabitDateCellProps) => {
  const [isPressing, setIsPressing] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isCompleted = habit.history[date]
  const isSatisfied = isHabitSatisfiedOnDate(habit, date)
  let textColor = "var(--color-gray-200)"
  let symbol = "✗"
  let opacity = 1

  if (isCompleted) {
    textColor = habit.color
    symbol = "✓"
    opacity = 1
  } else if (isSatisfied) {
    textColor = habit.color
    symbol = "✓"
    opacity = 0.4 // Lighten satisfied checkmark
  }

  useEffect(() => {
    if (isPressing) {
      timerRef.current = setTimeout(() => {
        setLongPressTriggered(true);
        onLongPress();
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
  }, [isPressing, onLongPress]);

  const startPress = () => {
    setLongPressTriggered(false);
    setIsPressing(true);
  };

  const endPress = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!longPressTriggered) {
      onPress();
    }
    setIsPressing(false);
  };

  return (
    <div key={date} className="flex flex-col items-center no-select">
      <Button
        onMouseDown={startPress}
        onMouseUp={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        variant="ghost"
        className="flex items-center justify-center rounded-md bg-transparent hover:bg-inherit select-none"
        style={{
          width: "var(--date-cell-width)",
          height: "var(--date-cell-width)",
        }}
      >
        {habit.type === "boolean" ? (
          <span style={{ color: textColor, opacity }} className="text-lg font-bold">
            {symbol}
          </span>
        ) : (
          <div
            style={{ color: textColor }}
            className="flex flex-col items-center"
          >
            <span className="text-lg font-semibold h-5">{habit.history[date] || 0}</span>
            {habit.type === "measurable" && (
              <span className="text-xs mt-1">{habit.unit}</span>
            )}
          </div>
        )}
      </Button>
    </div>
  );
};