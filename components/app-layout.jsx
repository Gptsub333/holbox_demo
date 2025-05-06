"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ModernChatbot } from "@/components/modern-chatbot"
import { FloatingSearch } from "@/components/floating-search"
import { Menu, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AppLayout({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isModernChatOpen, setIsModernChatOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
  const [activeChatbot, setActiveChatbot] = useState({ name: "AI Assistant", id: "general" })
  const [mounted, setMounted] = useState(false)

  // Set mounted state after component mounts to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Return null on server-side to prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gray-200 p-0 sm:p-2 md:p-4">
      <div className="flex h-[calc(100vh-2rem)] overflow-hidden rounded-xl bg-white shadow-sm">
        {/* Mobile sidebar toggle */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Button
            variant="outline"
            size="icon"
            className="bg-white shadow-md border-blue-200 rounded-full"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* Sidebar Container - with rounded corners */}
        <div
          className={cn(
            "hidden md:block relative rounded-l-xl overflow-hidden",
            "transition-all duration-300 ease-in-out",
            "bg-gray-200 shadow-inner",
            isDesktopSidebarOpen ? "w-56" : "w-0",
          )}
        >
          {/* Sidebar Component */}
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            isDesktopOpen={isDesktopSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
            onDesktopToggle={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            onOpenSearch={() => {
              setIsSearchOpen(true)
              setIsMobileSidebarOpen(false)
            }}
            onOpenChat={(chatbot) => {
              setActiveChatbot(chatbot)
              setIsModernChatOpen(true)
              setIsMobileSidebarOpen(false)
            }}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Desktop sidebar toggle - fixed position */}
        <div className="hidden md:block fixed bottom-4 left-4 z-30">
          <Button
            variant="outline"
            size="icon"
            className="bg-white shadow-md border-blue-200 rounded-full"
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          >
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Toggle desktop sidebar</span>
          </Button>
        </div>

        {/* Main content area with rounded corners */}
        <div className="flex-1 flex flex-col bg-gray-200 rounded-r-xl overflow-hidden">
          {/* Content area with padding and scrolling */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 md:p-6">{children}</div>
          </div>
        </div>
      </div>

      {/* Floating components */}
      <FloatingSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ModernChatbot isOpen={isModernChatOpen} onClose={() => setIsModernChatOpen(false)} title={activeChatbot.name} />
    </div>
  )
}
