import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { EditIcon } from "lucide-react";
import { HabitHeatmap } from "./HabitHeatmap";

interface HabitViewProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onUpdateHabit: (id: string, updatedHabit: Partial<Habit>) => void;
}

export const HabitView = ({ habit, isOpen, onClose, onUpdateHabit }: HabitViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHabit, setEditedHabit] = useState(habit);

  const handleSave = () => {
    onUpdateHabit(habit.id, editedHabit);
    setIsEditing(false);
  };

  // Generate a complete list of dates (e.g., last 30 days)
  const generateDates = (days: number) => {
    const dates = [];
    const currentDate = new Date();
    for (let i = 0; i < days; i++) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return dates.reverse(); // Ensure chronological order
  };

  const allDates = generateDates(30); // Generate the last 30 days

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
          {!isEditing ? (
            <>
              <div>
                <p className="text-sm font-medium">Name:</p>
                <p>{habit.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Description:</p>
                <p>{habit.description}</p>
              </div>
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
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={editedHabit.name}
                  onChange={(e) => setEditedHabit({ ...editedHabit, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={editedHabit.description}
                  onChange={(e) => setEditedHabit({ ...editedHabit, description: e.target.value })}
                />
              </div>
              {habit.type === "measurable" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Target</label>
                    <Input
                      type="number"
                      value={editedHabit.target || ""}
                      onChange={(e) =>
                        setEditedHabit({ ...editedHabit, target: parseInt(e.target.value, 10) })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <Input
                      value={editedHabit.unit || ""}
                      onChange={(e) => setEditedHabit({ ...editedHabit, unit: e.target.value })}
                    />
                  </div>
                </>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};