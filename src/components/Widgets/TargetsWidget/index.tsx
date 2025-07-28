import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Habit } from "@/types"
import { addAlpha } from "@/lib/color"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettings } from "@/hooks/useSettings"
import { getProgress } from "./helpers"

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