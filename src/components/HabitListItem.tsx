import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { HabitDateCell } from "./HabitDateCell";
import { calculateHabitScore } from "@/lib/scoring";
import { SimplePie } from "./SimplePie";

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
  const [numericValue, setNumericValue] = useState<number>(0);

  const handleSave = () => {
    if (selectedDate) {
      updateCompletion(habit.id, selectedDate, numericValue);
      setSelectedDate(null);
    }
  };

  const score = calculateHabitScore(habit); // Calculate the score

  return (
    <div>
      <div className="flex flex-row items-center gap-2 border-b py-2">
        <div className="p-2 min-w-30 flex flex-row flex-grow-1" onClick={onClick}>
          <SimplePie percentage={score} color={habit.color}/>
          <h3 className="text-md font-semibold">{habit.name}</h3>
        </div>
        <div className="grid grid-cols-[repeat(5,1fr)]">
          {visibleDates.map((date) => (
            <HabitDateCell
              key={date}
              habit={habit}
              date={date}
              onClick={() => {
                if (habit.type === "boolean") {
                  updateCompletion(habit.id, date, habit.history[date] ? 0 : 1);
                  return;
                }
                
                setSelectedDate(date);
                setNumericValue(habit.history[date] || 0);
              }}
            />
          ))}
        </div>
      </div>
      {selectedDate && (
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Habit</DialogTitle>
            </DialogHeader>
            {habit.type === "boolean" ? (
              <Button
                onClick={() => {
                  updateCompletion(habit.id, selectedDate, habit.history[selectedDate] ? 0 : 1);
                  setSelectedDate(null);
                }}
                variant={habit.history[selectedDate] ? "secondary" : "default"}
              >
                {habit.history[selectedDate] ? "Mark as Incomplete" : "Mark as Complete"}
              </Button>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm font-medium">Value</label>
                <Input
                  type="number"
                  value={numericValue}
                  onChange={(e) => setNumericValue(parseInt(e.target.value, 10))}
                />
                <Button onClick={handleSave}>Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}