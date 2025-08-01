"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BarChart } from "lucide-react"

export default function Visualize({ onVisualize, isLoading, visualizations }) {
  const vizOptions = ["dist", "corr", "cat", "time"]
  console.log("Visualizations:", visualizations)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-6 w-6 text-gray-600" />
          3. Generate Visualizations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6">
          {vizOptions.map((opt) => (
            <Button key={opt} variant="outline" onClick={() => onVisualize(opt)} disabled={isLoading === opt}>
              {isLoading === opt ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </Button>
          ))}
          <Button onClick={() => onVisualize("all")} disabled={isLoading === "all"}>
            {isLoading === "all" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            All Graphs
          </Button>
        </div>

        {Object.entries(visualizations).map(([key, value]) => (
          <div key={key} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 capitalize">{key} Plot</h3>
            {typeof value === "string" && value.startsWith("data:image") ? (
              <img
                src={value}
                alt={`${key} visualization`}
                className="w-full h-auto rounded-md object-contain border"
              />
            ) : (
              <div className="text-gray-500 text-sm italic border border-gray-200 p-4 rounded bg-gray-50">
                {value}
              </div>
            )}
          </div>
        ))}

      </CardContent>
    </Card>
  )
}
