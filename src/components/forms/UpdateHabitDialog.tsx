import { Habit } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { CheckIcon, XIcon } from "lucide-react";

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

      <DialogContent className="flex flex-col items-center w-fit min-w-xs">
        <DialogTitle>{date}</DialogTitle>
        {habit.type === "boolean" ? (
          <div className="flex align-items gap-2">
          
          <Button onClick={() => {
            onSave(1);
            onClose();
          }} className="w-15"><CheckIcon /></Button>
          <Button variant="secondary" onClick={() => {
            onSave(0);
            onClose();
          }} className="w-15"><XIcon /></Button>
          </div>
        ) : (
          <div className="flex align-items gap-2">
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