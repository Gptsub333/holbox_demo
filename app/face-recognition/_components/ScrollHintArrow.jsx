"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

export default function ScrollHintArrow({ showHint, onHintDismiss }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (showHint) {
      setIsVisible(true)
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        onHintDismiss()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showHint, onHintDismiss])

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        setIsVisible(false)
        onHintDismiss()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isVisible, onHintDismiss])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white border border-gray-200 rounded-full px-4 py-2 shadow-lg flex items-center space-x-2">
            <span className="text-xs text-gray-600 font-medium">Scroll down to view results</span>
            <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
              <ChevronDown className="h-4 w-4 text-[#2564eb]" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
