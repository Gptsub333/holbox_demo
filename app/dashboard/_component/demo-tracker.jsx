import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Play, CheckCircle, XCircle, Clock } from "lucide-react"

const demoData = [
  { name: "ML Pipeline Demo", status: "running", duration: "2m 34s", icon: Play, color: "bg-blue-500" },
  { name: "Data Analysis", status: "completed", duration: "1m 12s", icon: CheckCircle, color: "bg-green-500" },
  { name: "Web Scraping", status: "failed", duration: "0m 45s", icon: XCircle, color: "bg-red-500" },
  { name: "Chat Interface", status: "pending", duration: "0m 00s", icon: Clock, color: "bg-yellow-500" },
]

const getStatusVariant = (status) => {
  switch (status) {
    case "running":
      return "default"
    case "completed":
      return "secondary"
    case "failed":
      return "destructive"
    case "pending":
      return "outline"
    default:
      return "secondary"
  }
}

export function DemoTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {demoData.map((demo, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded-full ${demo.color}`}>
                  <demo.icon className="h-3 w-3 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{demo.name}</p>
                  <p className="text-xs text-muted-foreground">{demo.duration}</p>
                </div>
              </div>
              <Badge variant={getStatusVariant(demo.status)}>{demo.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
