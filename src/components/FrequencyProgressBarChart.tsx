import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Habit } from "@/types"

function getPeriodRange(period: "week" | "month" | "quarter" | "year") {
  const now = new Date()
  let start: Date
  const end: Date = new Date(now)
  switch (period) {
    case "week":
      start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      break
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case "quarter":
      start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      break
    case "year":
      start = new Date(now.getFullYear(), 0, 1)
      break
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
  if (habit.type === "boolean") {
    // For boolean, target is always 1 per period
    return { value: total, target: days }
  } else if (habit.type === "measurable") {
    let target = habit.target
    if (period === "week" && habit.frequencyDays === 7)
      target = habit.target
    else if (period === "month" && habit.frequencyDays === 30)
      target = habit.target
    else if (period === "quarter")
      target = habit.target * 3
    else if (period === "year")
      target = habit.target * 12
    return { value: total, target }
  }
  return { value: total, target: days }
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
      percent: Math.min((value / target) * 100, 100),
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
          <Tooltip formatter={(value: number, name, props) => [`${value} / ${props.payload.target}`, "Progress"]} />
          <Bar dataKey="value" fill={habit.color} background />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}