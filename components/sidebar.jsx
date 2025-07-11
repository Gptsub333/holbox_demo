"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Grid, CalendarClock, Home, MessageSquare, ChevronDown, X, LayoutDashboard, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserButton, useUser } from "@clerk/nextjs"


const chatbotTypes = [
  { name: "AI Assistant", id: "general" },
  { name: "Traffic Bot", id: "traffic" },
  { name: "Health Bot", id: "health" },
]

export function Sidebar({
  onOpenSearch,
  onOpenChat,
  isMobileOpen,
  isDesktopOpen = true,
  onMobileClose,
  onDesktopToggle,
}) {
  const pathname = usePathname()
  const [activeChatbot, setActiveChatbot] = useState(chatbotTypes[0])
  

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("mobile-sidebar")
      if (
        isMobileOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle sidebar"]')
      ) {
        onMobileClose()
      }
    }
    
    if (isMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileOpen, onMobileClose])

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex h-full bg-gray-200 text-gray-800 flex-col z-10",
          "transition-all duration-300 ease-in-out",
          isDesktopOpen ? "w-56" : "w-0 overflow-hidden",
        )}
      >
        <SidebarContent
          pathname={pathname}
          activeChatbot={activeChatbot}
          setActiveChatbot={setActiveChatbot}
          onOpenSearch={onOpenSearch}
          onOpenChat={onOpenChat}
          onMobileClose={onMobileClose}
        />
      </div>

      {/* Mobile sidebar - overlay style */}
      <div
        id="mobile-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 bg-gray-200 transform transition-transform duration-300 ease-in-out md:hidden",
          "flex flex-col h-full rounded-r-xl shadow-lg", // Added rounded corners and shadow
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex justify-end p-4">
          <Button variant="ghost" size="icon" onClick={onMobileClose} className="rounded-full hover:bg-gray-300">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <SidebarContent
          pathname={pathname}
          activeChatbot={activeChatbot}
          setActiveChatbot={setActiveChatbot}
          onOpenSearch={onOpenSearch}
          onOpenChat={onOpenChat}
          isMobile={true}
          onMobileClose={onMobileClose}
        />
      </div>
    </>
  )
}

// Extracted sidebar content to avoid duplication
function SidebarContent({
  pathname,
  activeChatbot,
  setActiveChatbot,
  onOpenSearch,
  onOpenChat,
  isMobile = false,
  onMobileClose,
}) {
  const { user } = useUser();

  const orgName = "Holbox"; // fallback for dev/local/test
  

  return (
    <div className="flex flex-col h-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm">
      <div className="p-2.5 mb-3 rounded-xl bg-gray-100 shadow-inner">
        <Link href="/" className="flex items-center justify-center md:justify-start">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="ml-2.5 text-xs font-medium md:inline-block heading-font">{orgName} AI Demo</span>
        </Link>
      </div>

      <div className="flex-1 py-3 overflow-y-auto">
        <nav className="space-y-1.5">
          <Link
            href="/"
            className={cn(
              "flex items-center justify-center md:justify-start w-full p-2.5 rounded-xl",
              "text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all",
              pathname === "/" ? "bg-gray-100 shadow-sm text-blue-600 font-medium" : "",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
              isMobile ? "justify-start" : "",
            )}
            onClick={isMobile ? onMobileClose : undefined}
          >
            <Home className="w-3.5 h-3.5" />
            <span className={cn("ml-2.5 text-xs", isMobile ? "inline-block" : "hidden md:inline-block")}>
              Home
            </span>
          </Link>

          <button
            onClick={onOpenSearch}
            className={cn(
              "flex items-center justify-center md:justify-start w-full p-2.5 rounded-xl",
              "text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
              isMobile ? "justify-start" : "",
            )}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className={cn("ml-2.5 text-xs", isMobile ? "inline-block" : "hidden md:inline-block")}>
              Applications
            </span>
          </button>

          <Link
            href="/upcoming"
            className={cn(
              "flex items-center justify-center md:justify-start w-full p-2.5 rounded-xl",
              "text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all",
              pathname === "/upcoming" ? "bg-gray-100 shadow-sm text-blue-600 font-medium" : "",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
              isMobile ? "justify-start" : "",
            )}
            onClick={isMobile ? onMobileClose : undefined}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span className={cn("ml-2.5 text-xs", isMobile ? "inline-block" : "hidden md:inline-block")}>
              Up Coming
            </span>
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center justify-center md:justify-start w-full p-2.5 rounded-xl",
              "text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all",
              pathname === "/dashboard" ? "bg-gray-100 shadow-sm text-blue-600 font-medium" : "",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
              isMobile ? "justify-start" : "",
            )}
            onClick={isMobile ? onMobileClose : undefined}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className={cn("ml-2.5 text-xs", isMobile ? "inline-block" : "hidden md:inline-block")}>
              Dashboard
            </span>
          </Link>
          <Link
            href="/connect-to"
            className={cn(
              "flex items-center justify-center md:justify-start w-full p-2.5 rounded-xl",
              "text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all",
              pathname === "/connect-to" ? "bg-gray-100 shadow-sm text-blue-600 font-medium" : "",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
              isMobile ? "justify-start" : "",
            )}
            onClick={isMobile ? onMobileClose : undefined}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className={cn("ml-2.5 text-xs", isMobile ? "inline-block" : "hidden md:inline-block")}>
              ConnectTo
            </span>
          </Link>
        </nav>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <UserButton />
        <span className="text-sm font-medium text-gray-700">{user?.fullName || "User"}</span>
      </div>

      <div className="p-2.5 mt-auto">
        <div className="rounded-xl bg-white shadow-sm p-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={cn(
                  "w-full bg-blue-600 text-white hover:bg-blue-700 border-0 rounded-lg py-1.5 px-2.5 h-auto text-xs",
                  isMobile || !isMobile ? "justify-start" : "justify-center md:justify-start",
                )}
              >
                <MessageSquare className="w-3.5 h-3.5 md:mr-2" />
                <span className={cn(isMobile ? "inline-block" : "hidden md:inline-block")}>{activeChatbot.name}</span>
                <ChevronDown
                  className={cn("ml-auto h-2.5 w-2.5", isMobile ? "inline-block" : "hidden md:inline-block")}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-gray-100 shadow-lg  z-20 ">
              {chatbotTypes.map((bot) => (
                <DropdownMenuItem
                  key={bot.id}
                  onClick={() => {
                    setActiveChatbot(bot)
                    onOpenChat(bot)
                  }}
                  className="text-xs py-1.5 bg-gray-100 hover:bg-white-200 rounded-lg transition-white-all"
                >
                  {bot.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </div>
  )
}
