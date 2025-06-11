"use client"

import { DatabaseZap } from "lucide-react"
import { motion } from "framer-motion"

export default function NL2SQLHeader() {
  return (
     <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex  items-center space-x-3 mb-3">
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <DatabaseZap className="w-6 h-6 text-blue-600" />
          </div>
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <DatabaseZap className="w-2 h-2 text-white" />
          </motion.div>
        </motion.div>

        <div>
          <motion.h1
            className="text-xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
           NL2SQL Converter
          </motion.h1>

          <motion.p
            className="text-xs text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
                Convert natural language queries into SQL with instant visualizations and summaries.
          </motion.p>
        </div>
      </div>
    </motion.div>
  )

   
}
