import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habit";
import { useState, forwardRef, useImperativeHandle } from "react";
import { ColorSelect } from "./ColorSelect";
import { FrequencyDialog } from "./FrequencyDialog";

type PartialHabit = Partial<Habit> & {
  name: string;
  type: "boolean" | "measurable";
  color: string;
  target: number;
};

interface HabitFormProps {
  initialHabit?: Habit;
  onSave: (habit: PartialHabit) => void;
}

type FrequencyType = "everyDay" | "everyXDays" | "timesPerWeek" | "timesPerMonth" | "timesInXDays";

export const HabitForm = forwardRef<{ save: () => void }, HabitFormProps>(({
  initialHabit,
  onSave,
}, ref) => {
  const [habitType, setHabitType] = useState<"boolean" | "measurable" | null>(
    initialHabit?.type || null
  );
  const [habit, setHabit] = useState<PartialHabit>(
    initialHabit || { 
      name: "", 
      description: "", 
      type: "boolean", 
      target: 1, 
      unit: "", 
      frequencyDays: undefined, 
      color: "#FF0000",
      isArchived: false,
    }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Expose save method to parent via ref
  useImperativeHandle(ref, () => ({
    save: handleSave
  }));

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
    }));
  }

  const handleTypeSelection = (type: "boolean" | "measurable") => {
    setHabitType(type);
    setHabit((prev) => ({
      ...prev,
      type,
      // Reset type-specific fields when changing type
      target: type === "boolean" ? 1 : prev.target,
      unit: type === "boolean" ? "" : prev.unit,
      frequencyDays: undefined,
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!habit.name.trim()) newErrors.name = "Name is required.";
    if (habit.type === "measurable") {
      if (!habit.unit?.trim()) newErrors.unit = "Unit is required.";
      if (!habit.target || isNaN(habit.target) || habit.target <= 0) newErrors.target = "Target must be a positive number.";
      if (!habit.frequencyDays) newErrors.frequencyDays = "Frequency is required.";
    }
    if (habit.type === "boolean") {
      if (!habit.frequencyDays) newErrors.frequencyDays = "Frequency is required.";
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSave(habit);
    }
  };

  // If no type is selected and this is a new habit, show type selection
  if (!habitType && !initialHabit) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-4">What type of habit would you like to create?</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-auto p-4 text-left"
              onClick={() => handleTypeSelection("boolean")}
            >
              <div>
                <div className="font-medium">Yes/No Habit</div>
                <div className="text-sm text-muted-foreground">
                  Track completion (e.g., "Did I exercise today?")
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full h-auto p-4 text-left"
              onClick={() => handleTypeSelection("measurable")}
            >
              <div>
                <div className="font-medium">Measurable Habit</div>
                <div className="text-sm text-muted-foreground">
                  Track quantities (e.g., "How many km did I run?")
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          value={habit.name}
          onChange={(e) => setHabit((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Habit name"
        />
        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input
          value={habit.description || ""}
          onChange={(e) => setHabit((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Habit description"
        />
      </div>
      
      {/* Show type as read-only when editing */}
      {initialHabit && (
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
            {habit.type === "boolean" ? "Yes/No" : "Measurable"}
          </div>
        </div>
      )}

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
            {errors.frequencyDays && <div className="text-red-500 text-xs mt-1">{errors.frequencyDays}</div>}
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
            <label className="block text-sm font-medium mb-1">Unit</label>
            <Input
              value={habit.unit || ""}
              onChange={(e) => setHabit((prev) => ({ ...prev, unit: e.target.value }))}
              placeholder="Unit (e.g., km, minutes)"
            />
            {errors.unit && <div className="text-red-500 text-xs mt-1">{errors.unit}</div>}
          </div>
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
            {errors.target && <div className="text-red-500 text-xs mt-1">{errors.target}</div>}
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
            {errors.frequencyDays && <div className="text-red-500 text-xs mt-1">{errors.frequencyDays}</div>}
          </div>
        </>
      )}
    </div>
  );
});

HabitForm.displayName = "HabitForm";