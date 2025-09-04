"use client"

import { useState } from "react"
import { Header } from "./_components/Header"
import { ImageUploadArea } from "./_components/ImageUploadArea"
import { QueryInput } from "./_components/QueryInput"
import { EditButton } from "./_components/EditButton"
import { ResultDisplay } from "./_components/ResultDisplay"
import { SampleQueries } from "./_components/SampleQueries"
import { motion } from "framer-motion"
import { useAuthContext } from "../../context/AuthContext"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ImageEditingPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [query, setQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedImage, setEditedImage] = useState(null)
  const [error, setError] = useState(null)

  const { sessionToken, isLoaded, isSignedIn } = useAuthContext()
  const token = "Bearer " + sessionToken

  const handleImageUpload = (file) => {
    setSelectedImage(file)
    setEditedImage(null)
    setError(null)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleClearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setEditedImage(null)
    setError(null)
  }

  const handleQuerySelect = (selectedQuery) => {
    setQuery(selectedQuery)
  }

  const handleEdit = async () => {
    if (!selectedImage || !query.trim()) return

    setIsEditing(true)
    setEditedImage(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('query', query)

      const response = await fetch(`${BACKEND_URL}/image-editing`, {
        method: "POST",
        headers: {
          "Authorization": token
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.edited_image) {
        setEditedImage(data.edited_image)
      } else {
        throw new Error("No edited image received")
      }
    } catch (error) {
      console.error("Error editing image:", error)
      setError(error.message)
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 subheading-font">Upload Your Image</h2>
              <ImageUploadArea 
                onImageUpload={handleImageUpload}
                onClearImage={handleClearImage}
                imagePreview={imagePreview}
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 subheading-font">Describe Your Edit</h2>
              <QueryInput 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe what you want to change in the image..."
              />
              
              <div className="mt-4">
                <EditButton 
                  onClick={handleEdit} 
                  isEditing={isEditing}
                  disabled={!selectedImage || !query.trim()}
                />
              </div>
            </div>

            <div className="mt-8">
              <SampleQueries onSelect={handleQuerySelect} />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ResultDisplay 
              originalImage={imagePreview}
              editedImage={editedImage}
              isEditing={isEditing}
              error={error}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
