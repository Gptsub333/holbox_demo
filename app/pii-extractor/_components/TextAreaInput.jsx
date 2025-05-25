"use client"

import { motion } from "framer-motion"
import { FileText, Type } from "lucide-react"

export default function TextAreaInput({ text, onTextChange }) {
  const characterCount = text.length
  const maxLength = 2000

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-800">Text to Analyze</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Type className="h-3 w-3" />
          <span>
            {characterCount}/{maxLength}
          </span>
        </div>
      </div>

      <motion.div
        className="relative flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Select a sample text above or enter your own text to analyze for PII..."
          className="w-full h-full min-h-[300px] p-3 border border-gray-200 rounded-lg resize-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-xs leading-relaxed bg-gray-50 focus:bg-white"
          maxLength={maxLength}
        />

        {!text && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <FileText className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No text selected</p>
            </div>
          </div>
        )}
      </motion.div>

      {text && (
        <motion.div
          className="flex items-center justify-between text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-gray-600">
              Words:{" "}
              {
                text
                  .trim()
                  .split(/\s+/)
                  .filter((word) => word.length > 0).length
              }
            </span>
            <span className="text-gray-600">Lines: {text.split("\n").length}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
