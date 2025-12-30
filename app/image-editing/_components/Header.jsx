"use client"

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
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
        <Wand2 className="h-10 w-10 text-white" />
      </div>
    </div>

    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-tight">
    Image Editor
    </h1>

    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
      Upload your images and edit them using natural language prompts. Transform your photos with the power of AI.
    </p>

    <div className="flex items-center gap-2 mt-6">
      <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
        <span className="mr-1 h-2 w-2 rounded-full bg-purple-500"></span>
        AI-Powered Editing
      </span>
      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
        <span className="mr-1 h-2 w-2 rounded-full bg-blue-500"></span>
        Natural Language
      </span>
    </div>
  </motion.div>
  )
}
