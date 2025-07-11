import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Trophy, Zap, AlertTriangle } from "lucide-react"

export function AgentInsights() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Top Agent</span>
          </div>
          <Badge variant="outline">Face-Recognition</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Most Popular</span>
          </div>
          <Badge variant="outline">ChatAgent</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm">Recent Errors</span>
          </div>
          <Badge variant="destructive">3</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
