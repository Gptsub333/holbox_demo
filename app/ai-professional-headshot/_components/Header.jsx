"use client"

import { UserRound } from "lucide-react"
import { motion } from "framer-motion"

export function Header() {
  return (
    <motion.div
      className="mt-[25px] sm:mt-0 flex flex-col items-start text-left mb-12 pt-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon + Title Row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
          <UserRound className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
          AI Professional Headshot
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">
        Generate polished, professional-looking headshots instantly with AI. Perfect for resumes, LinkedIn, or business profiles.
      </p>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-6">
        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
          <span className="mr-1 h-2 w-2 rounded-full bg-purple-500"></span>
          Studio-Quality Results
        </span>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          <span className="mr-1 h-2 w-2 rounded-full bg-blue-500"></span>
          AI-Powered Generation
        </span>
      </div>
    </motion.div>
  )
}
