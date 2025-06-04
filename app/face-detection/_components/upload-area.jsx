"use client"

import { UploadCloud, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function UploadArea({ onFileChange, onDrop, onDragOver, onDragLeave, imagePreview, isDragOver, onClearImage }) {
const handleInputChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    onFileChange(file); // This calls processFile in page.jsx
  }
  // Reset the input value to allow re-uploading the same file
  // and ensure onChange fires for subsequent identical selections or any new selection.
  if (event.target) {
    event.target.value = null; // Corrected line (removed the 'ßß')
  }
}


  return (
    <div
      className={cn(
        "relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300 bg-white min-h-[200px] flex flex-col justify-center items-center",
        isDragOver && "border-blue-600 bg-blue-50",
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !imagePreview && document.getElementById("fileUploadInput")?.click()}
    >
      <input type="file" id="fileUploadInput" accept="image/*" onChange={handleInputChange} className="hidden" />
      {imagePreview ? (
        <motion.div
          className="w-full h-full flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <img
            src={imagePreview || "/placeholder.svg"}
            alt="Uploaded preview"
            className="max-h-48 w-auto object-contain rounded-md shadow-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 text-red-500 hover:text-red-700 hover:bg-red-100"
            onClick={(e) => {
              e.stopPropagation() // Prevent triggering file input click
              onClearImage()
            }}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Clear Image
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center"
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <p className="mt-3 text-sm text-gray-600 para-font">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 para-font mt-1">PNG, JPG, GIF up to 10MB</p>
        </motion.div>
      )}
    </div>
  )
}
