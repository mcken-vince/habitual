import { useMemo, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Habit } from "@/types"
import { MiniBar } from "@/components/MiniBar"
import { parseDateStringLocal } from "@/lib/dates"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettings } from "@/hooks/useSettings"
import { type Grouping, getPeriodKey, getPeriodLabel, getWeekLabel, getAllPeriodKeys } from "./helpers"

export function HistoryWidget({ habit }: { habit: Habit }) {
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