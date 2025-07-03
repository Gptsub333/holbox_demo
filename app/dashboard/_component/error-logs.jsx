import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { AlertCircle, Clock } from "lucide-react"

const errorLogs = [
  {
    id: 1,
    agent: "Face-Rekognition",
    error: "Connection timeout to external API",
    timestamp: "2 minutes ago",
    severity: "high",
  },
  {
    id: 2,
    agent: "WebCrawler-1",
    error: "Rate limit exceeded for target website",
    timestamp: "5 minutes ago",
    severity: "medium",
  },
  {
    id: 3,
    agent: "ChatAgent-7",
    error: "Invalid response format from LLM service",
    timestamp: "12 minutes ago",
    severity: "low",
  },
  {
    id: 4,
    agent: "FileProcessor-2",
    error: "Insufficient memory for large file processing",
    timestamp: "18 minutes ago",
    severity: "high",
  },
  {
    id: 5,
    agent: "TaskBot-5",
    error: "Authentication failed for third-party service",
    timestamp: "25 minutes ago",
    severity: "medium",
  },
]

const getSeverityVariant = (severity) => {
  switch (severity) {
    case "high":
      return "destructive"
    case "medium":
      return "default"
    case "low":
      return "secondary"
    default:
      return "secondary"
  }
}

export function ErrorLogs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Recent Error Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {errorLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between p-3 rounded-lg border bg-muted/20">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {log.agent}
                    </Badge>
                    <Badge variant={getSeverityVariant(log.severity)} className="text-xs">
                      {log.severity}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{log.error}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {log.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
