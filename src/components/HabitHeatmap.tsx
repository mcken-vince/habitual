import { Habit } from "@/types";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useEffect, useRef } from "react";
import { addAlpha } from "@/lib/color";

interface HabitHeatmapProps {
  habit: Habit;
  dates: string[];
}

export const HabitHeatmap = ({ habit, dates }: HabitHeatmapProps) => {
  const getColorIntensity = (value: number): string => {
    const color = habit.color;
    if (value === 0) return "var(--color-gray-200)"; // No completion
    if (value < habit.target! / 2) return addAlpha( color, 0.25); // Partial completion
    if (value < habit.target!) return addAlpha(color, .5); // Near completion
    return color; // Full completion
  };

const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get the scroll viewport from the ScrollArea component
    const scrollArea = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    )
    if (scrollArea) {
      scrollArea.scrollLeft = scrollArea.scrollWidth
    }
  }, [])

  return (
    <ScrollArea ref={scrollAreaRef} className="w-full h-fit pb-4">
      <div className="flex flex-col flex-wrap max-h-70 gap-1 w-fit">
        {dates.map((date) => {
          const value = habit.history[date] || 0;
          return (
            <div
              key={date}
              className="w-8 h-8 pt-1 rounded flex align-center justify-center"
              style={{backgroundColor: getColorIntensity(value)}}
              title={`${date}: ${value} ${habit.unit || ""}`}
            >{new Date(date).getDate()}</div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};