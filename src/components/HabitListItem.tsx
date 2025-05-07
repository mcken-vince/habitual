import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { HabitDateCell } from "./HabitDateCell";

export function HabitListItem({
  habit,
  today,
  updateCompletion,
  onClick,
}: {
  habit: Habit;
  today: string;
  updateCompletion: (habitId: string, date: string, value: number) => void; onClick: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [numericValue, setNumericValue] = useState<number>(0);

  // Generate an array of dates starting from today and going back 6 days
  const generateDates = (startDate: string, days: number) => {
    const dates = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < days; i++) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return dates;
  };

  const dates = generateDates(today, 5); // Generate 5 days of data (including today)

  const handleSave = () => {
    if (selectedDate) {
      updateCompletion(habit.id, selectedDate, numericValue);
      setSelectedDate(null); // Close the dialog
    }
  };

  return (
    <div>
      {/* Habit Row */}
      <div className="flex flex-row items-center gap-2 border-b py-2">
        {/* Habit Details */}
        <div className="p-2 min-w-30 flex flex-grow-1" onClick={onClick}>
          <h3 className="text-md font-semibold">{habit.name}</h3>
        </div>
        <div className="grid grid-cols-[repeat(5,1fr)]">

          {/* Habit Data for Each Day */}
          {dates.map((date) => (
            <HabitDateCell habit={habit} date={date} onClick={() => {
              setSelectedDate(date);
              setNumericValue(habit.history[date] || 0);
            }} />
          ))}
        </div>
      </div>

      {/* Dialog for Updating Habit */}
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
                  setSelectedDate(null); // Close the dialog
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