"use client"

import { GradientHeading } from "@/components/ui/gradient-heading"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { Wand2 } from "lucide-react"
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
        <GradientIcon icon={Wand2} size={90} className="text-purple-600" />
      </div>

      <GradientHeading as="h1" size="2xl" className="mb-4 tracking-tight">
        Text to Image Generator
      </GradientHeading>

      <p className="text-gray-600 max-w-2xl mx-auto text-lg para-font leading-relaxed">
        Transform your text descriptions into stunning images using AI. Select from our sample prompts or create your
        own unique descriptions to bring your ideas to life.
      </p>

      <div className="flex items-center gap-2 mt-6">
        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
          <span className="mr-1 h-2 w-2 rounded-full bg-purple-500"></span>
          AI-Powered
        </span>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          <span className="mr-1 h-2 w-2 rounded-full bg-blue-500"></span>
          High Resolution
        </span>
      </div>
    </motion.div>
  )
}
