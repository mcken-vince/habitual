import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Habit } from "@/types"

function getPeriodRange(period: "week" | "month" | "quarter" | "year") {
  const now = new Date()
  let start: Date
  let end: Date
  switch (period) {
    case "week": {
      start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      end = new Date(start)
      end.setDate(start.getDate() + 6)
      console.log("start", start, "end", end)
      break
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

function getProgress(habit: Habit, period: "week" | "month" | "quarter" | "year") {
  const { start, end } = getPeriodRange(period)
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

export function FrequencyProgressBarChart({ habit }: { habit: Habit }) {
  const periods = [
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "This Quarter" },
    { key: "year", label: "This Year" },
  ] as const

  const data: {name: string, value: number, target: number, percent: number}[] = periods.map(({ key, label }) => {
    const { value, target } = getProgress(habit, key)
    return {
      name: label,
      value,
      target,
      percent: Math.min((value / target * 100), 100),
    }
  })

  return (
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
          <Bar dataKey="percent" fill={habit.color} background />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}