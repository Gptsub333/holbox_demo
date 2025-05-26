"use client"

import { motion } from "framer-motion"
import { Sparkles, Loader2 } from "lucide-react"

export default function ExtractButton({ onClick, disabled, isLoading }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
        disabled || isLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-white shadow-sm hover:shadow-md"
      }`}
      style={
        !disabled && !isLoading
          ? {
              background: "linear-gradient(to right, #2564eb, #1d4ed8)",
            }
          : {}
      }
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      <span>{isLoading ? "Analyzing..." : "Extract PII"}</span>
    </motion.button>
  )
}
