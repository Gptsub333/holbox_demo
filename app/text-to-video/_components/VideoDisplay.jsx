"use client"

import { Download, Play, Pause } from "lucide-react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"

export function VideoDisplay({ video, isGenerating, prompt }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleDownload = () => {
    if (!video) return
    const link = document.createElement("a")
    link.href = video
    link.download = `generated_video_${Date.now()}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
      whileHover={{ shadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-lg font-medium mb-3">Generated Video</h3>

      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-3">
        {isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-gray-500">Generating your video...</p>
            </div>
          </div>
        ) : video ? (
          <>
            <video
              ref={videoRef}
              src={video}
              className="w-full h-full object-cover"
              loop
              muted
              // We won't use autoPlay here to control play/pause manually
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <motion.button
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                onClick={handlePlayPause}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                title={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-gray-800" />
                ) : (
                  <Play className="h-4 w-4 text-gray-800" />
                )}
              </motion.button>

              <motion.button
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                onClick={handleDownload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Download video"
                title="Download video"
              >
                <Download className="h-4 w-4 text-gray-800" />
              </motion.button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Play className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 text-center px-4">Enter a prompt and generate a video</p>
            </div>
          </div>
        )}
      </div>

      {video && !isGenerating && (
        <motion.div
          className="mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-sm font-medium mb-2">Prompt</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{prompt}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
