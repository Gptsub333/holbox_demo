"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function QueryInput({ value, onChange, placeholder }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 rounded-lg border border-gray-300",
          "bg-white text-gray-900 placeholder-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "resize-none transition-all duration-200",
          "para-font text-sm"
        )}
        rows={4}
        maxLength={500}
      />
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500 para-font">
          Describe the changes you want to make to your image
        </p>
        <span className="text-xs text-gray-400 para-font">
          {value.length}/500
        </span>
      </div>
    </motion.div>
  )
}
