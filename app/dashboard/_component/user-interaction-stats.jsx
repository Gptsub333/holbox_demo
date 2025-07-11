import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Users, Star, TrendingUp } from "lucide-react"

export function UserInteractionStats() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">User Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Active Users</span>
          </div>
          <span className="text-lg font-semibold">342</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Avg. Rating</span>
          </div>
          <span className="text-lg font-semibold">4.8</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm">Growth</span>
          </div>
          <span className="text-lg font-semibold text-green-500">+12%</span>
        </div>
      </CardContent>
    </Card>
  )
}
