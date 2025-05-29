import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ArrowLeftIcon, EditIcon } from "lucide-react";
import { HabitHeatmap } from "./HabitHeatmap";
import { HabitForm } from "./HabitForm";
import { calculateHabitScore } from "@/lib/scoring";
import { InteractiveLineChart } from "./InteractiveLineChart";
import { getDatesInRange } from "@/lib/dates";
import { UpdateHabitDialog } from "./UpdateHabitDialog";
import { FrequencyProgressBarChart } from "./FrequencyProgressBarChart";

interface HabitViewProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onUpdateHabit: (id: string, updatedHabit: Partial<Habit>) => void;
}

export const HabitView = ({ habit, isOpen, onClose, onUpdateHabit }: HabitViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState<string | null>(null);

  const allDates = getDatesInRange(new Date, 365, true); // Get all dates in the last year

  const score = calculateHabitScore(habit); // Calculate the score
  const scoreHistory = allDates.map((date, idx) => {
    // Build a partial history up to and including this date
    const partialHistory: typeof habit.history = {};
    for (let i = 0; i <= idx; i++) {
      const d = allDates[i];
      if (habit.history[d] !== undefined) {
        partialHistory[d] = habit.history[d];
      }
    }
    // Calculate score for this day
    const habitForDay = { ...habit, history: partialHistory };
    return {
      date,
      value: calculateHabitScore(habitForDay),
    };
  });

  // const formattedHistory = allDates.map((date) => {
  //   const value = habit.history[date] || 0; // Default to 0 if no value exists for the date
  //   return {
  //     date,
  //     value,
  //   };
  // })

  return (
    <Sheet open={isOpen && !!habit} modal={true}>
      <SheetContent side="bottom" className="h-full w-full p-4 overflow-y-auto [&>button:first-of-type]:hidden">
        <SheetHeader >
          <SheetTitle className="flex flex-row items-center w-full justify-between">
            <div className="flex flex-row items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onClose} className="p-2">
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
              <span>{habit.name}</span>
            </div>
            {!isEditing && (
              <Button variant="ghost" onClick={() => setIsEditing(true)} className="p-2">
                <EditIcon className="w-5 h-5" />
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          {isEditing ? (
            <HabitForm
              initialHabit={habit}
              onSave={(updatedHabit) => {
                onUpdateHabit(habit.id, updatedHabit);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div>
                <p className="text-sm font-medium">Score:</p>
                <p>{score.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Description:</p>
                <p>{habit.description}</p>
              </div>
              {habit.type === "boolean" && habit.target && habit.frequencyDays && (
                <div>
                  <p className="text-sm font-medium">Frequency:</p>
                  <p>{habit.target} times every {habit.frequencyDays} days</p>
                </div>
              )}
              {habit.type === "measurable" && habit.frequencyDays && (
                <div>
                  <p className="text-sm font-medium">Frequency:</p>
                  <p>
                    {habit.target} {habit.unit} every {habit.frequencyDays} days
                  </p>
                </div>
              )}
              <FrequencyProgressBarChart habit={habit} />
              <InteractiveLineChart data={scoreHistory} color={habit.color} />
            </>
          )}
          {/* Pass all dates to the HabitHeatmap */}
          <HabitHeatmap
            habit={habit}
            dates={allDates}
            editable={isEditing}
            onDateClick={
              isEditing
                ? (date) => {
                  if (habit.type === "boolean") {
                    onUpdateHabit(habit.id, { ...habit, history: { ...habit.history, [date]: habit.history[date] ? 0 : 1 } });
                  } else {
                    setEditDate(date)
                  }
                }
                : undefined
            }
          />
          <UpdateHabitDialog
            habit={habit}
            date={editDate}
            open={!!editDate}
            onClose={() => setEditDate(null)}
            onSave={(value) => {
              if (editDate) {
                onUpdateHabit(habit.id, {
                  history: {
                    ...habit.history,
                    [editDate]: value,
                  },
                });
              }
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};