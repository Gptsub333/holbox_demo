"use client"

import { motion } from "framer-motion"
import { Clipboard } from "lucide-react"

export default function Header() {
  return (
    <div className="text-center mb-12 relative z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-teal-100/50 to-blue-100/50 rounded-3xl -z-10 blur-xl opacity-70"></div>
      <motion.div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 mb-4 shadow-lg"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Clipboard className="w-8 h-8 text-white" />
      </motion.div>
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Differential Diagnosis Assistant
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Enter patient symptoms to receive AI-powered differential diagnosis suggestions
      </motion.p>
    </div>
  )
}
