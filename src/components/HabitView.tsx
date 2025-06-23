import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ArrowLeftIcon, EditIcon, TrashIcon } from "lucide-react";
import { HabitCalendar } from "./HabitCalendar";
import { HabitForm } from "./HabitForm";
import { calculateHabitScore } from "@/lib/scoring";
import { InteractiveLineChart } from "./InteractiveLineChart";
import { getDatesInRange } from "@/lib/dates";
import { UpdateHabitDialog } from "./UpdateHabitDialog";
import { FrequencyProgressBarChart } from "./FrequencyProgressBarChart";
import { HabitHistoryBarChart } from "./HabitHistoryBarChart";
import { HabitOverview } from "./HabitOverview";

interface HabitViewProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onUpdateHabit: (id: string, updatedHabit: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
}

export const HabitView = ({ habit, isOpen, onClose, onUpdateHabit, onDeleteHabit }: HabitViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState<string | null>(null);

  const allDates = getDatesInRange(new Date, 365, true); // Get all dates in the last year

  const scoreHistory = useMemo(() => {
    return allDates.map((date, idx) => {
      // Build a partial history up to and including this date
      const partialHistory: typeof habit.history = {};
      for (let i = 0; i <= idx; i++) {
        const d = allDates[i];
        // Always include the date, defaulting to 0 if not present
        partialHistory[d] = habit.history[d] !== undefined ? habit.history[d] : 0;
      }
      // Calculate score for this day
      const habitForDay = { ...habit, history: partialHistory };
      return {
        date,
        value: calculateHabitScore(habitForDay),
      };
    });
  }, [habit, allDates]);

  return (
    <Sheet open={isOpen && !!habit} modal={true}>
      <SheetContent side="bottom" className="h-full w-full p-4 overflow-y-auto" hideCloseButton>
        <SheetHeader >
          <SheetTitle className="flex flex-row items-center w-full justify-between">
            <div className="flex flex-row items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onClose} className="p-2">
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
              <span>{habit.name}</span>
            </div>
            {!isEditing && (
              <div className="flex flex-row gap-2">
                <Button variant="ghost" onClick={() => setIsEditing(true)} className="p-2">
                  <EditIcon className="w-5 h-5" />
                </Button>
                <Button variant="ghost"
                  onClick={() => {
                    onDeleteHabit(habit.id);
                    onClose();
                  }}
                  className="p-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </div>
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
              <HabitOverview habit={habit} />

              <FrequencyProgressBarChart habit={habit} />

              <InteractiveLineChart data={scoreHistory} color={habit.color} />

              <HabitHistoryBarChart habit={habit} />

              <HabitCalendar
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
            </>
          )}
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