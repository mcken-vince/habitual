import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Habit } from "@/types";
import { useState } from "react";
import { ColorSelect } from "./ColorSelect";
import { FrequencyDialog } from "./FrequencyDialog";

interface HabitFormProps {
  initialHabit?: Partial<Habit> & { name: string; type: "boolean" | "measurable", color: string; };
  onSave: (habit: Partial<Habit> & { name: string; type: "boolean" | "measurable", color: string; }) => void;
  onCancel: () => void;
}

type FrequencyType = "everyDay" | "everyXDays" | "timesPerWeek" | "timesPerMonth" | "timesInXDays";

export const HabitForm = ({ initialHabit, onSave, onCancel }: HabitFormProps) => {
  const [habit, setHabit] = useState<Partial<Habit> & { name: string; type: "boolean" | "measurable"; color: string; }>(
    initialHabit || { name: "", description: "", type: "boolean", target: 1, unit: "", frequencyDays: undefined, color: "#000000" }
  );

    // Helper to summarize frequency
  function getFrequencySummary() {
    if (habit.frequencyDays === 1 && habit.target === 1) return "Every day";
    if (habit.frequencyDays && habit.target === 1) return `Every ${habit.frequencyDays} days`;
    if (habit.frequencyDays === 7) return `${habit.target || 1} times per week`;
    if (habit.frequencyDays === 30) return `${habit.target || 1} times per month`;
    if (habit.frequencyDays && habit.target) return `${habit.target} times in ${habit.frequencyDays} days`;
    return "Select frequency";
  }

  // Local state for dialog editing
  const [frequencyDialogOpen, setFrequencyDialogOpen] = useState(false);

  // Compute dialog initial values from habit
  function getDialogFrequencyType(): FrequencyType {
    if (habit.frequencyDays === 1 && habit.target === 1) return "everyDay";
    if (habit.frequencyDays && habit.target === 1) return "everyXDays";
    if (habit.frequencyDays === 7) return "timesPerWeek";
    if (habit.frequencyDays === 30) return "timesPerMonth";
    if (habit.frequencyDays && habit.target) return "timesInXDays";
    return "everyDay";
  }

  function openFrequencyDialog() {
    setFrequencyDialogOpen(true);
  }

  function handleFrequencyDialogSave(type: FrequencyType, days: number, times: number) {
    let frequencyDays = 1, target = 1;
    if (type === "everyDay") {
      frequencyDays = 1; target = 1;
    } else if (type === "everyXDays") {
      frequencyDays = days; target = 1;
    } else if (type === "timesPerWeek") {
      frequencyDays = 7; target = times;
    } else if (type === "timesPerMonth") {
      frequencyDays = 30; target = times;
    } else if (type === "timesInXDays") {
      frequencyDays = days; target = times;
    }
    setHabit((prev) => ({
      ...prev,
      frequencyDays,
      target,
      frequencyType: type,
    }));
  }

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

      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <ColorSelect
          color={habit.color}
          onChange={(value) =>
            setHabit((prev) => ({
              ...prev,
              color: value,
            }))
          }
        />
      </div>
      {habit.type === "boolean" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <Button variant="outline" onClick={openFrequencyDialog}>
              {getFrequencySummary()}
            </Button>
            <FrequencyDialog
              open={frequencyDialogOpen}
              onOpenChange={setFrequencyDialogOpen}
              initialFrequencyType={getDialogFrequencyType()}
              initialFrequencyDays={habit.frequencyDays || 7}
              initialTarget={habit.target || 1}
              onSave={handleFrequencyDialogSave}
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
          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <Select
              value={
                habit.frequencyDays === 1
                  ? "daily"
                  : habit.frequencyDays === 7
                    ? "weekly"
                    : habit.frequencyDays === 30
                      ? "monthly"
                      : ""
              }
              onValueChange={(value) => {
                let days: number | undefined;
                if (value === "daily") days = 1;
                else if (value === "weekly") days = 7;
                else if (value === "monthly") days = 30;
                else days = undefined;
                setHabit((prev) => ({
                  ...prev,
                  frequencyDays: days,
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Every Day</SelectItem>
                <SelectItem value="weekly">Every Week</SelectItem>
                <SelectItem value="monthly">Every Month</SelectItem>
              </SelectContent>
            </Select>
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
