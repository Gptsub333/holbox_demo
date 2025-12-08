import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)


  useEffect(() => {
    setMounted(true)
    try {
      // Check saved preference
      const saved = typeof window !== "undefined" && localStorage.getItem("theme")
      if (saved) {
        setTheme(saved)
        document.documentElement.classList.toggle("dark", saved === "dark")
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark")
        document.documentElement.classList.add("dark")
      } else {
        setTheme("light")
        document.documentElement.classList.remove("dark")
      }
    } catch (e) {
      // ignore
    }
  }, [])


  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    try {
      localStorage.setItem("theme", next)
    } catch (e) { }
    document.documentElement.classList.toggle("dark", next === "dark")
  }


  if (!mounted) return null


  return (
    <Button
      variant="ghost"
      size="sm"
      aria-pressed={theme === "dark"}
      aria-label="Toggle color mode"
      onClick={toggle}
      className="h-9 w-9 p-0 justify-center text-gray-700 hover:bg-gray-100 h-10"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </Button>
  )
}