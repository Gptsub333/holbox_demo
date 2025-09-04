"use client"

import { useState, useRef, useCallback } from "react"
import { UploadCloud, XCircle, Camera } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ImageUploadArea({ onImageUpload, onClearImage, imagePreview }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [showWebcam, setShowWebcam] = useState(false)
  const fileInputRef = useRef(null)
  const webcamRef = useRef(null)

  const handleInputChange = useCallback((event) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageUpload(file)
    }
    event.target.value = ""
  }, [onImageUpload])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file)
    }
  }, [onImageUpload])

  const handleFileClick = useCallback((e) => {
    e?.stopPropagation()
    fileInputRef.current?.click()
  }, [])

  const handleDesktopCapture = useCallback((e) => {
    e?.stopPropagation()
    setShowWebcam(true)
  }, [])

  const handleCapturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "captured.jpg", { type: "image/jpeg" })
        onImageUpload(file)
        setShowWebcam(false)
      })
  }, [onImageUpload])

  const isMobile = typeof window !== "undefined" && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  return (
    <>
      <div
        className={cn(
          "relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300 bg-white min-h-[200px] flex flex-col justify-center items-center",
          isDragOver && "border-blue-600 bg-blue-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!imagePreview) fileInputRef.current?.click()
        }}
        tabIndex={0}
        role="button"
        aria-label="Upload Image"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          tabIndex={-1}
        />

        {imagePreview ? (
          <motion.div
            className="w-full h-full flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <img
              src={imagePreview}
              alt="Uploaded preview"
              className="max-h-48 w-auto object-contain rounded-md shadow-sm"
            />
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={(e) => {
                e.stopPropagation()
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
            className="flex flex-col items-center justify-center space-y-3"
          >
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <p className="mt-3 text-sm text-gray-600 para-font">
              <span
                onClick={handleFileClick}
                className="font-semibold text-blue-600 cursor-pointer"
              >
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500 para-font">PNG, JPG, GIF up to 10MB</p>
            <div className="flex space-x-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={handleDesktopCapture}
              >
                <Camera className="w-4 h-4 mr-1" />
                Take Photo
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Webcam Modal */}
      {showWebcam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3"
              onClick={() => setShowWebcam(false)}
              tabIndex={0}
            >
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
            <div className="w-80 h-60 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500">Webcam Preview</p>
            </div>
            <Button
              onClick={handleCapturePhoto}
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture Photo
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
