import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { type FrequencyType } from "@/lib/habitFormHelpers";
import { FrequencyOption } from "./FrequencyOption";

interface FrequencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFrequencyType: FrequencyType;
  initialFrequencyDays: number;
  initialTarget: number;
  onSave: (type: FrequencyType, days: number, times: number) => void;
}

export function FrequencyDialog({
  open,
  onOpenChange,
  initialFrequencyType,
  initialFrequencyDays,
  initialTarget,
  onSave,
}: FrequencyDialogProps) {
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(initialFrequencyType);
  const [frequencyDays, setFrequencyDays] = useState<number>(initialFrequencyDays);
  const [target, setTarget] = useState<number>(initialTarget);

  // Reset dialog state when opened
  useEffect(() => {
    if (open) {
      setFrequencyType(initialFrequencyType);
      setFrequencyDays(initialFrequencyDays);
      setTarget(initialTarget);
    }
  }, [open, initialFrequencyType, initialFrequencyDays, initialTarget]);

  const handleFrequencyTypeChange = useCallback((type: FrequencyType) => {
    setFrequencyType(type);
    // Set sensible defaults when switching frequency types
    switch (type) {
      case "everyDay":
        setFrequencyDays(1);
        setTarget(1);
        break;
      case "everyXDays":
        if (frequencyDays <= 1) setFrequencyDays(2);
        setTarget(1);
        break;
      case "timesPerWeek":
        setFrequencyDays(7);
        if (target > 7) setTarget(7);
        break;
      case "timesPerMonth":
        setFrequencyDays(30);
        if (target > 30) setTarget(Math.min(target, 30));
        break;
      case "timesInXDays":
        if (frequencyDays <= 1) setFrequencyDays(7);
        if (target < 1) setTarget(1);
        break;
    }
  }, [frequencyDays, target]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'frequencyDays' | 'target') => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      if (type === 'frequencyDays') {
        setFrequencyDays(value);
      } else {
        setTarget(value);
      }
    }
  }, []);

  const handleSave = useCallback(() => {
    onSave(frequencyType, frequencyDays, target);
    onOpenChange(false);
  }, [frequencyType, frequencyDays, target, onSave, onOpenChange]);

  const inputClassName = "inline w-14 mx-2";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg mb-2">Set Frequency</DialogTitle>
        </DialogHeader>

        <RadioGroup
          value={frequencyType}
          onValueChange={handleFrequencyTypeChange}
        >
          <FrequencyOption
            id="everyDay"
            onSelect={handleFrequencyTypeChange}
          >
            Every day
          </FrequencyOption>

          <FrequencyOption
            id="everyXDays"
            onSelect={handleFrequencyTypeChange}
          >
            Every
            <Input
              type="number"
              className={inputClassName}
              value={frequencyType === "everyXDays" ? frequencyDays : 2}
              onChange={(e) => handleInputChange(e, 'frequencyDays')}
              disabled={frequencyType !== "everyXDays"}
              min={2}
            />
            days
          </FrequencyOption>

          <FrequencyOption
            id="timesPerWeek"
            onSelect={handleFrequencyTypeChange}
          >
            <Input
              type="number"
              className={inputClassName}
              value={frequencyType === "timesPerWeek" ? target : 1}
              onChange={(e) => handleInputChange(e, 'target')}
              disabled={frequencyType !== "timesPerWeek"}
              min={1}
              max={7}
            />
            times per week
          </FrequencyOption>

          <FrequencyOption
            id="timesPerMonth"
            onSelect={handleFrequencyTypeChange}
          >
            <Input
              type="number"
              className={inputClassName}
              value={frequencyType === "timesPerMonth" ? target : 1}
              onChange={(e) => handleInputChange(e, 'target')}
              disabled={frequencyType !== "timesPerMonth"}
              min={1}
              max={30}
            />
            times per month
          </FrequencyOption>

          <FrequencyOption
            id="timesInXDays"
            onSelect={handleFrequencyTypeChange}
          >
            <Input
              type="number"
              className={inputClassName}
              value={frequencyType === "timesInXDays" ? target : 1}
              onChange={(e) => handleInputChange(e, 'target')}
              disabled={frequencyType !== "timesInXDays"}
              min={1}
            />
            times in
            <Input
              type="number"
              className={inputClassName}
              value={frequencyType === "timesInXDays" ? frequencyDays : 7}
              onChange={(e) => handleInputChange(e, 'frequencyDays')}
              disabled={frequencyType !== "timesInXDays"}
              min={1}
            />
            days
          </FrequencyOption>
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