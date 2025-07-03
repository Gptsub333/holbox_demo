"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts"

const data = [
  { agent: "ChatBot", completed: 145 },
  { agent: "Face-Rekognition", completed: 132 },
  { agent: "TaskBot", completed: 98 },
  { agent: "WebBot", completed: 87 },
  { agent: "FileBot", completed: 76 },
]

const chartConfig = {
  completed: {
    label: "Completed Tasks",
    color: "#3B82F6",
  },
}

export function TaskCompletionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion by Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -10,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="agent"
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="completed" fill="var(--color-completed)" radius={4} animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
