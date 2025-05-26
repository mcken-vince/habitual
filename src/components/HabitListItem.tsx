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
      <div className="flex flex-row items-center gap-2 border-b py-2">
        <div className="p-2 min-w-30 flex flex-row flex-grow-1" onClick={onClick}>
          <SimplePie percentage={score} color={habit.color}/>
          <h3 className="text-md font-semibold">{habit.name}</h3>
        </div>
        <div className="grid"
          style={{ gridTemplateColumns: `repeat(${visibleDates.length}, 1fr)` }}>
          {visibleDates.map((date) => (
            <HabitDateCell
              key={date}
              habit={habit}
              date={date}
              onClick={() => setSelectedDate(date)}
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