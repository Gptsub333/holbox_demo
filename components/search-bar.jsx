"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

// Import the same features list used in other components
const features = [
  { name: "NL2SQL", href: "/nl2sql", description: "SQL queries using AI with instant results" },
  { name: "Health Scribe", href: "/health-scribe", description: "Transcribe medical audio and get answers" },
  { name: "Face Recognition", href: "/face-recognition", description: "Real-time detection and identification" },
  { name: "Video Compliance", href: "/video-compliance", description: "Analyze videos for safety and compliance" },
  { name: "PDF Extractor", href: "/pdf-extractor", description: "Upload PDFs and chat for insights" },
  { name: "Virtual Try-On", href: "/virtual-try-on", description: "Try garments on models using images" },
  { name: "Traffic Chatbot", href: "/traffic-chatbot", description: "AI assistant for traffic conditions" },
  { name: "Voice-Agent", href: "/voice-agent", description: "Voice-enabled booking and health assistant" },
  { name: "DDx Assistant", href: "/ddx-assistant", description: "Differential diagnosis from symptoms" },
  { name: "PII Extractor", href: "/pii-extractor", description: "Detect and extract personal information" },
  { name: "PII Redactor", href: "/pii-redactor", description: "Remove PII from input text securely" },
  { name: "Professional Headshot", href: "/ai-professional-headshot", icon: ImageIcon, description: "Generate polished, professional-looking headshots instantly with AI." },
]

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState([])
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()

    if (!query.trim()) {
      setResults([])
      setIsSearching(false)
      return
    }

    // Filter features based on query
    const filteredResults = features.filter(
      (feature) =>
        feature.name.toLowerCase().includes(query.toLowerCase()) ||
        feature.description.toLowerCase().includes(query.toLowerCase()),
    )

    setResults(filteredResults)
    setIsSearching(true)
  }

  const handleResultClick = (href) => {
    router.push(href)
    setQuery("")
    setResults([])
    setIsSearching(false)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    if (!value.trim()) {
      setResults([])
      setIsSearching(false)
      return
    }

    // Auto-search as user types
    const filteredResults = features.filter(
      (feature) =>
        feature.name.toLowerCase().includes(value.toLowerCase()) ||
        feature.description.toLowerCase().includes(value.toLowerCase()),
    )

    setResults(filteredResults)
    setIsSearching(true)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.form
        onSubmit={handleSearch}
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search AI features..."
            className="w-full rounded-full border-gray-700 bg-[#111111] pl-10 pr-4 py-5 text-sm shadow-md focus-visible:ring-2 focus-visible:ring-purple-500 mono-font text-gray-100"
            value={query}
            onChange={handleInputChange}
          />
        </div>
      </motion.form>

      <AnimatePresence>
        {isSearching && results.length > 0 && (
          <motion.div
            className="absolute z-10 mt-2 w-full rounded-md border border-gray-700 bg-[#111111] shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-2 max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {results.map((result, index) => (
                <motion.li
                  key={result.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center justify-between transition-colors duration-200"
                    onClick={() => handleResultClick(result.href)}
                  >
                    <span className="font-medium heading-font text-sm text-gray-200">{result.name}</span>
                    <span className="text-xs text-gray-400 truncate max-w-[70%] para-font">{result.description}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {isSearching && results.length === 0 && (
          <motion.div
            className="absolute z-10 mt-2 w-full rounded-md border border-gray-700 bg-[#111111] shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-5 text-center text-gray-400 para-font text-sm">No results found for "{query}"</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
