"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Video, Clock } from "lucide-react"

const predefinedVideos = [
  {
    id: 1,
    name: "Sample Video 1",
    url: "https://harsh-rekognition-bucket.s3.us-east-1.amazonaws.com/demo_videos/hospital.mp4",
    duration: "0:24",
  },
  {
    id: 2,
    name: "Sample Video 2",
    url: "https://harsh-rekognition-bucket.s3.us-east-1.amazonaws.com/demo_videos/house.mp4",
    duration: "0:36",
  },
  {
    id: 3,
    name: "Sample Video 3",
    url: "https://harsh-rekognition-bucket.s3.us-east-1.amazonaws.com/demo_videos/20.mp4",
    duration: "0:27",
  },
]

export default function VideoSelector({ selectedVideo, onVideoSelect }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleVideoSelect = (video) => {
    onVideoSelect(video)
    setIsOpen(false)
  }

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-3">
        <Video className="h-4 w-4 text-[#2564eb] mr-2" />
        <h3 className="text-base font-medium text-gray-900">Select Video</h3>
      </div>

      <p className="text-xs text-gray-600 mb-4">Choose a sample video to analyze for face recognition.</p>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm"
        >
          <div className="flex items-center">
            <Video className="h-3 w-3 text-gray-500 mr-2" />
            <span className="text-gray-900 font-medium">
              {selectedVideo ? selectedVideo.name : "Choose a video..."}
            </span>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-3 w-3 text-gray-500" />
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : -10,
            scale: isOpen ? 1 : 0.95,
          }}
          transition={{ duration: 0.2 }}
          className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {predefinedVideos.map((video, index) => (
            <motion.button
              key={video.id}
              onClick={() => handleVideoSelect(video)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="flex items-center">
                <Video className="h-3 w-3 text-[#2564eb] mr-2" />
                <span className="text-gray-900 font-medium">{video.name}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {video.duration}
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center">
            <div className="w-2 h-2 bg-[#2564eb] rounded-full mr-2"></div>
            <span className="text-xs font-medium text-blue-900">{selectedVideo.name} selected</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">Duration: {selectedVideo.duration} • Ready for analysis</p>
        </motion.div>
      )}
    </motion.div>
  )
}
