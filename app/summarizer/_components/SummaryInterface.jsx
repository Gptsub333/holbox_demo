"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";

const SummaryInterface = ({ isOpen, onClose, summary }) => {
  const handleDownloadSummary = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "summary.txt";
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal Container */}
            <motion.div
              className="z-50 w-[90%] max-w-md max-h-[80vh] overflow-hidden rounded-lg bg-white shadow-xl"
              style={{ transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
            >
              <div className="flex flex-col h-full max-h-[80vh]">
                {/* Header */}
                <motion.div
                  className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-800">PDF Summary</h3>
                  </div>

                  <motion.button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close Summary"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>

                {/* Summary Text */}
                <div className="flex-grow overflow-y-auto p-3 bg-white">
                  <p className="text-sm text-gray-700">{summary}</p>
                </div>

                {/* Footer: Download Summary */}
                <motion.div
                  className="border-t border-gray-200 p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={handleDownloadSummary}
                    className="bg-blue-600 flex hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md"
                    aria-label="Download Summary"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Download Summary
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SummaryInterface;
