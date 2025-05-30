"use client"
import { motion } from "framer-motion"
import { Upload } from "lucide-react"

const UploadButton = ({ onClick }) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg z-20"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Upload className="w-5 h-5" />
    </motion.button>
  )
}

export default UploadButton
