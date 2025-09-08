"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import { StandaloneMobileMenu } from "@/components/standalone-mobile-menu"
import { FloatingSearch } from "@/components/floating-search"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"



export function AppLayout({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isModernChatOpen, setIsModernChatOpen] = useState(false)
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
  const [activeChatbot, setActiveChatbot] = useState({ name: "AI Assistant", id: "general" })
  const [mounted, setMounted] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const router = useRouter()

  const handleViewChange = (view) => {
    const map = {
      dashboard: "/dashboard",
      works: "/works",
      general: "/general",
      money: "/money",
    }
    router.push(map[view] ?? "/")
    setIsMobileSidebarOpen(false)
  }

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
    <div className="min-h-screen bg-white">

      {/* New fixed, icon-only Sidebar */}
      <Sidebar
       onOpenSearch={() => setIsSearchOpen(true)}
        onViewChange={handleViewChange}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={setIsMobileSidebarOpen}

      />

      {/* Main wrapper shifts right on md+ to make space for fixed w-16 sidebar */}
      <div className="md:pl-16">
        <main className="min-h-screen bg-white">
          {children}
        </main>
      </div>

      {/* Standalone Mobile Menu */}
      <StandaloneMobileMenu />

      {/* Floating components */}
      <FloatingSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />


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
