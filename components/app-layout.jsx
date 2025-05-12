"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { StandaloneMobileMenu } from "@/components/standalone-mobile-menu"
import { ModernChatbot } from "@/components/modern-chatbot"
import { FloatingSearch } from "@/components/floating-search"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AppLayout({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isModernChatOpen, setIsModernChatOpen] = useState(false)
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
  const [activeChatbot, setActiveChatbot] = useState({ name: "AI Assistant", id: "general" })
  const [mounted, setMounted] = useState(false)

  // Set mounted state after component mounts to prevent hydration issues
  useEffect(() => {
    setMounted(true)

    // Listen for mobile menu events
    const handleOpenMobileSearch = () => {
      console.log("Opening mobile search")
      setIsSearchOpen(true)
    }

    const handleOpenMobileChat = () => {
      console.log("Opening mobile chat")
      setActiveChatbot({ name: "AI Assistant", id: "general" })
      setIsModernChatOpen(true)
    }

    document.addEventListener("openMobileSearch", handleOpenMobileSearch)
    document.addEventListener("openMobileChat", handleOpenMobileChat)

    return () => {
      document.removeEventListener("openMobileSearch", handleOpenMobileSearch)
      document.removeEventListener("openMobileChat", handleOpenMobileChat)
    }
  }, [])

  if (!mounted) {
    return null // Return null on server-side to prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gray-200 p-0 sm:p-2 md:p-4">
      <div className="flex h-[calc(100vh-2rem)] overflow-hidden rounded-xl bg-white shadow-sm">
        {/* Desktop sidebar */}
        <div
          className={cn(
            "hidden md:block relative rounded-l-xl overflow-hidden",
            "transition-all duration-300 ease-in-out",
            "bg-gray-200 shadow-inner",
            isDesktopSidebarOpen ? "w-56" : "w-0",
          )}
        >
          <Sidebar
            isDesktopOpen={isDesktopSidebarOpen}
            onDesktopToggle={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenChat={(chatbot) => {
              setActiveChatbot(chatbot)
              setIsModernChatOpen(true)
            }}
          />
        </div>

        {/* Desktop sidebar toggle */}
        <div className="hidden md:block fixed bottom-4 left-4 z-30">
          <Button
            variant="outline"
            size="icon"
            className="bg-white shadow-md border-gray-200 rounded-full"
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          >
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col bg-gray-200 rounded-r-xl overflow-hidden">
          <div className="flex-1 h-full px-3 py-0">
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 md:p-6 h-full overflow-auto mt-0">
              {/* Add padding on mobile to account for the fixed sidebar toggle */}
              <div className="md:hidden h-8 mb-4"></div>
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Mobile Menu */}
      <StandaloneMobileMenu />

      {/* Floating components */}
      <FloatingSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ModernChatbot isOpen={isModernChatOpen} onClose={() => setIsModernChatOpen(false)} title={activeChatbot.name} />

      {/* Debug info */}
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "12px",
          zIndex: 9999,
        }}
      >
        Width: {typeof window !== "undefined" ? window.innerWidth : "N/A"}px
      </div>
    </div>
  )
}
