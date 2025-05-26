"use client"

import { CheckCircle, Copy, X, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function ResultsPopup({ results, onClose, originalText, redactedText }) {
  const [copiedOriginal, setCopiedOriginal] = useState(false)
  const [copiedRedacted, setCopiedRedacted] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "original") {
        setCopiedOriginal(true)
        setTimeout(() => setCopiedOriginal(false), 2000)
      } else {
        setCopiedRedacted(true)
        setTimeout(() => setCopiedRedacted(false), 2000)
      }
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(redactedText)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleDownloadClick = () => {
    const element = document.createElement("a")
    const file = new Blob([redactedText], {
      type: "text/plain",
    })
    element.href = URL.createObjectURL(file)
    element.download = "redacted.txt"
    document.body.appendChild(element)
    element.click()
  }

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-8 md:inset-16 lg:inset-24 xl:inset-32 bg-white rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-800">Redaction Results</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="grid md:grid-cols-2 h-full">
            {/* Original Text */}
            <div className="p-3 border-r border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <AlertTriangle className="w-3 h-3 text-orange-500" />
                  <h3 className="text-xs font-semibold text-gray-900">Original Text</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(originalText, "original")}
                  className="flex items-center space-x-1 px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {copiedOriginal ? (
                    <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                  ) : (
                    <Copy className="w-2.5 h-2.5" />
                  )}
                  <span className="text-xs">{copiedOriginal ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-md p-2 h-64 overflow-y-auto">
                <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">{originalText}</p>
              </div>
            </div>

            {/* Redacted Text */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <h3 className="text-xs font-semibold text-gray-900">Redacted Text</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(redactedText, "redacted")}
                  className="flex items-center space-x-1 px-1.5 py-0.5 text-xs bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                >
                  {copiedRedacted ? (
                    <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                  ) : (
                    <Copy className="w-2.5 h-2.5" />
                  )}
                  <span className="text-xs">{copiedRedacted ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-2 h-64 overflow-y-auto">
                <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">{redactedText}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-green-500 space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Processing complete</span>
            </div>
            <div className="flex items-center text-blue-500 space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Data secured</span>
            </div>
          </div>
          <span className="text-xs">{new Date().toLocaleTimeString()}</span>
        </div>
      </motion.div>
    </>
  )
}
