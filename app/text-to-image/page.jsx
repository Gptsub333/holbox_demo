"use client"

import { useState } from "react"
import { Header } from "./_components/Header"
import { TextInput } from "./_components/TextInput"
import { SamplePrompts } from "./_components/SamplePrompts"
import { GenerateButton } from "./_components/GenerateButton"
import { ImageDisplay } from "./_components/ImageDisplay"
import { motion } from "framer-motion"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function TextToImagePage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState([]) // Array now
  

  const handlePromptSelect = (selectedPrompt) => {
    setPrompt(selectedPrompt)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedImages([])

    try {
      const response = await fetch(`${BACKEND_URL}/generate`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: prompt,
          width: 1024,
          height: 1024,
          number_of_images: 1,
          cfg_scale: 8,
          seed: 42,
          quality: "standard"
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.images && Array.isArray(data.images)) {
        setGeneratedImages(data.images)
      } else {
        setGeneratedImages([])
      }
    } catch (error) {
      console.error("Error generating image:", error)
      setGeneratedImages([])
    } finally {
      setIsGenerating(false)
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 subheading-font">Create Your Image</h2>
              <TextInput value={prompt} onChange={(e) => setPrompt(e.target.value)} />

              <div className="mt-4">
                <GenerateButton onClick={handleGenerate} isGenerating={isGenerating} />
              </div>
            </div>

            <div className="mt-8">
              <SamplePrompts onSelect={handlePromptSelect} />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ImageDisplay generatedImages={generatedImages} isGenerating={isGenerating} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
