"use client"

import { FileText } from "lucide-react"
import { motion } from "framer-motion"

// Interface QuerySummaryProps removed
// Type annotation for summary prop removed

export default function QuerySummary({ summary }) {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
        <FileText className="w-5 h-5 mr-2.5 text-green-600" />
        Query Summary
      </h2>
      {summary ? (
        <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
      ) : (
        <p className="text-gray-500 text-sm">No summary available yet. Submit a query to see results.</p>
      )}
    </motion.div>
  )
}
