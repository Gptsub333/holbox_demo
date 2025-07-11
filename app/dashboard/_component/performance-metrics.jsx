import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Progress } from "../../../components/ui/progress"
import { Clock, CheckCircle, TrendingUp } from "lucide-react"

export function PerformanceMetrics() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span>Avg. Completion</span>
            </div>
            <span className="font-medium">2.4s</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Success Rate</span>
            </div>
            <span className="font-medium">94.2%</span>
          </div>
          <Progress value={94.2} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-blue-500" />
              <span>Tasks Today</span>
            </div>
            <span className="font-medium">1,247</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
