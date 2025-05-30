"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, FileText, CheckCircle } from "lucide-react"

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleFileUpload(file);
    }
  };


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };


  const handleFileUpload = (file) => {
    if (!(file instanceof File)) {
      console.error('handleFileUpload expects a File object but got:', file)
      return
    }
    onUpload(file)
      onClose() 
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
          className="fixed top-1/3  -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-[90%] max-w-md max-h-[80vh] overflow-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4  ">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-800">Upload PDF</h3>
                <motion.button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <motion.div
                className={`border-2 border-dashed ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  } rounded-lg p-8 text-center transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isUploading ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Upload className="w-8 h-8 text-blue-600 mb-2" />
                    </motion.div>
                    <p className="text-xs text-gray-600">Uploading {uploadedFile?.name}...</p>
                  </motion.div>
                ) : uploadedFile ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                    <p className="text-xs text-gray-600">Upload complete!</p>
                  </motion.div>
                ) : (
                  <>
                    <motion.div animate={isDragging ? { y: -5 } : { y: 0 }} transition={{ duration: 0.2 }}>
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-xs text-gray-600 mb-1">Drag and drop your PDF here, or</p>
                    <label className="cursor-pointer">
                      <span className="text-xs text-blue-600 hover:text-blue-700 font-medium">browse files</span>
                      <input type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          if (e.target.files.length > 0) {
                            handleFileUpload(e.target.files[0])
                          }
                        }} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-400 mt-2">PDF files only, up to 10MB</p>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UploadModal
