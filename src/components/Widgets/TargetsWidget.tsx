import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Habit } from "@/types"
import { addAlpha } from "@/lib/color"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettings } from "@/hooks/useSettings"

function getPeriodRange(period: "week" | "month" | "quarter" | "year", startDayOfWeek: number = 0) {
  const now = new Date()
  let start: Date
  let end: Date
  switch (period) {
    case "week": {
      start = new Date(now);
      // Adjust to user start day
      const day = now.getDay();
      const diff = (day - startDayOfWeek + 7) % 7;
      start.setDate(now.getDate() - diff);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    }
    case "month": {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      break
    }
    case "quarter": {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      start = new Date(now.getFullYear(), quarterStartMonth, 1)
      end = new Date(now.getFullYear(), quarterStartMonth + 3, 0)
      break
    }
    case "year": {
      start = new Date(now.getFullYear(), 0, 1)
      end = new Date(now.getFullYear(), 12, 0)
      break
    }
  }
  return { start, end }
}

function getProgress(habit: Habit, period: "week" | "month" | "quarter" | "year", startDayOfWeek: number = 0) {
  const { start, end } = getPeriodRange(period, startDayOfWeek);
  let total = 0
  let days = 0
  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    const key = d.toISOString().slice(0, 10)
    total += habit.history[key] || 0
    days++
  }
  let target = habit.target / (habit.frequencyDays ?? 1) * days
  if (habit.type === 'boolean') {
    // Clamp boolean habit target to not exceed days in period
    target = Math.min(target, days)
  }

  return { value: total, target: Math.round(target) }
}

export function TargetsWidget({ habit }: { habit: Habit }) {
  const { settings } = useSettings();
  const startDayOfWeek = settings.startDayOfWeek ?? 0;
  const periods = [
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "This Quarter" },
    { key: "year", label: "This Year" },
  ] as const

  const data: { name: string, value: number, target: number, percent: number }[] = periods.map(({ key, label }) => {
    const { value, target } = getProgress(habit, key, startDayOfWeek)
    return {
      name: label,
      value,
      target,
      percent: Math.min((value / target * 100), 100),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Target</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip
                formatter={(_, __, props) => [
                  `${props.payload.value} / ${props.payload.target}`,
                  "Progress"
                ]}
              />
              <Bar dataKey="percent" fill={addAlpha(habit.color, 0.7)} background />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}