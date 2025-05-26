"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SymptomForm({ symptoms, setSymptoms, isLoading, onSubmit }) {
  const textareaRef = useRef(null)

  return (
    <motion.form
      onSubmit={onSubmit}
      className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="mb-6">
        <label htmlFor="symptoms" className="block text-lg font-medium text-gray-700 mb-2">
          Enter Clinical Scenario
        </label>
        <textarea
          ref={textareaRef}
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe the patient's symptoms, history, and relevant clinical findings in detail..."
          className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
          required
        />
      </div>
      <div className="flex justify-center">
        <motion.button
          type="submit"
          className={cn(
            "px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-lg shadow-md",
            "hover:from-teal-600 hover:to-blue-600 hover:shadow-lg transition-all flex items-center justify-center min-w-[180px]",
            "border-2 border-transparent hover:border-white/20", // Added border for better visibility
          )}
          whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.97 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Get Diagnosis
              <ChevronRight className="w-5 h-5 ml-1" />
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  )
}
