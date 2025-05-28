import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type FrequencyType = "everyDay" | "everyXDays" | "timesPerWeek" | "timesPerMonth" | "timesInXDays";

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
  const [dialogFrequencyType, setDialogFrequencyType] = useState<FrequencyType>(initialFrequencyType);
  const [dialogFrequencyDays, setDialogFrequencyDays] = useState<number>(initialFrequencyDays);
  const [dialogTarget, setDialogTarget] = useState<number>(initialTarget);

  useEffect(() => {
    if (open) {
      setDialogFrequencyType(initialFrequencyType);
      setDialogFrequencyDays(initialFrequencyDays);
      setDialogTarget(initialTarget);
    }
  }, [open, initialFrequencyType, initialFrequencyDays, initialTarget]);

  function handleSave() {
    onSave(dialogFrequencyType, dialogFrequencyDays, dialogTarget);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="font-semibold text-lg mb-2">Set Frequency</div>
        </DialogHeader>
        <RadioGroup
          value={dialogFrequencyType}
          onValueChange={(value) => setDialogFrequencyType(value as FrequencyType)}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="everyDay" id="everyDay" />
            <label htmlFor="everyDay" className="cursor-pointer">Every day</label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="everyXDays" id="everyXDays" />
            <label htmlFor="everyXDays" className="cursor-pointer flex items-center">
              Every
              <Input
                className="inline w-14 mx-2"
                type="number"
                min={2}
                value={dialogFrequencyType === "everyXDays" ? dialogFrequencyDays : 2}
                disabled={dialogFrequencyType !== "everyXDays"}
                onChange={e => setDialogFrequencyDays(parseInt(e.target.value, 10))}
              />
              days
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="timesPerWeek" id="timesPerWeek" />
            <label htmlFor="timesPerWeek" className="cursor-pointer flex items-center">
              <Input
                className="inline w-14 mx-2"
                type="number"
                min={1}
                max={7}
                value={dialogFrequencyType === "timesPerWeek" ? dialogTarget : 1}
                disabled={dialogFrequencyType !== "timesPerWeek"}
                onChange={e => setDialogTarget(parseInt(e.target.value, 10))}
              />
              times per week
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="timesPerMonth" id="timesPerMonth" />
            <label htmlFor="timesPerMonth" className="cursor-pointer flex items-center">
              <Input
                className="inline w-14 mx-2"
                type="number"
                min={1}
                max={30}
                value={dialogFrequencyType === "timesPerMonth" ? dialogTarget : 1}
                disabled={dialogFrequencyType !== "timesPerMonth"}
                onChange={e => setDialogTarget(parseInt(e.target.value, 10))}
              />
              times per month
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="timesInXDays" id="timesInXDays" />
            <label htmlFor="timesInXDays" className="cursor-pointer flex items-center">
              <Input
                className="inline w-14 mx-2"
                type="number"
                min={1}
                value={dialogFrequencyType === "timesInXDays" ? dialogTarget : 1}
                disabled={dialogFrequencyType !== "timesInXDays"}
                onChange={e => setDialogTarget(parseInt(e.target.value, 10))}
              />
              times in
              <Input
                className="inline w-14 mx-2"
                type="number"
                min={1}
                value={dialogFrequencyType === "timesInXDays" ? dialogFrequencyDays : 7}
                disabled={dialogFrequencyType !== "timesInXDays"}
                onChange={e => setDialogFrequencyDays(parseInt(e.target.value, 10))}
              />
              days
            </label>
          </div>
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