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
    setIsLoading(true)
    setShowResults(false)
    setShowScrollHint(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock API response
      const mockResults = {
        video: selectedVideo.name.toLowerCase().replace(/\s+/g, "_") + ".mp4",
        detected_faces: [
          {
            timestamp: timestamp,
            external_image_id: "doctor_Thomas",
          },
          {
            timestamp: timestamp + 0.5,
            external_image_id: "nurse_Sarah",
          },
        ],
      }

      setResults(mockResults)
      setShowResults(true)

      // Check if results table is visible
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
