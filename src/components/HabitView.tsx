import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeftIcon, EditIcon, TrashIcon, CheckIcon, XIcon } from "lucide-react";
import { HabitForm } from "@/components/HabitForm";
import { calculateHabitScore } from "@/lib/scoring";
import { UpdateHabitDialog } from "@/components/UpdateHabitDialog";
import { OverviewWidget, TargetsWidget, ScoreWidget, HistoryWidget, CalendarWidget } from "@/components/Widgets";
import { getDatesInRange } from "@/lib/dates";

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
  const habitFormRef = useRef<{ save: () => void }>(null);

  const scoreHistory = useMemo(() => {
    const allDates = getDatesInRange(new Date, 365, true); // Get all dates in the last year
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
  }, [habit]);

  return (
    <Sheet open={isOpen && !!habit} modal={true}>
      <SheetContent side="bottom" className="h-full w-full p-4 overflow-y-auto" hideCloseButton>
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center w-full justify-between">
            {!isEditing ? (
              // View mode header
              <>
                <div className="flex flex-row items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={onClose} className="p-2">
                    <ArrowLeftIcon className="w-5 h-5" />
                  </Button>
                  <span>{habit.name}</span>
                </div>
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
              </>
            ) : (
              <>
                <div className="flex flex-row items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(false)}
                    className="p-2"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                  </Button>
                  <span>Edit Habit</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (habitFormRef.current) {
                      habitFormRef.current.save();
                    }
                  }}
                  className="p-2"
                >
                  <CheckIcon className="w-5 h-5" />
                </Button>
              </>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          {isEditing ? (
            <HabitForm
              ref={habitFormRef}
              initialHabit={habit}
              onSave={(updatedHabit) => {
                onUpdateHabit(habit.id, updatedHabit);
                setIsEditing(false);
              }}
            />
          ) : (
            <>
              <OverviewWidget habit={habit} />

              <TargetsWidget habit={habit} />

              <ScoreWidget data={scoreHistory} color={habit.color} />

              <HistoryWidget habit={habit} />

              <CalendarWidget
                habit={habit}
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