import { Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

export function SimplePie({percentage = 0, color}: {percentage: number, color: string}) {
const chartConfig = {
  score: {
    color: color,
  },
  remaining: {
    color: "var(--color-gray-200)",
  },
} satisfies ChartConfig

  return (
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-8"
        >
          <PieChart>
            <Pie
              data={[{ name: "score", value: percentage, fill: "var(--color-score)" }, { name: "remaining", value: 100 - percentage, fill: "var(--color-remaining)" }]}
              dataKey="value"
              nameKey="name"
              innerRadius="50%"
            />
          </PieChart>
        </ChartContainer>
    )
}
