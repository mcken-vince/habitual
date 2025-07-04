import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { HabitForm } from "./HabitForm";
import { useRef } from "react";
import { Habit } from "@/types";
import { useHabits } from "@/hooks/useHabits";

interface HabitFormSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  initialHabit?: Habit;
}

export const HabitFormSheet = ({ open, onClose, onSave, initialHabit }: HabitFormSheetProps) => {
  const { addHabit, updateHabit } = useHabits();
  const habitFormRef = useRef<{ save: () => void }>(null);
  return (
    <Sheet open={open} onOpenChange={() => onClose()} >
      <SheetContent side="bottom" className="h-full p-4 z-50" hideCloseButton>
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center w-full justify-between">
            <div className="flex flex-row items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="p-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
              <span>{initialHabit ? 'Edit' : 'New'} Habit</span>
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
          </SheetTitle>
        </SheetHeader>
        <HabitForm
          ref={habitFormRef}
          initialHabit={initialHabit}
          onSave={(habit) => {
            if (habit.id) {
              updateHabit(habit.id, habit);
              onSave(habit as Habit);
            } else {
              addHabit({
                id: Date.now().toString(),
                ...habit,
                history: {},
                createdAt: new Date().toISOString(),
              });
            }
            onClose();
          }}
        />
      </SheetContent>
    </Sheet>
  );
}