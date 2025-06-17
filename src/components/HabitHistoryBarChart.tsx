import { useMemo, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Habit } from "@/types"
import { MiniBar } from "./MiniBar"
import { parseDateStringLocal } from "@/lib/dates"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useSettings } from "@/hooks/useSettings"

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
    // Use date utils for parsing
    return `${year} ${parseDateStringLocal(`${year}-${month}-01`).toLocaleString("default", { month: "short" })}`
  }
  if (grouping === "quarter") return key.replace("-", " ")
  if (grouping === "year") return key
  return key
}

function getFirstDayOfWeek(year: number, week: number, startDayOfWeek: number) {
  // Calculate the first day of the given week number, using the user's preferred start day
  const jan1 = new Date(year, 0, 1);
  const jan1Day = jan1.getDay();
  const daysOffset = (startDayOfWeek - jan1Day + 7) % 7;
  const firstWeekStart = new Date(jan1);
  firstWeekStart.setDate(jan1.getDate() + daysOffset);
  const weekStart = new Date(firstWeekStart);
  weekStart.setDate(firstWeekStart.getDate() + (week - 1) * 7);
  return weekStart;
}

function getWeekLabel(key: string, prevKey: string | null, startDayOfWeek: number) {
  // key: "YYYY-Wn"
  const [yearStr, weekStr] = key.split("-W");
  const year = Number(yearStr);
  const week = Number(weekStr);
  const firstDay = getFirstDayOfWeek(year, week, startDayOfWeek);
  if (!prevKey) {
    return `${firstDay.toLocaleString("default", { month: "short" })} '${String(year).slice(-2)}`;
  }
  const [prevYearStr, prevWeekStr] = prevKey.split("-W");
  const prevYear = Number(prevYearStr);
  const prevWeek = Number(prevWeekStr);
  const prevFirstDay = getFirstDayOfWeek(prevYear, prevWeek, startDayOfWeek);
  if (
    firstDay.getMonth() !== prevFirstDay.getMonth() ||
    firstDay.getFullYear() !== prevFirstDay.getFullYear()
  ) {
    return `${firstDay.toLocaleString("default", { month: "short" })} '${String(year).slice(-2)}`;
  }
  return firstDay.toLocaleDateString(undefined, { day: "numeric" });
}

function getAllPeriodKeys(habit: Habit, grouping: Grouping) {
  // Find min and max date in history
  const dateStrings = Object.keys(habit.history);
  if (dateStrings.length === 0) return [];
  const dates = dateStrings.map(parseDateStringLocal);
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  // Always include up to today
  const today = new Date();
  if (maxDate < today) maxDate.setTime(today.getTime());

  const keys: string[] = [];
  if (grouping === "week") {
    // Find the first and last ISO week
    const current = new Date(minDate);
    // Set to Monday of the first week
    current.setDate(current.getDate() - ((current.getDay() + 6) % 7));
    while (current <= maxDate) {
      keys.push(getPeriodKey(current, "week"));
      current.setDate(current.getDate() + 7);
    }
  } else if (grouping === "month") {
    const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (current <= maxDate) {
      keys.push(getPeriodKey(current, "month"));
      current.setMonth(current.getMonth() + 1);
    }
  } else if (grouping === "quarter") {
    const current = new Date(minDate.getFullYear(), Math.floor(minDate.getMonth() / 3) * 3, 1);
    while (current <= maxDate) {
      keys.push(getPeriodKey(current, "quarter"));
      current.setMonth(current.getMonth() + 3);
    }
  } else if (grouping === "year") {
    const current = new Date(minDate.getFullYear(), 0, 1);
    while (current <= maxDate) {
      keys.push(getPeriodKey(current, "year"));
      current.setFullYear(current.getFullYear() + 1);
    }
  }
  return keys;
}

export function HabitHistoryBarChart({ habit }: { habit: Habit }) {
  const [grouping, setGrouping] = useState<Grouping>("week");
  const { settings } = useSettings();
  const startDayOfWeek = settings.startDayOfWeek ?? 0;

  const data = useMemo(() => {
    const counts: Record<string, number> = {}
    Object.entries(habit.history).forEach(([dateStr, value]) => {
      // Use date utils for parsing
      const date = parseDateStringLocal(dateStr)
      const key = getPeriodKey(date, grouping)
      counts[key] = (counts[key] || 0) + value
    });

    // Get all period keys in range, even if no completions
    const allKeys = getAllPeriodKeys(habit, grouping);

    // Sort keys chronologically
    const sortedKeys = allKeys.length > 0 ? allKeys : Object.keys(counts).sort();

    return sortedKeys.map((key, idx) => {
      let label = getPeriodLabel(key, grouping);
      if (grouping === "week") {
        const prevKey = idx > 0 ? sortedKeys[idx - 1] : null
        label = getWeekLabel(key, prevKey, startDayOfWeek)
      }
      return {
        period: label,
        completions: counts[key] || 0,
        key,
      };
    });
  }, [habit, grouping]);

  const maxCompletions = data.reduce((max, d) => Math.max(max, d.completions), 0);
  const yTicks = maxCompletions <= 5 ? maxCompletions : 5;
  const yAxisLabels = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxCompletions / yTicks) * (yTicks - i))
  );

  return (
    <Card>
      <CardHeader className="flex w-full justify-between items-center mb-2">
        <CardTitle>History</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="w-full h-45 mb-8">
          <div className="flex flex-row items-end h-50 mt-4 pb-2 relative">
            {/* Y Axis grid lines */}
            <div className="absolute left-0 top-0 w-full h-48 z-0 pointer-events-none">
              {yAxisLabels.map((_label, i) => (
                <div
                  key={i}
                  className="flex items-center absolute left-0 w-full"
                  style={{
                    top: `${(100 / yTicks) * i}%`,
                    height: 0,
                  }}
                >
                  <div className="w-full border-t border-solid border-gray-200 " />
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
      </CardContent>
    </Card>
  );
}