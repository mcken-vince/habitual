import { useMemo, useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Habit } from "@/types"
import { MiniBar } from "./MiniBar"

type Grouping = "week" | "month" | "quarter" | "year"

function getPeriodKey(date: Date, grouping: Grouping) {
  const year = date.getFullYear()
  if (grouping === "week") {
    // ISO week number
    const firstDayOfYear = new Date(year, 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
    return `${year}-W${week}`
  }
  if (grouping === "month") {
    return `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`
  }
  if (grouping === "quarter") {
    const quarter = Math.floor(date.getMonth() / 3) + 1
    return `${year}-Q${quarter}`
  }
  if (grouping === "year") {
    return `${year}`
  }
  return ""
}

function getPeriodLabel(key: string, grouping: Grouping) {
  if (grouping === "week") return key.replace("-", " W")
  if (grouping === "month") {
    const [year, month] = key.split("-")
    return `${year} ${new Date(Number(year), Number(month) - 1).toLocaleString("default", { month: "short" })}`
  }
  if (grouping === "quarter") return key.replace("-", " ")
  if (grouping === "year") return key
  return key
}

function getFirstDayOfISOWeek(year: number, week: number) {
  // ISO week: Monday is the first day of the week
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

function getWeekLabel(key: string, prevKey: string | null) {
  // key: "YYYY-Wn"
  const [yearStr, weekStr] = key.split("-W");
  const year = Number(yearStr);
  const week = Number(weekStr);
  const firstDay = getFirstDayOfISOWeek(year, week);
  if (!prevKey) {
    // Always show month+year for the first bar
    return `${firstDay.toLocaleString("default", { month: "short" })} '${String(year).slice(-2)}`
  }
  const [prevYearStr, prevWeekStr] = prevKey.split("-W")
  const prevYear = Number(prevYearStr);
  const prevWeek = Number(prevWeekStr);
  const prevFirstDay = getFirstDayOfISOWeek(prevYear, prevWeek)
  if (
    firstDay.getMonth() !== prevFirstDay.getMonth() ||
    firstDay.getFullYear() !== prevFirstDay.getFullYear()
  ) {
    // First week of a new month
    return `${firstDay.toLocaleString("default", { month: "short" })} '${String(year).slice(-2)}`;
  }
  // Otherwise, show the date of the first day of the week
  return firstDay.toLocaleDateString(undefined, { day: "numeric" });
}

export function HabitHistoryBarChart({ habit }: { habit: Habit }) {
  const [grouping, setGrouping] = useState<Grouping>("week");

  const data = useMemo(() => {
    const counts: Record<string, number> = {}
    Object.entries(habit.history).forEach(([dateStr, value]) => {
      const date = new Date(dateStr)
      const key = getPeriodKey(date, grouping)
      counts[key] = (counts[key] || 0) + value
    });
    // Sort keys chronologically
    const sortedKeys = Object.keys(counts).sort();
    return sortedKeys.map((key, idx) => {
      let label = getPeriodLabel(key, grouping);
      if (grouping === "week") {
        const prevKey = idx > 0 ? sortedKeys[idx - 1] : null
        label = getWeekLabel(key, prevKey)
      }
      return {
        period: label,
        completions: counts[key],
        key,
      };
    });
  }, [habit.history, grouping]);

  const maxCompletions = data.reduce((max, d) => Math.max(max, d.completions), 0);
  const yTicks = maxCompletions <= 5 ? maxCompletions : 5;
  const yAxisLabels = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxCompletions / yTicks) * (yTicks - i))
  );

  return (
    <div className="w-full h-64 mb-8">
      <div className="flex w-full justify-between items-center mb-2">
        <span className="text-md font-medium">History</span>
        <Select value={grouping} onValueChange={v => setGrouping(v as Grouping)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="quarter">Quarter</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-row items-end h-50 mt-4 pb-2 relative">
        {/* Y Axis grid lines */}
        <div className="absolute left-0 top-0 w-full h-48 z-0 pointer-events-none">
          {yAxisLabels.map((label, i) => (
            <div
              key={i}
              className="flex items-center absolute left-0 w-full"
              style={{
                top: `${(100 / yTicks) * i}%`,
                height: 0,
              }}
            >
              <div className="w-full border-t border-solid border-gray-200 " />
              {/* <span
                className="absolute -left-7 text-[10px] text-gray-400 select-none bg-white pr-1"
                style={{ transform: "translateY(-50%)" }}
              >
                {label}
              </span> */}
            </div>
          ))}
        </div>
        {/* Bars */}
        <div className="flex w-full justify-end items-end h-38 ml-4 z-10">
          {data.map((entry) => (
            <MiniBar
              key={entry.key}
              value={entry.completions}
              max={maxCompletions}
              label={entry.period}
              width="w-3"
              color={habit.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}