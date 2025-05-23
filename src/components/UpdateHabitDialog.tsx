import { Habit } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface UpdateHabitDialogProps {
  habit: Habit;
  date: string | null;
  open: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
}

export function UpdateHabitDialog({
  habit,
  date,
  open,
  onClose,
  onSave,
}: UpdateHabitDialogProps) {
  const [numericValue, setNumericValue] = useState<number>(0);

  useEffect(() => {
    if (date) {
      setNumericValue(habit.history[date] || 0);
    }
  }, [date, habit.history]);

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Habit</DialogTitle>
        </DialogHeader>
        {habit.type === "boolean" ? (
          <Button
            onClick={() => {
              onSave(habit.history[date] ? 0 : 1);
              onClose();
            }}
            variant={habit.history[date] ? "secondary" : "default"}
          >
            {habit.history[date] ? "Mark as Incomplete" : "Mark as Complete"}
          </Button>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium">Value</label>
            <Input
              type="number"
              value={numericValue}
              onChange={(e) => setNumericValue(parseFloat(e.target.value))}
            />
            <Button
              onClick={() => {
                onSave(numericValue);
                onClose();
              }}
            >
              Save
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}