"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Success", value: 1174, color: "#3B82F6" },  // blue-300 in hex
  { name: "In Progress", value: 73, color: "#FBBF24" }, // yellow-200 in hex
  { name: "Failed", value: 42, color: "#F87171" }, // red-200 in hex
]

const chartConfig = {
  success: {
    label: "Success",
    color: "#3B82F6", // blue-300 in hex
  },
  progress: {
    label: "In Progress",
    color: "#FBBF24", // yellow-200 in hex
  },
  failed: {
    label: "Failed",
    color: "#F87171", // red-200 in hex
  },
}

export function TaskDistributionChart() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Task Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={5} animationDuration={900}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                content={({ payload }) => {
                  return (
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 justify-center pt-4">
                      {payload.map((entry) => (
                        <li key={entry.value} className="flex items-center gap-2 text-sm font-medium">
                          <span className="h-2 w-2 rounded-full " style={{ backgroundColor: entry.color }} />
                          <span className="text-muted-foreground">{entry.value}</span>
                        </li>
                      ))}
                    </ul>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
