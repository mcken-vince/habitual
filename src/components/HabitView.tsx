import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { EditIcon } from "lucide-react";
import { HabitHeatmap } from "./HabitHeatmap";
import { HabitForm } from "./HabitForm";

interface HabitViewProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onUpdateHabit: (id: string, updatedHabit: Partial<Habit>) => void;
}
import { calculateHabitScore } from "@/lib/scoring";

export const HabitView = ({ habit, isOpen, onClose, onUpdateHabit }: HabitViewProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const allDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const score = calculateHabitScore(habit); // Calculate the score

  return (
    <Sheet open={isOpen && !!habit} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-full w-full p-4">
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center w-full justify-between">
            {habit.name}
            {!isEditing && (
              <Button variant="ghost" onClick={() => setIsEditing(true)} className="p-2">
                <EditIcon className="w-5 h-5" />
              </Button>
            )}
          </SheetTitle>
          <SheetClose />
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
              {habit.type === "boolean" && habit.frequencyTimes && habit.frequencyDays && (
                <div>
                  <p className="text-sm font-medium">Frequency:</p>
                  <p>{habit.frequencyTimes} times every {habit.frequencyDays} days</p>
                </div>
              )}
              {habit.type === "measurable" && habit.frequencyDays && (
                <div>
                  <p className="text-sm font-medium">Frequency:</p>
                  <p>{habit.target} {habit.unit} every {habit.frequencyDays} days</p>
                </div>
              )}
              {habit.type === "measurable" && (
                <>
                  <div>
                    <p className="text-sm font-medium">Target:</p>
                    <p>{habit.target}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Unit:</p>
                    <p>{habit.unit}</p>
                  </div>

                  {/* Pass all dates to the HabitHeatmap */}
              <HabitHeatmap habit={habit} dates={allDates} />
                </>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};