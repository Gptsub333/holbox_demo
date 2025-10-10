"use client"
import { motion } from "framer-motion"
import { FileDigit } from "lucide-react"

const HeaderSection = () => {
  return (
    <motion.div
      className="mt-[40px] sm:mt-0 flex items-center space-x-3 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-blue-100 p-2 rounded-lg">
        <FileDigit className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-gray-800">PDF Summarizer</h1>
        <p className="text-xs text-gray-500">Automatically summarize long documents and content</p>
      </div>
    </motion.div>
  )
}

export default HeaderSection
