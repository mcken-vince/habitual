import { Habit } from "@/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useRef, useState } from "react";
import { isColorDark } from "@/lib/color";
import { parseDateStringLocal } from "@/lib/dates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon, CheckIcon } from "lucide-react";
import { extractAlpha, getColorIntensity, getDatesInYear, getMonthLabelForWeek, getYearRange, groupDatesByWeek, padDatesToWeekStart } from "./helpers";

interface CalendarWidgetProps {
  habit: Habit;
  onDateClick?: (date: string, value: number) => void;
}

export const CalendarWidget = ({
  habit,
  onDateClick
}: CalendarWidgetProps) => {
  const { settings } = useSettings();
  const startDayOfWeek = settings.startDayOfWeek ?? 0;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isEditMode, setIsEditMode] = useState(false);

  const dates = useMemo(() => getDatesInYear(selectedYear), [selectedYear]);

  // Find the earliest and latest years that have habit data
  const habitDates = Object.keys(habit.history);
  const currentYear = new Date().getFullYear();
  const { minYear } = getYearRange(habitDates, currentYear, isEditMode);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (scrollArea) {
      scrollArea.scrollLeft = scrollArea.scrollWidth;
    }
  }, [selectedYear]);

  // Pad dates so the first column starts on the user's preferred start day
  const paddedDates = padDatesToWeekStart(dates, startDayOfWeek);

  // Group dates into weeks (columns)
  const weeks = groupDatesByWeek(paddedDates);
  const maxDays = 7;

  // Month labels above each week (column)
  const monthLabels = weeks.map((week, index) => {
    const labelInfo = getMonthLabelForWeek(week);
    return (
      <div
        key={`month-label-${index}`}
        className="w-8 text-xs text-center"
        style={{ visibility: labelInfo.visible ? "visible" : "hidden" }}
      >
        {labelInfo.month}
      </div>
    );
  });

  // Allow users to go back at least 10 years in edit mode
  // Otherwise, let them go back to the earliest habit data in view mode
  const canGoPrevious = selectedYear > Math.min(minYear, isEditMode ? currentYear - 10 : minYear);
  const canGoNext = selectedYear < currentYear;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Calendar</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedYear(prev => prev - 1)}
              disabled={!canGoPrevious}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[4rem] text-center">
              {selectedYear}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedYear(prev => prev + 1)}
              disabled={!canGoNext}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedYear(currentYear)}
              title="Jump to Current Year"
            >
              <CalendarIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={isEditMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
              title={isEditMode ? "Exit edit mode" : "Enter edit mode"}
            >
              {isEditMode ? <CheckIcon className="w-4 h-4" /> : <EditIcon className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea ref={scrollAreaRef} className="w-full h-fit pb-4">
          <div className="flex flex-col">
            {/* Month labels */}
            <div className="flex gap-1 mb-1 select-none">
              {monthLabels}
            </div>
            {/* Heatmap grid */}
            <div className="flex gap-1 w-fit">
              {weeks.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-1">
                  {Array.from({ length: maxDays }).map((_, rowIdx) => {
                    const date = week[rowIdx];
                    const isNotSelectedYear = date && parseDateStringLocal(date).getFullYear() !== selectedYear;
                    // If the date is not in the selected year, show an empty cell
                    if (!date || isNotSelectedYear) {
                      return <div key={`empty-${colIdx}-${rowIdx}`} className="w-8 h-8" />;
                    }
                    const value = habit.history[date] || 0;
                    const bgColor = getColorIntensity(value, habit.target, habit.color);
                    // Extract alpha from addAlpha if used
                    const alpha = extractAlpha(bgColor);
                    const textColor =
                      bgColor.startsWith("#") && isColorDark(habit.color, alpha)
                        ? "#fff"
                        : undefined;
                    return (
                      <div
                        key={date}
                        className={`w-8 h-8 pt-1 rounded flex align-center justify-center select-none ${isEditMode ? "cursor-pointer hover:opacity-80" : ""}`}
                        style={{
                          backgroundColor: bgColor,
                          color: textColor
                        }}
                        title={`${date}: ${value} ${habit.unit || ""}`}
                        onClick={
                          isEditMode
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