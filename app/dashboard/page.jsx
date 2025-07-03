import { AgentActivityOverview } from "./_component/agent-activity-overview"
import { PerformanceMetrics } from "./_component/performance-metrics"
import { UserInteractionStats } from "./_component/user-interaction-stats"
import { AgentInsights } from "./_component/agent-insights"
import { DemoTracker } from "./_component/demo-tracker"
import { ActivityChart } from "./_component/activity-chart"
import { TaskCompletionChart } from "./_component/task-completion-chart"
import { TaskDistributionChart } from "./_component/task-distribution-chart"
import { AgentLeaderboard } from "./_component/agent-leaderboard"
import { ErrorLogs } from "./_component/error-logs"
import styles from "./_component/page.module.css"

export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      {/* Header Section */}
      <header className="pl-8 py-6 ">
        <h1 className="text-3xl font-semibold text-blue-600">Dashboard</h1>
      </header>

      <main className="flex-1 p-4 md:p-8 space-y-8">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AgentActivityOverview className={styles.cardHover} />
          <PerformanceMetrics className={styles.cardHover} />
          <UserInteractionStats className={styles.cardHover} />
          <AgentInsights className={styles.cardHover} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityChart className={styles.cardHover} />
          <TaskCompletionChart className={styles.cardHover} />
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TaskDistributionChart className={styles.cardHover} />
          <AgentLeaderboard className={styles.cardHover} />
          <DemoTracker className={styles.cardHover} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-6">
          <ErrorLogs className={styles.cardHover} />
        </div>
      </main>
    </div>
  )
}
