"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "./_components/Header"
import SampleTexts from "./_components/SampleTexts"
import TextInput from "./_components/TextInput"
import RedactButton from "./_components/RedactButton"
import ResultsPopup from "./_components/ResultsPopup"

const BACKEND_URL = "http://3.148.149.70:8000/redact"
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
  

   const handleRedact = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    setOriginalText(inputText)

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      const fullText = data.redacted
      const redactedContent = fullText.split('\n').slice(2).join('\n').trim() // this is for removing first line from api response

      setRedactedText(redactedContent)
      // setRedactedText(data.redacted)
      setShowResults(true)
    } catch (error) {
      console.error("Error redacting PII:", error)
      setRedactedText("[Error redacting PII]")
      setShowResults(true)
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
