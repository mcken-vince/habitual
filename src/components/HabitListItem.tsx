import { Habit } from "@/types";
import { useState, useRef } from "react";
import { HabitDateCell } from "./HabitDateCell";
import { calculateHabitScore } from "@/lib/scoring";
import { SimplePie } from "./SimplePie";
import { UpdateHabitDialog } from "./UpdateHabitDialog";
import { GripVerticalIcon } from "lucide-react";

interface HabitListItemProps {
  habit: Habit;
  updateCompletion: (habitId: string, date: string, value: number) => void;
  onClick: () => void;
  onLongPress: () => void;
  isSelected: boolean;
  isDraggable?: boolean;
  visibleDates: string[];
}

export function HabitListItem({
  habit,
  updateCompletion,
  onClick,
  onLongPress,
  isSelected,
  isDraggable = false,
  visibleDates,
}: HabitListItemProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const score = calculateHabitScore(habit); // Calculate the score

  const handleMouseDown = () => {
    setIsLongPressing(false);
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      onLongPress();
    }, 500); // 500ms for long press
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!isLongPressing) {
      onClick();
    }
    setIsLongPressing(false);
  };

  const handleMouseLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  };

  const handleTouchStart = () => {
    setIsLongPressing(false);
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      onLongPress();
    }, 500);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e?.preventDefault();
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!isLongPressing) {
      onClick();
    }
    setIsLongPressing(false);
  };

  const habitColor = habit.isArchived ? 'gray' : habit.color

  return (
    <div className={`${isSelected ? 'border-3 border-slate-800 dark:border-slate-100' : ''} ${habit.isArchived ? 'bg-slate-50 dark:bg-slate-900' : ''}`}>
      <div className={`flex flex-row items-center gap-2 py-1 border-b`}>
        <div
          className="min-w-30 flex flex-row flex-grow-1 cursor-pointer select-none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isDraggable && (
            <div className="cursor-grab active:cursor-grabbing p-1 my-auto text-gray-400 hover:text-gray-600">
              <GripVerticalIcon size={16} />
            </div>
          )}
          <SimplePie percentage={score} color={habitColor} />
          <h3 className="text-sm font-semibold my-auto leading-3.5">{habit.name}</h3>
        </div>
        <div className="grid"
          style={{ gridTemplateColumns: `repeat(${visibleDates.length}, 1fr)` }}>
          {visibleDates.map((date) => (
            <HabitDateCell
              key={date}
              habit={{ ...habit, color: habitColor }}
              date={date}
              onPress={() => {
                setSelectedDate(date);
              }}
              onLongPress={() => {
                if (habit.type === "boolean") {
                  const isCompleted = habit.history[date];
                  updateCompletion(habit.id, date, isCompleted ? 0 : 1);
                } else {
                  setSelectedDate(date);
                }
              }}
            />
          ))}
        </div>
      </div>
      <UpdateHabitDialog
        habit={habit}
        date={selectedDate}
        open={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        onSave={(value) => {
          if (selectedDate) {
            updateCompletion(habit.id, selectedDate, value);
          }
        }}
      />
    </div>
  );
}