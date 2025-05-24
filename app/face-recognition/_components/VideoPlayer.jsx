"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, Maximize } from "lucide-react"

export default function VideoPlayer({ selectedVideo, onTimeUpdate }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      videoRef.current.load()
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [selectedVideo])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime
      setCurrentTime(time)
      onTimeUpdate(time)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      const time = pos * duration
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-50">
        {selectedVideo ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={selectedVideo.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="h-6 w-6 text-[#2564eb] ml-0.5" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Please select a video to analyze</p>
              <p className="text-gray-500 text-xs mt-1">Choose from the video selector on the left</p>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        {selectedVideo && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/30 rounded-full mb-2 cursor-pointer" onClick={handleSeek}>
              <div
                className="h-full bg-[#2564eb] rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 text-white" />
                  ) : (
                    <Play className="h-4 w-4 text-white ml-0.5" />
                  )}
                </button>

                <div className="flex items-center space-x-1">
                  <Volume2 className="h-3 w-3 text-white" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => {
                      const vol = Number.parseFloat(e.target.value)
                      setVolume(vol)
                      if (videoRef.current) {
                        videoRef.current.volume = vol
                      }
                    }}
                    className="w-12 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                <span className="text-white text-xs font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <button className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center transition-colors duration-200">
                <Maximize className="h-3 w-3 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
