import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const colors = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#EAB308", // Yellow
  "#84CC16", // Lime
  "#22C55E", // Green
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#0EA5E9", // Sky
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#D946EF", // Fuchsia
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#64748B", // Slate
  "#71717A", // Gray
  "#000000", // Black
];

interface ColorModalProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorModal = ({ color, onChange }: ColorModalProps) => {
  const [open, setOpen] = useState(false);
  const currentColor = color || colors[0];

  const handleColorSelect = (selectedColor: string) => {
    onChange(selectedColor);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          type="button"
          className="flex items-center gap-3 px-3 py-2 border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <div
            className="w-8 h-8 rounded-md border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: currentColor }}
          />
          <span className="text-sm font-medium">Select color</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a Color</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-3 mt-4">
          {colors.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              onClick={() => handleColorSelect(colorOption)}
              className={cn(
                "relative w-full aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                currentColor === colorOption
                  ? "border-primary shadow-lg scale-110 ring-2 ring-primary ring-offset-2"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-md"
              )}
              style={{ backgroundColor: colorOption }}
              aria-label={`Select color ${colorOption}`}
            >
              {currentColor === colorOption && (
                <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-200">
                  <div className={cn(
                    "rounded-full p-1 shadow-sm",
                    colorOption === "#000000" ? "bg-white" : "bg-white/90"
                  )}>
                    <Check className={cn(
                      "w-5 h-5 text-black"
                    )} strokeWidth={3} />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
