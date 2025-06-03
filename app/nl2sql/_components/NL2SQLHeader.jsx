"use client"

import { DatabaseZap } from "lucide-react"
import { motion } from "framer-motion"

export default function NL2SQLHeader() {
  return (
    <motion.div
      className="p-4 bg-slate-50 border-b border-gray-200"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <DatabaseZap className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800">NL2SQL Converter</h1>
      </div>
      <p className="text-xs text-gray-600">
        Convert natural language queries into SQL with instant visualizations and summaries.
      </p>
    </motion.div>
  )
}
