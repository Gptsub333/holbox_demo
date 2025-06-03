"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Code2, Copy, Check } from "lucide-react"

export default function GeneratedQueryDisplay({ sqlQuery }) {
  const [copied, setCopied] = useState(false)

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlQuery)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (!sqlQuery) return null

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center">
          <Code2 className="w-4 h-4 mr-2 text-blue-600" />
          Generated SQL Query
        </h3>
        <motion.button
          onClick={handleCopyToClipboard}
          className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
            copied
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </motion.button>
      </div>
      <div className="p-4">
        <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
          {sqlQuery}
        </pre>
      </div>
    </motion.div>
  )
}