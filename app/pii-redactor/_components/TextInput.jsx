"use client"

import { motion } from "framer-motion"
import { Type, FileText } from "lucide-react"

export default function TextInput({ text, setText, selectedSample }) {
  return (
    <motion.div
      className="space-y-3 p-3 bg-gray-50 border border-gray-200 rounded-lg h-full flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center space-x-1.5 mb-2">
        <Type className="w-3.5 h-3.5 text-gray-500" />
        <h3 className="text-xs font-semibold text-gray-900">Input Text</h3>
      </div>

      <motion.div
        className="relative flex-grow"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter or paste your text here to redact PII information..."
          className="w-full h-full p-3 border border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none transition-all duration-300 text-xs leading-relaxed bg-white"
          style={{ minHeight: "14rem" }}
        />

        {!text && !selectedSample && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <FileText className="w-6 h-6 text-gray-300 mx-auto mb-1" />
              <p className="text-[10px] text-gray-400">Select a sample or type your text</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="text-[10px] text-gray-500 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span>Characters: {text.length}</span>
        <span className="text-green-600">✓ Secure processing</span>
      </motion.div>
    </motion.div>
  )
}
