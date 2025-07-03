"use client"

import { Button } from "../../../components/ui/card"
import { Bell, RefreshCw, Bot } from "lucide-react"
import styles from "./dashboard-header.module.css"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Bot className="h-7 w-7 text-primary" />
          <div>
            <h1 className={styles.headerTitle}>Agentic AI Dashboard</h1>
            <p className="text-xs text-muted-foreground">Real-time Platform Overview</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
