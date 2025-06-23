"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  CheckCircle,
  FileText,
  ListChecks,
  MessageSquare,
  Stethoscope,
} from "lucide-react";

import { cn } from "@/lib/utils";

export default function DiagnosisPopup({
  isOpen,
  onClose,
  diagnosis,
  parsedDiagnosis, // expects object from parseDiagnosisResponseV2
}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [showTabLabel, setShowTabLabel] = useState(null);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset tab label visibility when changing sections
  useEffect(() => {
    setShowTabLabel(null);
  }, [activeSection]);

  if (!isOpen || !diagnosis || !parsedDiagnosis) return null;

  const tabs = [
    { id: "overview", label: "Case Overview", icon: <FileText className="w-5 h-5" /> },
    { id: "possibilities", label: "Top Possibilities", icon: <ListChecks className="w-5 h-5" /> },
    { id: "reasoning", label: "Clinical Reasoning", icon: <MessageSquare className="w-5 h-5" /> },
    { id: "nextSteps", label: "Next Steps", icon: <Stethoscope className="w-5 h-5" /> },
  ];

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
          className="bg-white rounded-[12px] shadow-xl max-w-3xl w-[95%] flex flex-col overflow-hidden"
          style={{ maxHeight: "90vh" }}
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4 flex justify-between items-center flex-shrink-0 rounded-t-[12px]">
            <h2 className="text-xl font-semibold text-white">Differential Diagnosis</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 px-3 sm:px-6 py-2 flex justify-between sm:justify-start overflow-x-auto flex-shrink-0">
            {tabs.map((tab) => (
              <div key={tab.id} className="relative">
                <button
                  onClick={() => setActiveSection(tab.id)}
                  onMouseEnter={() => setShowTabLabel(tab.id)}
                  onMouseLeave={() => setShowTabLabel(null)}
                  className={cn(
                    "px-3 sm:px-4 py-2 text-sm font-medium rounded-md mr-1 sm:mr-2 whitespace-nowrap flex items-center justify-center transition-all",
                    activeSection === tab.id
                      ? "bg-teal-100 text-teal-800"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  aria-label={tab.label}
                >
                  <span className="sm:hidden">{tab.icon}</span>
                  <span className="hidden sm:inline-flex items-center">
                    {tab.icon && <span className="mr-2">{tab.icon}</span>}
                    {tab.label}
                  </span>
                </button>
                {/* Mobile tooltip */}
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

          {/* Tab content */}
          <div className="p-6 overflow-y-auto relative" style={{ maxHeight: "calc(90vh - 140px)" }}>
            {/* Case Overview */}
            {activeSection === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Case Overview</h3>
                <ul className="space-y-2">
                  {parsedDiagnosis?.overview?.length > 0
                    ? parsedDiagnosis.overview.map((item, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.3 }}
                        >
                          <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-3 flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          </div>
                          <span className="text-blue-800">{item}</span>
                        </motion.li>
                      ))
                    : <motion.li>No overview available</motion.li>
                  }
                </ul>
              </motion.div>
            )}

            {/* Top Possibilities */}
            {activeSection === "possibilities" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Top Diagnostic Possibilities</h3>
                <ul className="space-y-2">
                  {parsedDiagnosis?.possibilities?.length > 0
                    ? parsedDiagnosis.possibilities.map((item, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.3 }}
                        >
                          <div className="h-5 w-5 rounded-full bg-red-200 flex items-center justify-center mr-3 flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          </div>
                          <span className="text-red-800">{item}</span>
                        </motion.li>
                      ))
                    : <motion.li>No possibilities found</motion.li>
                  }
                </ul>
              </motion.div>
            )}

            {/* Clinical Reasoning */}
            {activeSection === "reasoning" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Key Clinical Reasoning</h3>
                <ul className="space-y-2">
                  {parsedDiagnosis?.reasoning?.length > 0
                    ? parsedDiagnosis.reasoning.map((item, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.3 }}
                        >
                          <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-teal-800">{item}</span>
                        </motion.li>
                      ))
                    : <motion.li>No clinical reasoning found</motion.li>
                  }
                </ul>
              </motion.div>
            )}

            {/* Next Steps */}
            {activeSection === "nextSteps" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Next Diagnostic Steps</h3>
                <ul className="space-y-2">
                  {parsedDiagnosis?.nextSteps?.length > 0
                    ? parsedDiagnosis.nextSteps.map((item, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.3 }}
                        >
                          <div className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center mr-3 flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                          </div>
                          <span className="text-purple-800">{item}</span>
                        </motion.li>
                      ))
                    : <motion.li>No next steps listed</motion.li>
                  }
                </ul>
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
                  <p className="text-sm text-gray-600">{parsedDiagnosis?.disclaimer}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50 flex-shrink-0 rounded-b-[12px]">
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
  );
}
