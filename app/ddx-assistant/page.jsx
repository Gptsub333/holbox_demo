"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Header from "./_components/Header"
import ClinicalSamples from './_components/ClinicalSamples';

import SymptomForm from "./_components/SymptomForm"
import InfoCard from "./_components/InfoCard"
import DiagnosisPopup from "./_components/DiagnosisPopup"
import { parseDiagnosisResponse, sampleDiagnosisResponse } from "./_components/utils"

export default function DDxAssistantPage() {
  const [symptoms, setSymptoms] = useState("")
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [diagnosis, setDiagnosis] = useState(null)
  const [activeSample, setActiveSample] = useState(null)
  const textareaRef = useRef(null)

  // Handle sample selection
  const handleSampleClick = (sample) => {
    setSymptoms(sample.content)
    setActiveSample(sample.id)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) return

    setIsLoading(true)

    // Simulate API call with a delay
    setTimeout(() => {
      // Use the sample response format
      setDiagnosis(sampleDiagnosisResponse)
      setIsLoading(false)
      setIsPopupOpen(true)
    }, 1500)
  }

  // Parse the diagnosis response
  const parsedDiagnosis = diagnosis ? parseDiagnosisResponse(diagnosis) : null

  return (
    <div className="min-h-screen bg-white py-8 sm:py-10 md:py-12">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Header />

        {/* Clinical Case Samples Section */}
        <ClinicalSamples activeSample={activeSample} onSampleClick={(sample) => handleSampleClick(sample)} />

        {/* Main Input Form */}
        <SymptomForm symptoms={symptoms} setSymptoms={setSymptoms} isLoading={isLoading} onSubmit={handleSubmit} />

        {/* Information Card */}
        <InfoCard />
      </motion.div>

      {/* Diagnosis Popup */}
      <DiagnosisPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        diagnosis={diagnosis}
        parsedDiagnosis={parsedDiagnosis}
      />
    </div>
  )
}
