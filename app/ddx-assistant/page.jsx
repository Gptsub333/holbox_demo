"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./_components/Header";
import ClinicalSamples from "./_components/ClinicalSamples";
import SymptomForm from "./_components/SymptomForm";
import InfoCard from "./_components/InfoCard";
import DiagnosisPopup from "./_components/DiagnosisPopup";
import { parseDiagnosisResponse } from "./_components/utils";
import Cookies from "js-cookie"; // Import the js-cookie library

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function DDxAssistantPage() {
  const [symptoms, setSymptoms] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [activeSample, setActiveSample] = useState(null);
  const textareaRef = useRef(null);

  // Function to get or create a session ID
  const getSessionId = () => {
    let sessionId = Cookies.get("session_id");
    if (!sessionId) {
      sessionId = generateSessionId();
      Cookies.set("session_id", sessionId, { expires: 365 }); // Set cookie to expire in a year
    }
    return sessionId;
  };

  // Generate a simple session ID (you can replace this with a more complex method)
  const generateSessionId = () => {
    return "session_" + Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    // Ensure the session ID is set when the component mounts
    getSessionId();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    const sessionId = getSessionId(); // Get the session ID

    try {
      const response = await fetch(`${BACKEND_URL}/ddx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId, // Send the session ID in the request headers
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
