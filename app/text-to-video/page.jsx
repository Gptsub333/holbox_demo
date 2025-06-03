"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "./_components/Header"
import { TextInput } from "./_components/TextInput"
import { GenerateButton } from "./_components/GenerateButton"
import { SamplePrompts } from "./_components/SamplePrompts"
import { VideoDisplay } from "./_components/VideoDisplay"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function TextToVideoPage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState(null)
  const [jobId, setJobId] = useState(null)
  const [videoStatus, setVideoStatus] = useState("")

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)
  }

  const handleSelectSample = (samplePrompt) => {
    setPrompt(samplePrompt)
  }

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedVideo(null) // Clear previously generated video
    setVideoStatus("processing") // Set status to processing

    try {
      // Call API to generate video
      const response = await fetch(`${BACKEND_URL}/generate-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: prompt,
          seed: 42 // Optional seed
        })
      })

      if (!response.ok) {
        throw new Error("Failed to generate video")
      }

      const data = await response.json()

      // Store jobId for checking status
      setJobId(data.job_id)

      // Check the video status after video generation request is made
      checkVideoStatus(data.job_id)

    } catch (error) {
      console.error("Error generating video:", error)
      setIsGenerating(false)
    }
  }

  const checkVideoStatus = async (jobId) => {
    try {
      // Check video status using job_id
      const statusResponse = await fetch(`${BACKEND_URL}/video-status?job_id=${jobId}`)
      const statusData = await statusResponse.json()

      if (statusData.status === "completed") {
        setGeneratedVideo(statusData.video_url) // Set the video URL once completed
        setIsGenerating(false)
      } else {
        // If video is still processing, keep checking
        setTimeout(() => checkVideoStatus(jobId), 5000) // Poll every 5 seconds
      }

    } catch (error) {
      console.error("Error checking video status:", error)
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Header />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
          <motion.div
            className="lg:col-span-7 space-y-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
              whileHover={{ shadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-medium mb-3">Create Your Video</h3>
              <TextInput value={prompt} onChange={handlePromptChange} />
              <div className="mt-4">
                <GenerateButton onClick={handleGenerateVideo} isGenerating={isGenerating} />
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
              whileHover={{ shadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-medium mb-3">Sample Prompts</h3>
              <SamplePrompts onSelect={handleSelectSample} />
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <VideoDisplay video={generatedVideo} isGenerating={isGenerating} prompt={prompt} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
