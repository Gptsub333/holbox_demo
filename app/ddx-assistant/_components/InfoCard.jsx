"use client"

import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export default function InfoCard() {
  return (
    <motion.div
      className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
      <div>
        <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
        <p className="text-sm text-blue-700 mt-1">
          This tool is designed to assist healthcare professionals and should not replace clinical judgment. Always
          consult with a qualified healthcare provider for proper diagnosis and treatment.
        </p>
      </div>
    </motion.div>
  )
}
