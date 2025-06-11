import { ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

export const Settings = ({ open, onClose }: { open: boolean, onClose: (value: boolean) => void }) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-full p-4" hideCloseButton>
        <SheetHeader className="flex flex-row items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onClose(false)} className="p-2">
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        {/* Add your settings form or content here */}
        <div>
          <p>Settings go here.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}