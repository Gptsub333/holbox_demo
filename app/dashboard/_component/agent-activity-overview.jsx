import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Bot, Activity, Pause, AlertCircle } from "lucide-react"

export function AgentActivityOverview() {
  const stats = [
  { label: "Total Agents", value: 24, icon: Bot, color: "#3B82F6" }, // bg-blue-500
  { label: "Active", value: 18, icon: Activity, color: "#10B981" },  // bg-green-500
  { label: "Idle", value: 4, icon: Pause, color: "#F59E0B" },        // bg-yellow-500
  { label: "Failed", value: 2, icon: AlertCircle, color: "#EF4444" }, // bg-red-500
]

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Agent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-full ${stat.color}`}>
                <stat.icon className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <Badge variant="secondary">{stat.value}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
