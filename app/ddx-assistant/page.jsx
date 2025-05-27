"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Header from "./_components/Header";
import ClinicalSamples from "./_components/ClinicalSamples";
import SymptomForm from "./_components/SymptomForm";
import InfoCard from "./_components/InfoCard";
import DiagnosisPopup from "./_components/DiagnosisPopup";
import {
  parseDiagnosisResponse,
  sampleDiagnosisResponse,
} from "./_components/utils";

//Put this is in a .env file when deploying
const BACKEND_URL = "http://3.148.149.70:8000";

export default function DDxAssistantPage() {
  const [symptoms, setSymptoms] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [activeSample, setActiveSample] = useState(null);
  const textareaRef = useRef(null);

  // Handle sample selection
  const handleSampleClick = (sample) => {
    setSymptoms(sample.content);
    setActiveSample(sample.id);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/ddx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: symptoms,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDiagnosis(data);
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
      // Optional: Add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  // Parse the diagnosis response
  const parsedDiagnosis = diagnosis ? parseDiagnosisResponse(diagnosis) : null;

  return (
    <div className="min-h-screen bg-white py-8 sm:py-10 md:py-12 relative overflow-y-auto">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Header />

        {/* Clinical Case Samples Section */}
        <ClinicalSamples
          activeSample={activeSample}
          onSampleClick={(sample) => handleSampleClick(sample)}
        />

        {/* Main Input Form */}
        <SymptomForm
          symptoms={symptoms}
          setSymptoms={setSymptoms}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />

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
  );
}
