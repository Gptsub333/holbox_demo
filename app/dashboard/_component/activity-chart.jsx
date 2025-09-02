"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts"

const data = [
  { time: "00:00", active: 12, idle: 8, failed: 1 },
  { time: "04:00", active: 8, idle: 14, failed: 2 },
  { time: "08:00", active: 18, idle: 4, failed: 2 },
  { time: "12:00", active: 22, idle: 2, failed: 0 },
  { time: "16:00", active: 20, idle: 3, failed: 1 },
  { time: "20:00", active: 16, idle: 6, failed: 2 },
]

const chartConfig = {
  active: {
    label: 'Active',
    color: '#3B82F6', // blue-300 in hex,
  },
  idle: {
    label: 'Idle',
    color: '#55A34A', // yellow-200 in hex
  },
  failed: {
    label: 'Failed',
    color: '#F87171', // red-200 in hex
  },
};

export function ActivityChart() {
  return (
    <>
      {/* <Card>
      <CardHeader>
        <CardTitle>Agent Activity Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-active)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-active)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIdle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-idle)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-idle)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
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
                tickCount={6}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                type="monotone"
                dataKey="active"
                strokeWidth={2}
                stroke="var(--color-active)"
                fillOpacity={1}
                fill="url(#colorActive)"
                animationDuration={900}
              />
              <Area
                type="monotone"
                dataKey="idle"
                strokeWidth={2}
                stroke="var(--color-idle)"
                fillOpacity={1}
                fill="url(#colorIdle)"
                animationDuration={900}
                animationDelay={200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card> */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Agent Leaderboard</h2>
        <ul className="mt-4 space-y-3">
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-active)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-active)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIdle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-idle)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-idle)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
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
                  tickCount={6}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  type="monotone"
                  dataKey="active"
                  strokeWidth={2}
                  stroke="var(--color-active)"
                  fillOpacity={1}
                  fill="url(#colorActive)"
                  animationDuration={900}
                />
                <Area
                  type="monotone"
                  dataKey="idle"
                  strokeWidth={2}
                  stroke="var(--color-idle)"
                  fillOpacity={1}
                  fill="url(#colorIdle)"
                  animationDuration={900}
                  animationDelay={200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ul>
      </div>
    </>
  );
}
