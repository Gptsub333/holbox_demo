"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "./_components/Header"
import SampleImages from "./_components/SampleImages"
import ImageUpload from "./_components/ImageUpload"
import ImageResult from "./_components/ImageResult"
import helpers from "@/utils/helper"
import constants from "@/utils/constants"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function GenerateInteriorDesign() {
  const [selectedImage, setSelectedImage] = useState(null)   // File OR sample object
  const [imagePreview, setImagePreview] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [editedImage, setEditedImage] = useState(null)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [zoom, setZoom] = useState(100)

  const [roomType, setRoomType] = useState("")
  const [designTheme, setDesignTheme] = useState("")
  const [prompt, setPrompt] = useState("")

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return

    const typeError = helpers.checkImageFileType(file)
    if (typeError) {
      setError(typeError)
      return
    }
    const sizeError = helpers.fileSize(
      constants.fileSize.imageEdit.inBytes,
      constants.fileSize.imageEdit.inMB
    )(file)
    if (sizeError) {
      setError(sizeError)
      return
    }

    setError(null)
    setEditedImage(null)
    setSelectedImage(file)

    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  // Handle sample selection
  const handleSampleSelect = (sample) => {
    setSelectedImage(sample)
    setImagePreview(sample.fullImage)
    setEditedImage(null)
    setError(null)
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setEditedImage(null)
    setError(null)
    setZoom(100)
  }

  // Call /generate_interior_design
  const handleGenerateInteriorDesign = async () => {
    if (!selectedImage) {
      setError("Please upload or choose a sample room image.")
      return
    }

    setIsProcessing(true)
    setError(null)
    setEditedImage(null)

    try {
      const fd = new FormData()

      if (selectedImage instanceof File) {
        fd.append("room_image", selectedImage)
      } else {
        // sample object
        const response = await fetch(selectedImage.fullImage)
        const blob = await response.blob()
        const file = new File([blob], "sample.jpg", { type: blob.type || "image/jpeg" })
        fd.append("room_image", file)

        const samplePrompt = selectedImage.prompts?.[0] || ""
        if (samplePrompt) {
          fd.append("prompt", samplePrompt)
        }
      }

      // Extra fields
      if (roomType) fd.append("room_type", roomType)
      if (designTheme) fd.append("design_theme", designTheme)
      if (prompt) fd.append("prompt", prompt)

      const resp = await fetch(`${BACKEND_URL}/generate_interior_design`, {
        method: "POST",
        body: fd
      })

      if (!resp.ok) {
        const text = await resp.text().catch(() => "")
        throw new Error(text || `HTTP ${resp.status}`)
      }

      const contentType = resp.headers.get("content-type") || ""
      if (contentType.includes("image/")) {
        const blob = await resp.blob()
        const url = URL.createObjectURL(blob)
        setEditedImage(url)
      } else {
        const data = await resp.json().catch(() => ({}))
        if (data.image_url) {
          setEditedImage(data.image_url)
        } else {
          throw new Error("Unexpected response from server.")
        }
      }
    } catch (err) {
      console.error(err)
      setError(`Interior design generation failed: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header title="Generate Interior Design" />

        {/* Sample Images */}
        <SampleImages handleSampleSelect={handleSampleSelect} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Upload */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageUpload
              imagePreview={imagePreview}
              dragOver={dragOver}
              setDragOver={setDragOver}
              clearImage={clearImage}
              setZoom={setZoom}
              zoom={zoom}
              handleFileSelect={handleFileSelect}
            />

            {/* Actions */}
            <div className="flex items-center justify-center w-full">
              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 mx-auto text-center w-full max-w-sm md:max-w-md">
                {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

                {/* Room Type + Theme Inputs */}
                <div className="mb-3 w-full">
                  <input
                    type="text"
                    placeholder="Room Type (e.g., Living Room)"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Design Theme (e.g., Modern, Cozy)"
                    value={designTheme}
                    onChange={(e) => setDesignTheme(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                  />
                  <textarea
                    placeholder="Custom Prompt (optional)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col items-center">
                  <button
                    onClick={handleGenerateInteriorDesign}
                    disabled={isProcessing || !selectedImage}
                    className={`w-full md:w-auto px-4 py-2 rounded-lg text-white ${
                      isProcessing || !selectedImage
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isProcessing ? "Generating..." : "Generate Interior Design"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel: Results */}
          <ImageResult
            editedImage={editedImage}
            imagePreview={imagePreview}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  )
}
