"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Lock } from "lucide-react";
import SampleTextSelector from "./_components/SampleTextSelector";
import TextAreaInput from "./_components/TextAreaInput";
import ExtractButton from "./_components/ExtractButton";
import FloatingPopup from "./_components/FloatingPopup";
import { useAuthContext } from "../../context/AuthContext"; // Import the context

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const EXTRACT_ENDPOINT = "/extract"

export default function PIIExtractorPage() {
  const [text, setText] = useState("");
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const { sessionToken } = useAuthContext(); // Get the session token from the context

  const token = "Bearer " + sessionToken;

  const handleSelectText = (sampleText, id) => {
    setText(sampleText);
    setSelectedSampleId(id);
  };

  const handleTextChange = (newText) => {
    setText(newText);
    if (newText !== text) {
      setSelectedSampleId(null);
    }
  };

  const handleExtract = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setIsPopupOpen(true);
    setApiResponse(null);

    try {
      const response = await fetch(`${BACKEND_URL}/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token, // Send token in Authorization header
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      let parsed = {};

      if (typeof data.extracted === "string") {
        const match = data.extracted.match(/{[\s\S]*}/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch (err) {
            console.error("Failed to parse extracted JSON:", err);
          }
        }
      } else if (typeof data.extracted === "object") {
        parsed = data.extracted;
      }

      const normalized = {
        extracted: {
          phoneNumbers: parsed.PhoneNumber ? [parsed.PhoneNumber] : [],
          emailAddresses: parsed.Email ? [parsed.Email] : [],
          names: parsed.Name ? [parsed.Name] : [],
          addresses: parsed.Address ? [parsed.Address] : [],
          datesOfBirth: parsed.DOB ? [parsed.DOB] : [],
          riskLevel: parsed.RiskLevel || "LOW",
          socialSecurityNumbers: parsed.SSN ? [parsed.SSN] : [],
          summary: parsed.Summary || "Some PII elements were extracted.",
        },
      };

      setApiResponse(normalized);
    } catch (error) {
      console.error("Error extracting PII:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setApiResponse(null);
  };

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact Header - Left Aligned */}
        <motion.div
          className="flex items-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <Shield className="h-5 w-5" style={{ color: "#2564eb" }} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              PII Extractor AI Assistant
            </h1>
            <p className="text-xs text-gray-600">
              Analyze text to identify personally identifiable information
            </p>
          </div>
        </motion.div>

        {/* Main Content - Equal Height Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sample Texts - Top on mobile, Left on desktop */}
          <motion.div
            className="order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full">
              <SampleTextSelector
                onSelectText={handleSelectText}
                selectedId={selectedSampleId}
              />
            </div>
          </motion.div>

          {/* Text Input - Bottom on mobile, Right on desktop */}
          <motion.div
            className="order-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col">
              <div className="flex-1">
                <TextAreaInput text={text} onTextChange={handleTextChange} />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <ExtractButton
                  onClick={handleExtract}
                  disabled={!text.trim()}
                  isLoading={isLoading}
                />

                <div className="flex items-center space-x-2 text-xs">
                  <Lock className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-500">
                    {text.trim() ? "Ready for analysis" : "Enter text to begin"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gray/White Theme Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-gray-200 rounded-md">
                <Shield className="h-3 w-3 text-gray-700" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">
                Smart Detection
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              AI algorithms identify names, addresses, phones, emails, and
              sensitive data.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-gray-200 rounded-md">
                <Lock className="h-3 w-3 text-gray-700" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">
                Secure Processing
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              Privacy-focused analysis with enterprise-grade security measures.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-gray-200 rounded-md">
                <Shield className="h-3 w-3 text-gray-700" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">
                Compliance Ready
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              Built with GDPR, HIPAA, and CCPA compliance in mind.
            </p>
          </div>
        </motion.div>

        {/* Gray/White Theme Notice */}
        <motion.div
          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-gray-200 rounded-md flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-gray-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Privacy Notice
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                This tool is for demonstration purposes. Always ensure proper
                authorization before analyzing personal information and handle
                extracted PII according to applicable privacy regulations.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Floating Popup */}
      <FloatingPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        response={apiResponse}
        isLoading={isLoading}
      />
    </div>
  );
}
