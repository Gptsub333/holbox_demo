"use client"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"

const HeaderSection = () => {
  return (
    <motion.div
      className="flex items-center space-x-3 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-blue-100 p-2 rounded-lg">
        <FileText className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-gray-800">PDF Extractor</h1>
        <p className="text-xs text-gray-500">Extract information from PDFs using AI</p>
      </div>
    </motion.div>
  )
}

export default HeaderSection
