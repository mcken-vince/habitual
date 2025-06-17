import { Habit } from "@/types";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useEffect, useRef } from "react";
import { addAlpha, isColorDark } from "@/lib/color";
import { toDateStringLocal, parseDateStringLocal } from "@/lib/dates";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useSettings } from "@/hooks/useSettings";

interface HabitHeatmapProps {
  habit: Habit;
  dates: string[];
  editable?: boolean;
  onDateClick?: (date: string, value: number) => void;
}

function padDatesToWeekStart(dates: string[], startDayOfWeek: number) {
  if (dates.length === 0) return [];
  const firstDate = parseDateStringLocal(dates[0]);
  const dayOfWeek = firstDate.getDay();
  // Calculate how many days to pad before the first date
  const pad = (dayOfWeek - startDayOfWeek + 7) % 7;
  const paddedDates = [...dates];
  for (let i = 1; i <= pad; i++) {
    const d = new Date(firstDate);
    d.setDate(firstDate.getDate() - i);
    paddedDates.unshift(toDateStringLocal(d));
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

export const HabitHeatmap = ({
  habit,
  dates,
  editable = false,
  onDateClick
}: HabitHeatmapProps) => {
  const { settings } = useSettings();
  const startDayOfWeek = settings.startDayOfWeek ?? 0;
  const getColorIntensity = (value: number): string => {
    
    const color = habit.color;
    if (value === 0) return "var(--color-gray-200)"; // No completion
    if (value < habit.target! / 2) return addAlpha(color, 0.3); // Less than half completion
    if (value < habit.target!) return addAlpha(color, 0.5); // Over half completion
    return addAlpha(color, 0.7); // Full completion (lighter for accessibility)
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

  // Pad dates so the first column starts on the user's preferred start day
  const paddedDates = padDatesToWeekStart(dates, startDayOfWeek);

  // Group dates into weeks (columns)
  const weeks = groupDatesByWeek(paddedDates);
  const maxDays = 7;

  // Month labels above each week (column)
  const monthLabels = weeks.map((week, idx) => {
    // Find the first date in the week that is the 1st of a month
    const firstOfMonthDate = week.find(date => {
      const d = parseDateStringLocal(date);
      return d.getDate() === 1;
    });
    // Use the 1st of the month if present, otherwise the first date in the week
    const labelDate = firstOfMonthDate || week[0];
    // Show label if it's the first column or the week contains the 1st of a month
    const showLabel = idx === 0 || !!firstOfMonthDate;
    const currentMonth = parseDateStringLocal(labelDate).toLocaleString("en-US", { month: "short" });
    return (
      <div
        key={labelDate + "-month-label"}
        className="w-8 text-xs text-center"
        style={{ visibility: showLabel ? "visible" : "hidden" }}
      >
        {currentMonth}
      </div>
    );
  });

  return (
    <Card>
      <CardHeader><CardTitle>Calendar</CardTitle></CardHeader>
      <CardContent>
        <ScrollArea ref={scrollAreaRef} className="w-full h-fit pb-4">
          <div className="flex flex-col">
            {/* Month labels */}
            <div className="flex gap-1 mb-1 ml-8 select-none">
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
                    const bgColor = getColorIntensity(value);
                    // Extract alpha from addAlpha if used
                    let alpha = 1;
                    const alphaMatch = bgColor.match(/rgba\([^)]+, ([\d.]+)\)/);
                    if (alphaMatch) alpha = parseFloat(alphaMatch[1]);
                    const textColor =
                      bgColor.startsWith("#") && isColorDark(habit.color, alpha)
                        ? "#fff"
                        : undefined;
                    return (
                      <div
                        key={date}
                        className={`w-8 h-8 pt-1 rounded flex align-center justify-center select-none ${editable ? "cursor-pointer hover:opacity-80" : ""}`}
                        style={{
                          backgroundColor: bgColor,
                          color: textColor,
                        }}
                        title={`${date}: ${value} ${habit.unit || ""}`}
                        onClick={
                          editable
                            ? () => onDateClick?.(date, value)
                            : undefined
                        }
                      >
                        {parseDateStringLocal(date).getDate()}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};