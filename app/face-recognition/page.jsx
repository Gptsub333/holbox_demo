"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import IntroSection from "./_components/IntroSection"
import VideoSelector from "./_components/VideoSelector"
import VideoPlayer from "./_components/VideoPlayer"
import AnalysisButton from "./_components/AnalysisButton"
import ResultsTable from "./_components/ResultsTable"
import ScrollHintArrow from "./_components/ScrollHintArrow"

export default function FaceRecognitionPage() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const resultsRef = useRef(null)

  const BACKEND_URL = "https://5a85-3-148-149-70.ngrok-free.app"

  const handleVideoSelect = (video) => {
    setSelectedVideo(video)
    setResults(null)
    setShowResults(false)
    setCurrentTime(0)
    setShowScrollHint(false)
  }

  const handleTimeUpdate = (time) => {
    setCurrentTime(time)
  }

  const handleAnalyze = async (timestamp) => {
  if (!selectedVideo) return

  setIsLoading(true)
  setShowResults(false)
  setShowScrollHint(false)

  try {
    // Fetch video from S3 URL as blob
    const videoBlob = await fetch(selectedVideo.url).then(res => res.blob())

    // Create a File object to send
    const videoFile = new File([videoBlob], `${selectedVideo.name.replace(/\s+/g, "_")}.mp4`, {
      type: "video/mp4",
    })

    // Prepare form data for upload
    const formData = new FormData()
    formData.append("video", videoFile)

    // Send to your FastAPI backend - replace with your EC2 public IP
    const response = await fetch(`${BACKEND_URL}/detect_faces`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()

    setResults(data)
    setShowResults(true)

    // Scroll hint logic same as before
    setTimeout(() => {
      if (resultsRef.current) {
        const rect = resultsRef.current.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        if (!isVisible) {
          setShowScrollHint(true)
        }
      }
    }, 500)
  } catch (error) {
    console.error("Analysis failed:", error)
  } finally {
    setIsLoading(false)
  }
}


  const handleHintDismiss = () => {
    setShowScrollHint(false)
  }

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <IntroSection />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Video Selector */}
          <VideoSelector selectedVideo={selectedVideo} onVideoSelect={handleVideoSelect} />

          {/* Video Player */}
          <VideoPlayer selectedVideo={selectedVideo} onTimeUpdate={handleTimeUpdate} />
        </div>

        {/* Analysis Button */}
        <AnalysisButton
          selectedVideo={selectedVideo}
          currentTime={currentTime}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Results Table */}
        <div ref={resultsRef}>
          <ResultsTable results={results} isVisible={showResults} />
        </div>

        {/* Scroll Hint Arrow */}
        <ScrollHintArrow showHint={showScrollHint} onHintDismiss={handleHintDismiss} />
      </motion.div>
    </div>
  )
}
