"use client"

import { motion } from "framer-motion"
import { Shield, Loader2 } from "lucide-react"

export default function RedactButton({ onClick, isLoading, disabled }) {
  return (
    <motion.div
      className="flex justify-center mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <motion.button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`
          px-6 py-2 rounded-lg font-medium text-xs transition-all duration-300
          ${
            disabled || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow hover:shadow-md"
          }
        `}
        whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <div className="flex items-center space-x-1.5">
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
          <span>{isLoading ? "Redacting..." : "Redact PII"}</span>
        </div>
      </motion.button>
    </motion.div>
  )
}
