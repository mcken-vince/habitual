import { Habit } from "@/types";
import { useState } from "react";
import { HabitDateCell } from "./HabitDateCell";
import { calculateHabitScore } from "@/lib/scoring";
import { SimplePie } from "./SimplePie";
import { UpdateHabitDialog } from "./UpdateHabitDialog";

interface HabitListItemProps {
  habit: Habit;
  updateCompletion: (habitId: string, date: string, value: number) => void;
  onClick: () => void;
  visibleDates: string[];
}

export function HabitListItem({
  habit,
  updateCompletion,
  onClick,
  visibleDates,
}: HabitListItemProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const score = calculateHabitScore(habit); // Calculate the score

  return (
    <div>
      <div className="flex flex-row items-center gap-2 py-1 border-b">
        <div className="min-w-30 flex flex-row flex-grow-1" onClick={onClick}>
          <SimplePie percentage={score} color={habit.color}/>
          <h3 className="text-sm font-semibold my-auto leading-3.5">{habit.name}</h3>
        </div>
        <div className="grid"
          style={{ gridTemplateColumns: `repeat(${visibleDates.length}, 1fr)` }}>
          {visibleDates.map((date) => (
            <HabitDateCell
              key={date}
              habit={habit}
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