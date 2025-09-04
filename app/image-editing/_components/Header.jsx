"use client"

import { GradientHeading } from "@/components/ui/gradient-heading"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { ImageIcon } from "lucide-react"
import { motion } from "framer-motion"

export function Header() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center mb-12 pt-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">
        <GradientIcon icon={ImageIcon} size={90} className="text-blue-600" />
      </div>

      <GradientHeading as="h1" size="2xl" className="mb-4 tracking-tight">
        AI Image Editor
      </GradientHeading>

      <p className="text-gray-600 max-w-2xl mx-auto text-lg para-font leading-relaxed">
        Transform your images with AI-powered editing. Simply describe what you want to change and watch as our AI brings your vision to life.
      </p>

      <div className="flex items-center gap-2 mt-6">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          <span className="mr-1 h-2 w-2 rounded-full bg-blue-500"></span>
          AI-Powered
        </span>
        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
          <span className="mr-1 h-2 w-2 rounded-full bg-purple-500"></span>
          Text-Guided
        </span>
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
          <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
          High Quality
        </span>
      </div>
    </motion.div>
  )
}
