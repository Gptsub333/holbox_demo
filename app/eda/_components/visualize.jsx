"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, BarChart } from "lucide-react"


export default function Visualize({ onVisualize, isLoading, visualizations }) {
  const [column, setColumn] = useState("")

  const vizOptions = [
    { key: "dist", label: "Distribution", needsColumn: true },
    { key: "time", label: "Time Series", needsColumn: true },
    { key: "corr", label: "Correlation", needsColumn: false },
    { key: "cat",  label: "Categorical", needsColumn: true },
  ] 

  const toDataUrl = (s) =>
    s.startsWith("data:image") ? s : `data:image/png;base64,${s}`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-6 w-6 text-gray-600" />
          3. Generate Visualizations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Column input (only needed for dist/time/cat) */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={column}
            onChange={(e) => setColumn(e.target.value)}
            placeholder="Column name (needed for Distribution, Time Series, Categorical)"
            className="sm:max-w-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {vizOptions.map((opt) => {
            const disabled = isLoading === opt.key || (opt.needsColumn && !column)
            return (
              <Button
                key={opt.key}
                variant="outline"
                disabled={disabled}
                onClick={() => onVisualize(opt.key, opt.needsColumn ? column : undefined)}
              >
                {isLoading === opt.key && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {opt.label}
              </Button>
            )
          })}
        </div>

        {/* Render returned images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(visualizations).map(([type, value]) => {
            const images = Array.isArray(value) ? value : [value]
            return (
              <div key={type} className="space-y-3">
                <h3 className="text-lg font-semibold capitalize">{type} Plot</h3>
                <div className="grid grid-cols-1 gap-3">
                  {images.map((src, i) =>
                    typeof src === "string" && (src.startsWith("data:image") || /^[A-Za-z0-9+/=]+$/.test(src)) ? (
                      <img
                        key={`${type}-${i}`}
                        src={toDataUrl(src)}
                        alt={`${type} visualization ${i + 1}`}
                        className="w-full h-auto rounded-md border object-contain bg-white"
                      />
                    ) : (
                      <div
                        key={`${type}-msg-${i}`}
                        className="text-gray-600 text-sm italic border border-gray-200 p-4 rounded bg-gray-50"
                      >
                        {String(src)}
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
