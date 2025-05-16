import { Habit } from "@/types";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useEffect, useRef } from "react";
import { addAlpha } from "@/lib/color";

interface HabitHeatmapProps {
  habit: Habit;
  dates: string[];
}

function padDatesToSunday(dates: string[]) {
  if (dates.length === 0) return [];
  const firstDate = new Date(dates[0]);
  const dayOfWeek = firstDate.getDay(); // 0 = Sunday
  const paddedDates = [...dates];
  for (let i = 1; i <= dayOfWeek; i++) {
    const d = new Date(firstDate);
    d.setDate(d.getDate() - i);
    paddedDates.unshift(d.toISOString().slice(0, 10));
  }
  return paddedDates;
}

function groupDatesByWeek(dates: string[]) {
  const weeks: string[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }
  return weeks;
}

export const HabitHeatmap = ({ habit, dates }: HabitHeatmapProps) => {
  const getColorIntensity = (value: number): string => {
    const color = habit.color;
    if (value === 0) return "var(--color-gray-200)"; // No completion
    if (value < habit.target! / 2) return addAlpha(color, 0.25); // Less than half completion
    if (value < habit.target!) return addAlpha(color, 0.5); // Over half completion
    return color; // Full completion
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (scrollArea) {
      scrollArea.scrollLeft = scrollArea.scrollWidth;
    }
  }, []);

  // Pad dates so the first column starts on a Sunday
  const paddedDates = padDatesToSunday(dates);

  // Group dates into weeks (columns)
  const weeks = groupDatesByWeek(paddedDates);
  const maxDays = 7;

  // Month labels above each week (column)
  const monthLabels = weeks.map((week, idx) => {
    const containsFirstOfMonth = week.some(date => {
      const d = new Date(date);
      return d.getDate() === 1;
    })
    
    const lastDate = week[0];
    const showLabel = idx === 0 || containsFirstOfMonth;
    const currentMonth = new Date(lastDate).toLocaleString("default", {
      month: "short",
    });
    return (
      <div
        key={lastDate + "-month-label"}
        className="w-8 text-xs text-center"
        style={{ visibility: showLabel ? "visible" : "hidden" }}
      >
        {currentMonth}
      </div>
    );
  });

  return (
    <ScrollArea ref={scrollAreaRef} className="w-full h-fit pb-4">
      <div className="flex flex-col">
        {/* Month labels */}
        <div className="flex gap-1 mb-1 ml-8">
          {monthLabels}
        </div>
        {/* Heatmap grid */}
        <div className="flex gap-1 w-fit">
          {weeks.map((week, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1">
              {Array.from({ length: maxDays }).map((_, rowIdx) => {
                const date = week[rowIdx];
                if (!date) {
                  return <div key={`empty-${colIdx}-${rowIdx}`} className="w-8 h-8" />;
                }
                const value = habit.history[date] || 0;
                return (
                  <div
                    key={date}
                    className="w-8 h-8 pt-1 rounded flex align-center justify-center"
                    style={{ backgroundColor: getColorIntensity(value) }}
                    title={`${date}: ${value} ${habit.unit || ""}`}
                  >
                    {new Date(date).getDate()}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};