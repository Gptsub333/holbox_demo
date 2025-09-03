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

const regions = [
  { name: 'North America', color: 'bg-blue-600', bar: 'bg-blue-500', value: 38 },
  { name: 'Europe', color: 'bg-emerald-600', bar: 'bg-emerald-500', value: 28 },
  { name: 'Asia', color: 'bg-amber-600', bar: 'bg-amber-500', value: 22 },
  { name: 'Australia', color: 'bg-rose-600', bar: 'bg-rose-500', value: 12 },
];

export function TaskCompletionChart() {
  return (
    <>
      {/* <Card>
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
    </Card> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Nationality of Visitors</h2>
        <div className="mt-5 grid grid-cols-1 items-start gap-6 sm:grid-cols-5">
          {/* Map side (subtle background image) */}
          <div className="relative col-span-3 overflow-hidden ">
            <svg
              viewBox="0 0 400 180"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <pattern id="map-grid" width="60" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#map-grid)" />
            </svg>

            <img
              src="/world-map.png"
              alt="World map"
              className="relative z-[1] h-40 w-full rounded-lg object-cover opacity-70"
            />
            {/* soft dots to hint locations */}
            <div className="pointer-events-none absolute inset-0 z-[2]">
              <span className="absolute left-[30%] top-[35%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/70" />
              <span className="absolute left-[55%] top-[32%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/70" />
              <span className="absolute left-[65%] top-[45%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/70" />
              <span className="absolute left-[82%] top-[75%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/70" />
            </div>
          </div>

          {/* Legend side */}
          <div className="col-span-2">
            <ul className="space-y-3">
              {regions.map((r) => (
                <li key={r.name} className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${r.color}`} aria-hidden="true" />
                  <div className="w-full">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800">{r.name}</span>
                      <span className="font-semibold">{r.value}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
                      <div className={`h-1.5 rounded-full ${r.bar}`} style={{ width: `${r.value}%` }} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
