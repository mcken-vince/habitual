import { ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { useSettings } from "@/hooks/useSettings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export const Settings = ({ open, onClose }: { open: boolean, onClose: (value: boolean) => void }) => {
  const { settings, updateSettings } = useSettings();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-full p-4" hideCloseButton>
        <SheetHeader className="flex flex-row items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onClose(false)} className="p-2">
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {/* Start day of week setting */}
          <div>
            <label className="block text-sm font-medium mb-1">Start day of week</label>
            <Select
              name="startDayOfWeek"
              value={(settings.startDayOfWeek ?? 0).toString()}

              onValueChange={value => updateSettings({ startDayOfWeek: Number(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6 })}

            >
              <SelectTrigger>
                <SelectValue placeholder="Select start day of week" />
              </SelectTrigger>
              <SelectContent>

                <SelectItem value={'0'}>Sunday</SelectItem>
                <SelectItem value={'1'}>Monday</SelectItem>
                <SelectItem value={'2'}>Tuesday</SelectItem>
                <SelectItem value={'3'}>Wednesday</SelectItem>
                <SelectItem value={'4'}>Thursday</SelectItem>
                <SelectItem value={'5'}>Friday</SelectItem>
                <SelectItem value={'6'}>Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}