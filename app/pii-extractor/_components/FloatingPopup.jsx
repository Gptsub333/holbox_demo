"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Copy,
  CheckCircle,
  Loader2,
  Shield,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  AlertTriangle,
} from "lucide-react"
import { useState } from "react"

export default function FloatingPopup({ isOpen, onClose, response, isLoading }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (response?.extracted) {
      const textToCopy = JSON.stringify(response.extracted, null, 2)
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const renderDataSection = (title, data, icon) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return null

    return (
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          {icon}
          <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        </div>
        <div className="space-y-1">
          {Array.isArray(data) ? (
            data.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-700">
                {item}
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-700">{data}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-4 w-4" style={{ color: "#2564eb" }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">PII Analysis Results</h3>
                  <p className="text-xs text-gray-600">Extracted Information Summary</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {response?.extracted && (
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                )}
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-120px)]">
              {isLoading ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 className="h-8 w-8 animate-spin mb-4" style={{ color: "#2564eb" }} />
                  <h4 className="text-base font-medium text-gray-900 mb-2">Analyzing Text</h4>
                  <p className="text-sm text-gray-600 text-center max-w-sm">
                    Scanning for personally identifiable information...
                  </p>
                </motion.div>
              ) : response?.extracted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Risk Level */}
                  {response.extracted.riskLevel && (
                    <div
                      className={`p-3 rounded-lg border ${
                        response.extracted.riskLevel === "HIGH"
                          ? "bg-red-50 border-red-200"
                          : response.extracted.riskLevel === "MEDIUM"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-green-50 border-green-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <AlertTriangle
                          className={`h-4 w-4 ${
                            response.extracted.riskLevel === "HIGH"
                              ? "text-red-600"
                              : response.extracted.riskLevel === "MEDIUM"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            response.extracted.riskLevel === "HIGH"
                              ? "text-red-800"
                              : response.extracted.riskLevel === "MEDIUM"
                                ? "text-yellow-800"
                                : "text-green-800"
                          }`}
                        >
                          Risk Level: {response.extracted.riskLevel}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Extracted Data Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderDataSection(
                      "Names",
                      response.extracted.names,
                      <User className="h-4 w-4" style={{ color: "#2564eb" }} />,
                    )}

                    {renderDataSection(
                      "Addresses",
                      response.extracted.addresses,
                      <MapPin className="h-4 w-4 text-green-600" />,
                    )}

                    {renderDataSection(
                      "Phone Numbers",
                      response.extracted.phoneNumbers,
                      <Phone className="h-4 w-4" style={{ color: "#2564eb" }} />,
                    )}
                    {renderDataSection(
                      "Social Security Numbers",
                      response.extracted.socialSecurityNumbers,
                      <CreditCard className="h-4 w-4 text-red-700" />
                    )}

                    {renderDataSection(
                      "Email Addresses",
                      response.extracted.emailAddresses,
                      <Mail className="h-4 w-4 text-orange-600" />,
                    )}

                    {renderDataSection(
                      "Dates of Birth",
                      response.extracted.datesOfBirth,
                      <Calendar className="h-4 w-4 text-red-600" />,
                    )}

                    {renderDataSection(
                      "Social Security Numbers",
                      response.extracted.socialSecurityNumbers,
                      <CreditCard className="h-4 w-4 text-red-700" />,
                    )}
                  </div>

                  {/* Summary */}
                  {response.extracted.summary && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Analysis Summary</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{response.extracted.summary}</p>
                    </div>
                  )}

                  {copied && (
                    <motion.div
                      className="mt-3 text-sm text-green-600 flex items-center space-x-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Copied to clipboard!</span>
                    </motion.div>
                  )}
                </motion.div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                This analysis is for demonstration purposes. Handle PII according to privacy regulations.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
