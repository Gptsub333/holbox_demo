import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

const leaderboardData = [
  { rank: 1, name: "Face-Recognition", tasks: 245, success: 98.2, icon: Trophy, color: "text-yellow-500" },
  { rank: 2, name: "ChatAgent-3", tasks: 198, success: 96.8, icon: Medal, color: "text-gray-400" },
  { rank: 3, name: "TaskBot-12", tasks: 187, success: 95.1, icon: Award, color: "text-amber-600" },
  { rank: 4, name: "WebCrawler-5", tasks: 156, success: 94.3, icon: null, color: "" },
  { rank: 5, name: "FileProcessor", tasks: 134, success: 93.7, icon: null, color: "" },
]

  const agents = [
    { name: 'Face-Recognition', tasks: 245, score: 98.2 },
    { name: 'ChatAgent-3', tasks: 198, score: 96.8 },
    { name: 'TaskBot-12', tasks: 187, score: 95.1 },
    { name: 'WebCrawler-5', tasks: 156, score: 94.3 },
    { name: 'FileProcessor', tasks: 134, score: 93.7 },
  ];

  export function AgentLeaderboard() {
    return (
      <>
        {/* <Card>
      <CardHeader>
        <CardTitle>Agent Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardData.map((agent) => (
            <div key={agent.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {agent.rank}
                </div>
                {agent.icon && <agent.icon className={`h-4 w-4 ${agent.color}`} />}
                <div>
                  <p className="font-medium text-sm">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.tasks} tasks</p>
                </div>
              </div>
              <Badge variant="secondary">{agent.success}%</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Agent Leaderboard</h2>
          <ul className="mt-4 space-y-3">
            {agents.map((a, i) => (
              <li
                key={a.name}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  {/* <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white"
                  aria-label={`Rank ${i + 1}`}
                >
                  {i + 1}
                </span> */}
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-gray-600">{a.tasks} tasks</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">{a.score.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
