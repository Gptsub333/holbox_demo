"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BarChart } from "lucide-react"

export default function Visualize({ onVisualize, isLoading, visualizations }) {
  const vizOptions = ["dist", "corr", "cat", "time"]

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

        {Object.keys(visualizations).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(visualizations).map(([key, value]) => (
              <div key={key} className="p-4 border rounded-lg bg-white">
                <h3 className="text-lg font-semibold mb-2 capitalize">{key} Plot</h3>
                <img
                   src={getImgSrc(value)}
                  alt={`${key} visualization`}
                  className="w-full h-auto rounded-md object-contain border"
                />

              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
