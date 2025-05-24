"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, CheckCircle, FileText, ListChecks, MessageSquare, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DiagnosisPopup({ isOpen, onClose, diagnosis, parsedDiagnosis }) {
  const [activeSection, setActiveSection] = useState("summary")
  const [showTabLabel, setShowTabLabel] = useState(null)
  const popupRef = useRef(null)

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Reset tab label visibility when changing sections
  useEffect(() => {
    setShowTabLabel(null)
  }, [activeSection])

  if (!isOpen || !diagnosis || !parsedDiagnosis) return null

  // Tab configuration with icons and labels
  const tabs = [
    { id: "summary", label: "Patient Summary", icon: <FileText className="w-5 h-5" /> },
    { id: "differential", label: "Differential Diagnosis", icon: <ListChecks className="w-5 h-5" /> },
    { id: "discussion", label: "Discussion", icon: <MessageSquare className="w-5 h-5" /> },
    { id: "approach", label: "Diagnostic Approach", icon: <Stethoscope className="w-5 h-5" /> },
  ]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={popupRef}
          className="bg-white rounded-xl shadow-xl max-w-3xl w-[95%] max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Popup Header */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Differential Diagnosis</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs - Responsive Design */}
          <div className="bg-gray-50 border-b border-gray-200 px-3 sm:px-6 py-2 flex justify-between sm:justify-start overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {tabs.map((tab) => (
              <div key={tab.id} className="relative">
                <button
                  onClick={() => setActiveSection(tab.id)}
                  onMouseEnter={() => setShowTabLabel(tab.id)}
                  onMouseLeave={() => setShowTabLabel(null)}
                  className={cn(
                    "px-3 sm:px-4 py-2 text-sm font-medium rounded-md mr-1 sm:mr-2 whitespace-nowrap flex items-center justify-center transition-all",
                    activeSection === tab.id ? "bg-teal-100 text-teal-800" : "text-gray-600 hover:bg-gray-100",
                  )}
                  aria-label={tab.label}
                >
                  <span className="sm:hidden">{tab.icon}</span>
                  <span className="hidden sm:inline-flex items-center">
                    {tab.icon && <span className="mr-2">{tab.icon}</span>}
                    {tab.label}
                  </span>
                </button>

                {/* Mobile tooltip for non-active tabs */}
                {showTabLabel === tab.id && activeSection !== tab.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap sm:hidden"
                  >
                    {tab.label}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Popup Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 140px)" }}>
            {/* Patient Summary Section */}
            {activeSection === "summary" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Patient Presentation</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <ul className="space-y-2">
                    {parsedDiagnosis.summary.map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-3 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-blue-800">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Differential Diagnosis Section */}
            {activeSection === "differential" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Most Likely/Critical Diagnoses</h3>
                  <div className="space-y-3">
                    {parsedDiagnosis.differential.mostLikely.map((condition, index) => (
                      <motion.div
                        key={index}
                        className="p-4 rounded-lg bg-red-50 border border-red-200"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-red-200 flex items-center justify-center mr-3 flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          </div>
                          <span className="font-medium text-red-800">{condition}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Other Considerations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parsedDiagnosis.differential.other.map((condition, index) => (
                      <motion.div
                        key={index}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                      >
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-500"></div>
                          </div>
                          <span className="text-gray-700">{condition}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Discussion Section */}
            {activeSection === "discussion" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Discussion of Top Considerations</h3>
                <div className="bg-teal-50 rounded-lg p-5 border border-teal-100">
                  <ul className="space-y-3">
                    {parsedDiagnosis.discussion.map((point, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-teal-800">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Diagnostic Approach Section */}
            {activeSection === "approach" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="space-y-6">
                  {/* Immediate Actions */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Immediate Actions</h3>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <ul className="space-y-2">
                        {parsedDiagnosis.approach.immediate.map((action, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                          >
                            <div className="h-5 w-5 rounded-full bg-red-200 flex items-center justify-center mr-3 flex-shrink-0">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            </div>
                            <span className="text-red-800">{action}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Imaging */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Imaging</h3>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <ul className="space-y-2">
                        {parsedDiagnosis.approach.imaging.map((imaging, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                          >
                            <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-3 flex-shrink-0">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </div>
                            <span className="text-blue-800">{imaging}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Laboratory Tests */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Laboratory Tests</h3>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <ul className="space-y-2">
                        {parsedDiagnosis.approach.labs.map((lab, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                          >
                            <div className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center mr-3 flex-shrink-0">
                              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            </div>
                            <span className="text-purple-800">{lab}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Additional Considerations */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Additional Considerations</h3>
                    <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                      <ul className="space-y-2">
                        {parsedDiagnosis.approach.additional.map((item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                          >
                            <div className="h-5 w-5 rounded-full bg-teal-200 flex items-center justify-center mr-3 flex-shrink-0">
                              <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                            </div>
                            <span className="text-teal-800">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Disclaimer */}
            <motion.div
              className="mt-8 bg-gray-50 border-l-4 border-gray-400 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-gray-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">{parsedDiagnosis.disclaimer}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Popup Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
            <div className="text-xs text-gray-500">
              <span className="font-medium">Note:</span> This is an AI-generated differential diagnosis
            </div>
            <motion.button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
