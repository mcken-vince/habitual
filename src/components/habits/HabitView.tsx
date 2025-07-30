import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeftIcon, EditIcon, TrashIcon } from "lucide-react";
import { calculateHabitScore } from "@/lib/scoring";
import { UpdateHabitDialog } from "@/components/forms";
import { HabitInfoCard, OverviewWidget, TargetsWidget, ScoreWidget, HistoryWidget, CalendarWidget } from "@/components/widgets/index";
import { getDatesInRange, parseDateStringLocal } from "@/lib/dates";

interface HabitViewProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onUpdateHabit: (id: string, updatedHabit: Partial<Habit>) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
}

export const HabitView = ({ habit, isOpen, onClose, onUpdateHabit, onEditHabit, onDeleteHabit }: HabitViewProps) => {
  const [editDate, setEditDate] = useState<string | null>(null);

  const scoreHistory = useMemo(() => {
    const allDates = getDatesInRange(new Date, 365, true); // Get all dates in the last year
    return allDates.map((dateStr, idx) => {
      // Build a partial history up to and including this date
      const partialHistory: typeof habit.history = {};
      for (let i = 0; i <= idx; i++) {
        const d = allDates[i];
        // Always include the date, defaulting to 0 if not present
        partialHistory[d] = habit.history[d] !== undefined ? habit.history[d] : 0;
      }
      // Calculate score for this day
      const habitForDay = { ...habit, history: partialHistory };
      const date = parseDateStringLocal(dateStr);
      return {
        date: dateStr,
        value: calculateHabitScore(habitForDay, date),
      };
    });
  }, [habit]);

  return (
    <Sheet open={isOpen && !!habit} modal={true}>
      <SheetContent side="bottom" className="h-full w-full p-4 overflow-y-auto" hideCloseButton>
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center w-full justify-between">
            <div className="flex flex-row items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onClose} className="p-2">
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
              <span>{habit.name}</span>
            </div>
            <div className="flex flex-row gap-2">
              <Button variant="ghost" onClick={() => onEditHabit(habit)} className="p-2">
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
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <HabitInfoCard habit={habit} />

          <OverviewWidget habit={habit} />

          <TargetsWidget habit={habit} />

          <ScoreWidget data={scoreHistory} color={habit.color} />

          <HistoryWidget habit={habit} />

          <CalendarWidget
            habit={habit}
            onDateClick={(date: string) => {
              if (habit.type === "boolean") {
                onUpdateHabit(habit.id, {
                  ...habit,
                  history: {
                    ...habit.history,
                    [date]: habit.history[date] ? 0 : 1
                  }
                });
              } else {
                setEditDate(date)
              }
            }}
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