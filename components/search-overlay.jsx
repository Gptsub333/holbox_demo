"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FeatureIcon } from "@/components/feature-icons"
import { motion, AnimatePresence } from "framer-motion"

export function SearchOverlay({ onClose, features }) {
  const [query, setQuery] = useState("")
  const [filteredFeatures, setFilteredFeatures] = useState(features)
  const router = useRouter()
  const inputRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    // Focus the input when the overlay opens
    inputRef.current?.focus()

    // Add escape key listener
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    // Add click outside listener
    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
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

  useEffect(() => {
    if (query) {
      setFilteredFeatures(features.filter((feature) => feature.name.toLowerCase().includes(query.toLowerCase())))
    } else {
      setFilteredFeatures(features)
    }
  }, [query, features])

  const handleFeatureClick = (href) => {
    router.push(href)
    onClose()
  }

  const handleSearch = (e) => {
    e.preventDefault()

    if (filteredFeatures.length > 0) {
      // Navigate to the first result
      router.push(filteredFeatures[0].href)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          ref={overlayRef}
          className="w-full max-w-2xl mx-auto rounded-lg border border-gray-700 bg-[#111111] p-4 shadow-lg"
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold heading-font text-gray-100">Search AI Features</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-gray-300 hover:bg-gray-800">
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type to search..."
              className="w-full pl-9 text-sm para-font bg-gray-900 border-gray-700 text-gray-100"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pb-8">
            {filteredFeatures.length > 0 ? (
              filteredFeatures.map((feature, index) => (
                <motion.div
                  key={feature.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1.0],
                  }}
                >
                  <Button
                    variant="outline"
                    className="group flex flex-col h-auto items-center justify-center p-2.5 gap-1.5 border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-purple-500 transition-all w-full"
                    onClick={() => handleFeatureClick(feature.href)}
                  >
                    <div className="relative group-hover:-translate-y-2 transition-all duration-300">
                      <FeatureIcon
                        icon={feature.icon}
                        size="sm"
                        gradient="gray"
                        className="group-hover:opacity-100 opacity-70 transition-opacity duration-300 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                      />
                    </div>
                    <span className="subheading-font text-xs text-gray-200 group-hover:text-white transition-colors duration-300">
                      {feature.name}
                    </span>
                  </Button>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-6 text-gray-400 para-font"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                No features found matching "{query}"
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
