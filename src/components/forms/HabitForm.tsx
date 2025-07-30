import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habit";
import { useState, forwardRef, useImperativeHandle } from "react";
import { FrequencyDialog, FormField, ColorSelect } from ".";
import { HabitTypeSelector } from "./HabitTypeSelector";
import { type PartialHabit, getDialogFrequencyType, getFrequencySummary } from "@/lib/habitFormHelpers";
import { useHabitFormState } from "@/hooks/useHabitFormState";

interface HabitFormProps {
  initialHabit?: Habit;
  onSave: (habit: PartialHabit) => void;
}

export const HabitForm = forwardRef<{ save: () => void }, HabitFormProps>(({
  initialHabit,
  onSave,
}, ref) => {
  const { habit, habitType, updateHabit, errors, handleTypeSelection, updateHabitFrequency, handleSave } = useHabitFormState(onSave, initialHabit);

  // Expose save method to parent via ref
  useImperativeHandle(ref, () => ({
    save: handleSave
  }));

  // Local state for dialog editing
  const [frequencyDialogOpen, setFrequencyDialogOpen] = useState(false);

  function openFrequencyDialog() {
    setFrequencyDialogOpen(true);
  };

  // If no type is selected and this is a new habit, show type selection
  if (!habitType && !initialHabit) {
    return (
      <HabitTypeSelector handleTypeSelection={handleTypeSelection} />
    );
  }

  return (
    <div className="space-y-4">
      <FormField label="Name" error={errors.name}>
        <Input
          value={habit.name}
          onChange={(e) => updateHabit({ name: e.target.value })}
          placeholder="Habit name"
        />
      </FormField>
      <FormField label="Description" >
        <Input
          value={habit.description || ""}
          onChange={(e) => updateHabit({ description: e.target.value })}
          placeholder="Habit description"
        />
      </FormField>

      {/* Show type as read-only when editing */}
      {initialHabit && (
        <FormField label="Type">
          <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
            {habit.type === "boolean" ? "Yes/No" : "Measurable"}
          </div>
        </FormField>
      )}

      <FormField label="Color">
        <ColorSelect
          color={habit.color}
          onChange={(value) =>
            updateHabit({ color: value })
          }
        />
      </FormField>
      {habit.type === "boolean" && (
        <>
          <FormField label="Frequency" error={errors.frequencyDays}>
            <Button variant="outline" onClick={openFrequencyDialog}>
              {getFrequencySummary(habit)}
            </Button>
          </FormField>
          <FrequencyDialog
            open={frequencyDialogOpen}
            onOpenChange={setFrequencyDialogOpen}
            initialType={getDialogFrequencyType(habit)}
            initialDays={habit.frequencyDays || 7}
            initialTarget={habit.target || 1}
            onSave={updateHabitFrequency}
          />
        </>
      )}
      {habit.type === "measurable" && (
        <>
          <FormField label="Unit" error={errors.unit}>
            <Input
              value={habit.unit || ""}
              onChange={(e) => updateHabit({ unit: e.target.value })}
              placeholder="Unit (e.g., km, minutes)"
            />
          </FormField>
          <FormField label="Target" error={errors.target}>
            <Input
              type="number"
              value={habit.target || ""}
              onChange={(e) =>
                updateHabit({ target: parseInt(e.target.value, 10) })
              }
              placeholder="Target value"
            />
          </FormField>

          <FormField label="Frequency" error={errors.frequencyDays}>
            <Select
              value={
                habit.frequencyDays === 1 ? "daily" :
                  habit.frequencyDays === 7 ? "weekly" :
                    habit.frequencyDays === 30 ? "monthly" : ""
              }
              onValueChange={(value) => {
                const frequencyMap: Record<string, number> = {
                  daily: 1,
                  weekly: 7,
                  monthly: 30,
                };
                updateHabit({ frequencyDays: frequencyMap[value] });
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
          </FormField>
        </>
      )}
    </div>
  );
});

HabitForm.displayName = "HabitForm";