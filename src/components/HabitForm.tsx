import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Habit } from "@/types";
import { useState } from "react";

interface HabitFormProps {
  initialHabit?: Partial<Habit> & { name: string; type: "boolean" | "measurable" };
  onSave: (habit: Partial<Habit> & { name: string; type: "boolean" | "measurable" }) => void;
  onCancel: () => void;
}

export const HabitForm = ({ initialHabit, onSave, onCancel }: HabitFormProps) => {
  const [habit, setHabit] = useState<Partial<Habit> & { name: string; type: "boolean" | "measurable" }>(
    initialHabit || { name: "", description: "", type: "boolean", target: 1, unit: "", frequencyTimes: undefined, frequencyDays: undefined }
  );

  const handleSave = () => {
    if (habit.name.trim()) {
      onSave(habit);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          value={habit.name}
          onChange={(e) => setHabit((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Habit name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input
          value={habit.description || ""}
          onChange={(e) => setHabit((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Habit description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Select
          value={habit.type}
          onValueChange={(value) => setHabit((prev) => ({ ...prev, type: value as Habit["type"] }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select habit type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="boolean">Yes/No</SelectItem>
            <SelectItem value="measurable">Numeric</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {habit.type === "boolean" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Times</label>
            <Input
              type="number"
              value={habit.frequencyTimes || ""}
              onChange={(e) =>
                setHabit((prev) => ({
                  ...prev,
                  frequencyTimes: parseInt(e.target.value, 10),
                }))
              }
              placeholder="Number of times"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Days</label>
            <Input
              type="number"
              value={habit.frequencyDays || ""}
              onChange={(e) =>
                setHabit((prev) => ({
                  ...prev,
                  frequencyDays: parseInt(e.target.value, 10),
                }))
              }
              placeholder="Number of days"
            />
          </div>
        </>
      )}
      {habit.type === "measurable" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Target</label>
            <Input
              type="number"
              value={habit.target || ""}
              onChange={(e) =>
                setHabit((prev) => ({
                  ...prev,
                  target: parseInt(e.target.value, 10),
                }))
              }
              placeholder="Target value"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <Input
              value={habit.unit || ""}
              onChange={(e) => setHabit((prev) => ({ ...prev, unit: e.target.value }))}
              placeholder="Unit (e.g., km, minutes)"
            />
          </div>
        </>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};
