import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

export const Settings = ({ open, onClose }: { open: boolean, onClose: (value: boolean) => void }) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-full p-4" hideCloseButton>
        <SheetHeader>
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