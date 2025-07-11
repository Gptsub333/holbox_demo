"use client"

import { useState, useCallback, useRef } from "react"
import { UploadCloud, X, CameraIcon } from "lucide-react"
import CameraView from "./camera-view"

export default function ImageSearch({ onSearch, loading }) {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleDragEvents = (isEntering) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(isEntering)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (file) {
      onSearch(file)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  const handleCapture = (capturedFile) => {
    setFile(capturedFile)
    setIsCameraOpen(false)
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (
    <>
      {isCameraOpen && <CameraView onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="flex flex-col space-y-4">
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragEvents(true)}
              onDragLeave={handleDragEvents(false)}
              className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                isDragging ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"
              }`}
            >
              <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
              <span className="font-semibold text-gray-700">Drag & drop an image</span>
              <span className="text-sm text-gray-500 my-2">or</span>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-blue-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse Files
                </button>
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors"
                >
                  <CameraIcon className="w-4 h-4 mr-2" />
                  Take Photo
                </button>
              </div>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          ) : (
            <div className="flex items-center bg-gray-100 p-2 rounded-lg w-full">
              <img
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-md"
                onLoad={() => URL.revokeObjectURL(file)}
              />
              <div className="ml-4 flex-grow overflow-hidden">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Remove file</span>
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? "Searching..." : "Search by Image"}
          </button>
        </div>
      </form>
    </>
  )
}
