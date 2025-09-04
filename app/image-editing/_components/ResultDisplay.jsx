"use client"

import { motion } from "framer-motion"
import { Download, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ResultDisplay({ originalImage, editedImage, isEditing, error }) {
  const handleDownload = (imageUrl, filename) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 subheading-font">Results</h2>
      
      {error && (
        <motion.div
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 text-sm para-font">{error}</p>
          </div>
        </motion.div>
      )}

      {isEditing && (
        <motion.div
          className="flex flex-col items-center justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
          <p className="mt-4 text-gray-600 para-font">Processing your image...</p>
          <p className="text-sm text-gray-500 para-font">This may take a few moments</p>
        </motion.div>
      )}

      {!isEditing && !error && (
        <div className="space-y-6">
          {originalImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-medium mb-3 subheading-font">Original Image</h3>
              <div className="relative group">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(originalImage, 'original-image.jpg')}
                    className="bg-white/90 hover:bg-white text-gray-800"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {editedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-medium mb-3 subheading-font">Edited Image</h3>
              <div className="relative group">
                <img
                  src={editedImage}
                  alt="Edited"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(editedImage, 'edited-image.jpg')}
                    className="bg-white/90 hover:bg-white text-gray-800"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {!originalImage && !editedImage && (
            <motion.div
              className="flex flex-col items-center justify-center py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2 subheading-font">No Image Yet</h3>
              <p className="text-gray-500 para-font">
                Upload an image and describe your edits to see the results here
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
