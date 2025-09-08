"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  X,
  Search,
  Database,
  Stethoscope,
  User,
  Video,
  FileText,
  Shirt,
  Car,
  Mic,
  Clipboard,
  UserX,
  FileX,
  ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const features = [
  { name: "NL2SQL", href: "/nl2sql", icon: Database, description: "Natural language to SQL queries" },
  { name: "Health Scribe", href: "/health-scribe", icon: Stethoscope, description: "Medical audio transcription" },
  { name: "Face Recognition", href: "/face-recognition", icon: User, description: "Real-time face detection" },
  { name: "Video Compliance", href: "/video-compliance", icon: Video, description: "Video safety analysis" },
  { name: "PDF Extractor", href: "/pdf-extractor", icon: FileText, description: "Extract insights from PDFs" },
  { name: "Virtual Try-On", href: "/virtual-try-on", icon: Shirt, description: "Virtual garment fitting" },
  { name: "Traffic Chatbot", href: "/traffic-chatbot", icon: Car, description: "Traffic safety assistant" },
  { name: "Voice-Agent", href: "/voice-agent", icon: Mic, description: "Voice-enabled AI assistant" },
  { name: "DDx Assistant", href: "/ddx-assistant", icon: Clipboard, description: "Differential diagnosis tool" },
  { name: "PII Extractor", href: "/pii-extractor", icon: UserX, description: "Extract personal information" },
  { name: "PII Redactor", href: "/pii-redactor", icon: FileX, description: "Remove personal information" },
  { name: "Image Editing", href: "/image-editing", icon: ImageIcon, description: "Edit images with AI using text queries" },
  { name: "Proffesional Headshot", href: "/ai-professional-headshot", icon: ImageIcon, description: "Generate polished, professional-looking headshots instantly with AI." },
]

export function SearchPanel({ onClose }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const inputRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    // Focus the input when the overlay opens
    inputRef.current?.focus()

    // Add escape key listener
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    // Add click outside listener
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    window.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  const filteredFeatures = query
    ? features.filter(
        (feature) =>
          feature.name.toLowerCase().includes(query.toLowerCase()) ||
          feature.description.toLowerCase().includes(query.toLowerCase()),
      )
    : features

  const handleFeatureClick = (href) => {
    router.push(href)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          ref={panelRef}
          className="w-full max-w-3xl mx-auto bg-[#111111] rounded-xl border border-gray-800 shadow-xl overflow-hidden"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
        >
          <div className="p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-100 heading-font">Applications</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search applications..."
                className={cn(
                  "w-full pl-8 pr-3 py-2 rounded-lg",
                  "bg-gray-900 border border-gray-700",
                  "text-gray-100 placeholder-gray-400 para-font",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                )}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredFeatures.map((feature, index) => (
                <motion.button
                  key={feature.href}
                  className="group"
                  onClick={() => handleFeatureClick(feature.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1.0],
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div
                    className={cn(
                      "flex flex-col items-center p-4 rounded-lg",
                      "bg-gray-900 border border-gray-700",
                      "transition-all duration-300",
                      "group-hover:border-purple-500 group-hover:shadow-lg group-hover:shadow-purple-900/20",
                    )}
                  >
                    <div className="relative w-10 h-10 mb-2 group-hover:-translate-y-2 transition-all duration-300">
                      <div className="absolute inset-0 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:border-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300">
                        <feature.icon className="h-6 w-6 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-200 text-center heading-font group-hover:text-white transition-colors duration-300">
                      {feature.name}
                    </span>
                    <span className="text-xs text-gray-400 text-center mt-1 para-font group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            {filteredFeatures.length === 0 && (
              <motion.div
                className="flex flex-col items-center justify-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-200 mb-2 subheading-font">No results found</h3>
                <p className="text-gray-400 text-center text-sm para-font">
                  We couldn't find any applications matching "{query}"
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
