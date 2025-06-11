import { Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

interface SimplePieProps { percentage: number, color: string, size?: string | number };

export function SimplePie({ percentage = 0, color, size = '32px' }: SimplePieProps) {
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
      style={{ height: size, width: size }}
      className="aspect-square"
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
