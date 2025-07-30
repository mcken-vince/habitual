import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useMemo } from "react";
import { type FrequencyType } from "@/lib/habitFormHelpers";
import { FrequencyOption } from "./FrequencyOption";

interface FrequencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType: FrequencyType;
  initialDays: number;
  initialTarget: number;
  onSave: (type: FrequencyType, days: number, times: number) => void;
}

export function FrequencyDialog({
  open,
  onOpenChange,
  initialType,
  initialDays,
  initialTarget,
  onSave,
}: FrequencyDialogProps) {
  const [type, setType] = useState<FrequencyType>(initialType);
  const [days, setDays] = useState<number>(initialDays);
  const [target, setTarget] = useState<number>(initialTarget);

  // Update defaults based on current initial values
  const optionDefaults = useMemo(() => ({
    everyXDays: initialType === 'everyXDays' ? initialDays : 2,
    timesPerWeek: initialType === 'timesPerWeek' ? initialTarget : 3,
    timesPerMonth: initialType === 'timesPerMonth' ? initialTarget : 10,
    timesInXDays: {
      days: initialType === 'timesInXDays' ? initialDays : 7,
      times: initialType === 'timesInXDays' ? initialTarget : 3,
    }
  }), [initialType, initialDays, initialTarget]);

  // Reset dialog state when opened
  useEffect(() => {
    if (open) {
      setType(initialType);
      setDays(initialDays);
      setTarget(initialTarget);
    }
  }, [open, initialType, initialDays, initialTarget]);

  const handleFrequencyTypeChange = useCallback((type: FrequencyType) => {
    setType(type);
  }, []);

  const handleOptionUpdate = useCallback((days: number, times: number) => {
    setDays(days);
    setTarget(times);
  }, []);

  const handleSave = useCallback(() => {
    onSave(type, days, target);
    onOpenChange(false);
  }, [type, days, target, onSave, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg mb-2">Set Frequency</DialogTitle>
        </DialogHeader>

        <RadioGroup
          value={type}
          onValueChange={handleFrequencyTypeChange}
        >
          <FrequencyOption
            id="everyDay"
            isSelected={type === "everyDay"}
            onSelect={handleFrequencyTypeChange}
            onUpdate={handleOptionUpdate}
          />
          <FrequencyOption
            id="everyXDays"
            isSelected={type === "everyXDays"}
            onSelect={handleFrequencyTypeChange}
            onUpdate={handleOptionUpdate}
            initialDays={optionDefaults.everyXDays}
          />
          <FrequencyOption
            id="timesPerWeek"
            onSelect={handleFrequencyTypeChange}
            isSelected={type === "timesPerWeek"}
            onUpdate={handleOptionUpdate}
            initialTimes={optionDefaults.timesPerWeek}
          />
          <FrequencyOption
            id="timesPerMonth"
            onSelect={handleFrequencyTypeChange}
            isSelected={type === "timesPerMonth"}
            onUpdate={handleOptionUpdate}
            initialTimes={optionDefaults.timesPerMonth}
          />
          <FrequencyOption
            id="timesInXDays"
            onSelect={handleFrequencyTypeChange}
            isSelected={type === "timesInXDays"}
            onUpdate={handleOptionUpdate}
            initialDays={optionDefaults.timesInXDays.days}
            initialTimes={optionDefaults.timesInXDays.times}
          />
        </RadioGroup>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
