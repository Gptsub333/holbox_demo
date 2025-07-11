"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, X } from "lucide-react"

export default function CameraView({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activeStream = null
    const openCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })
          activeStream = stream
          setStream(stream)
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } else {
          setError("Your browser does not support camera access.")
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setError("Could not access camera. Please check permissions.")
      }
    }

    openCamera()

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext("2d")
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" })
        onCapture(file)
      }, "image/jpeg")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-4 relative max-w-3xl w-full flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors z-10"
          aria-label="Close camera"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          {error ? (
            <div className="w-full h-full flex items-center justify-center text-center text-white p-4">
              <p>{error}</p>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
          )}
          {!stream && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <p>Starting camera...</p>
            </div>
          )}
        </div>
        <button
          onClick={handleCapture}
          disabled={!stream || !!error}
          className="mt-4 w-full px-4 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Camera className="w-5 h-5" />
          Capture Photo
        </button>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  )
}
