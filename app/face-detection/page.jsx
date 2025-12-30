"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScanFace } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadArea } from "./_components/upload-area";
import ShowResult from "./_components/ShowResult";
import { useAuthContext } from "../../context/AuthContext";
import UsersTable from "../../components/face-table";
import { AddFaceForm } from "@/components/Add-faceform";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function FaceDetectionPage() {
  const [section, setSection] = useState("add");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { sessionToken } = useAuthContext();

  // 🔁 table refresh token for UsersTable
  const [usersRefreshToken, setUsersRefreshToken] = useState(0);
  const triggerUsersRefresh = () =>
    setUsersRefreshToken((prev) => prev + 1);

  // Recognize Face API call
  async function recognizeFaceAPI(formData) {
    const res = await fetch(`${BACKEND_URL}/recognize_face`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to recognize face");
    }

    const data = await res.json();
    return { success: true, data };
  }

  // Handle file processing for recognize section
  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Drag and drop handlers
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  // Handle recognize face submission
  const handleRecognizeSubmit = async () => {
    setError(null);

    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await recognizeFaceAPI(formData);
      if (response.success) {
        setApiResponse(response.data);
        setShowResult(true);
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the API.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle face added success → 🔁 refresh table
  const handleFaceAddedSuccess = (data) => {
    console.log("Face added successfully:", data);
    // trigger table refresh
    triggerUsersRefresh();
    // optional: show toast here
  };

  // Section toggle
  const handleSectionChange = (newSection) => {
    setSection(newSection);
    setShowResult(false);
    setError(null);
    setApiResponse(null);
    setImageFile(null);
    setImagePreview(null);
  };

  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center space-x-3">
            <ScanFace className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold text-gray-800 heading-font">
              AI Face Detection
            </h1>
          </div>
          <p className="mt-2 text-base text-gray-600 para-font">
            Upload an image to add or recognize faces with our advanced AI.
          </p>
        </motion.div>

        <SectionToggle current={section} onChange={handleSectionChange} />

        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-5">
            {/* Show result for recognize section */}
            {showResult && section === "recognize" && apiResponse && (
              <ShowResult
                section="recognize"
                imagePreview={imagePreview}
                apiResponse={apiResponse}
                onClose={() => setShowResult(false)}
              />
            )}

            {/* Form content */}
            {!showResult && (
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {section === "add" ? (
                  <AddFaceForm
                    onSuccess={handleFaceAddedSuccess}
                    showResultInline={true}
                    compact={false}
                  />
                ) : (
                  <>
                    <UploadArea
                      imagePreview={imagePreview}
                      isDragOver={isDragOver}
                      onFileChange={processFile}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClearImage={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                    />

                    {error && (
                      <div className="text-xs text-red-500">{error}</div>
                    )}

                    <button
                      type="button"
                      onClick={handleRecognizeSubmit}
                      disabled={isLoading || !imageFile}
                      className={cn(
                        "w-full py-2 rounded-xl font-semibold text-sm transition",
                        isLoading
                          ? "bg-blue-200 text-blue-50 cursor-wait"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow"
                      )}
                    >
                      {isLoading ? "Recognizing..." : "Recognize Face"}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* 🔁 Pass refresh token into UsersTable */}
        <UsersTable refreshToken={usersRefreshToken} />
      </motion.div>
    </div>
  );
}

function SectionToggle({ current, onChange }) {
  return (
    <div className="flex w-full bg-gray-100 rounded-lg overflow-hidden my-4">
      {["add", "recognize"].map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={cn(
            "w-1/2 py-2 text-center font-medium text-base transition",
            current === type
              ? "bg-white text-blue-600 shadow-sm"
              : "bg-gray-100 text-gray-400 hover:text-blue-600"
          )}
          style={{
            borderBottom: current === type ? "2px solid #2564eb" : "none",
            fontWeight: 600,
          }}
          aria-pressed={current === type}
        >
          {type === "add" ? "Add Face" : "Recognize Face"}
        </button>
      ))}
    </div>
  );
}
