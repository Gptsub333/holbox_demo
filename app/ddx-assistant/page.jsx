"use client";

import { useAuthContext } from "../../context/AuthContext";  // Import the context
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Header from "./_components/Header";
import ClinicalSamples from "./_components/ClinicalSamples";
import SymptomForm from "./_components/SymptomForm";
import InfoCard from "./_components/InfoCard";
import DiagnosisPopup from "./_components/DiagnosisPopup";
import { parseDiagnosisResponse } from "./_components/utils";

// const BACKEND_URL = "http://0.0.0.0:8000/api/demo_backend_v2"; // Replace with your backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function DDxAssistantPage() {
  const [symptoms, setSymptoms] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [activeSample, setActiveSample] = useState(null);
  const textareaRef = useRef(null);

  const { sessionToken, isLoaded, isSignedIn } = useAuthContext();  // Get the session token from the context

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    console.log("Session Token:", sessionToken);
    const token = "Bearer " + sessionToken;

    setIsLoading(true);

    // Check if sessionToken is available before making the request
    if (!sessionToken) {
      console.error("Session token is not available");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/ddx`, {
        method: "POST",
        headers: {
          "Authorization": token, // Send token in Authorization header
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
          onSampleClick={(sample) => setSymptoms(sample.content)}
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
