"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "./_components/Header"
import SampleTexts from "./_components/SampleTexts"
import TextInput from "./_components/TextInput"
import RedactButton from "./_components/RedactButton"
import ResultsPopup from "./_components/ResultsPopup"

export default function PIIRedactorPage() {
  const [inputText, setInputText] = useState("")
  const [selectedSample, setSelectedSample] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [originalText, setOriginalText] = useState("")
  const [redactedText, setRedactedText] = useState("")

  const handleSampleSelect = (sample) => {
    setSelectedSample(sample)
    setInputText(sample.fullText)
  }

  // PII redaction simulation directly in the component
  const redactPII = (text) => {
    let redactedText = text

    // Email addresses
    redactedText = redactedText.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[REDACTED EMAIL]")

    // Social Security Numbers
    redactedText = redactedText.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED SSN]")

    // Names (simple pattern - capitalized words)
    redactedText = redactedText.replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, "[REDACTED NAME]")

    // Addresses (simple pattern)
    redactedText = redactedText.replace(
      /\b\d+\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/g,
      "[REDACTED ADDRESS]",
    )

    // Account numbers
    redactedText = redactedText.replace(/\b(Account|ID|Number|#)\s*:?\s*[A-Z0-9]+/gi, "[REDACTED ACCOUNT]")

    // Credit card numbers (ending in pattern)
    redactedText = redactedText.replace(/ending in \d{4}/gi, "ending in [REDACTED]")

    // Dates of birth
    redactedText = redactedText.replace(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, "[REDACTED DATE]")

    // Driver's license
    redactedText = redactedText.replace(/\b[A-Z]{2}\d+\b/g, "[REDACTED ID]")

    return redactedText
  }

  const handleRedact = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    setOriginalText(inputText)

    try {
      // Simulate a brief processing delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const result = redactPII(inputText)
      setRedactedText(result)
      setShowResults(true)
    } catch (error) {
      console.error("Error redacting PII:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseResults = () => {
    setShowResults(false)
    setOriginalText("")
    setRedactedText("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <motion.div
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />

        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-5 gap-6" style={{ minHeight: "400px" }}>
            {/* Sample Texts - Left Side */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SampleTexts selectedSample={selectedSample} onSampleSelect={handleSampleSelect} />
            </motion.div>

            {/* Text Input - Right Side */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TextInput text={inputText} setText={setInputText} selectedSample={selectedSample} />
            </motion.div>
          </div>

          <RedactButton onClick={handleRedact} isLoading={isLoading} disabled={!inputText.trim()} />
        </motion.div>
      </motion.div>

      {showResults && (
        <ResultsPopup
          isOpen={showResults}
          onClose={handleCloseResults}
          originalText={originalText}
          redactedText={redactedText}
        />
      )}
    </div>
  )
}
