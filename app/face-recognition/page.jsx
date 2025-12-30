"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import IntroSection from "./_components/IntroSection";
import VideoSelector from "./_components/VideoSelector";
import VideoPlayer from "./_components/VideoPlayer";
import AnalysisButton from "./_components/AnalysisButton";
import ResultsTable from "./_components/ResultsTable";
import ScrollHintArrow from "./_components/ScrollHintArrow";
import { useAuthContext } from "../../context/AuthContext";
import UsersTable from "../../components/face-table";
import { AddFaceForm } from "@/components/Add-faceform";

export default function FaceRecognitionPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [timestamps, setTimestamps] = useState([]);

  // Recognition timer state
  const [recognitionElapsed, setRecognitionElapsed] = useState(0);
  const recognitionTimerRef = useRef(null);
  const { sessionToken } = useAuthContext();
  const resultsRef = useRef(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 🔁 Faces table refresh token
  const [usersRefreshToken, setUsersRefreshToken] = useState(0);
  const triggerUsersRefresh = () =>
    setUsersRefreshToken((prev) => prev + 1);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setResults(null);
    setShowResults(false);
    setCurrentTime(0);
    setShowScrollHint(false);
    setRecognitionElapsed(0);
    setTimestamps([]);

    if (recognitionTimerRef.current) {
      clearInterval(recognitionTimerRef.current);
      recognitionTimerRef.current = null;
    }
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handleAnalyze = async (timestamp) => {
    if (!selectedVideo) return;
    setIsLoading(true);
    setShowResults(false);
    setShowScrollHint(false);
    setRecognitionElapsed(0);

    // Start recognition timer
    if (recognitionTimerRef.current) {
      clearInterval(recognitionTimerRef.current);
      recognitionTimerRef.current = null;
    }
    recognitionTimerRef.current = setInterval(() => {
      setRecognitionElapsed((prev) => prev + 1);
    }, 1000);

    try {
      // Fetch video from S3 URL as blob
      const videoBlob = await fetch(selectedVideo.url).then((res) => res.blob());

      // Create a File object to send
      const videoFile = new File(
        [videoBlob],
        `${selectedVideo.name.replace(/\s+/g, "_")}.mp4`,
        {
          type: "video/mp4",
        }
      );

      // Prepare form data for upload
      const formData = new FormData();
      formData.append("video", videoFile);

      // Send to your FastAPI backend
      const response = await fetch(`${BACKEND_URL}/detect_faces`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Set the timestamps from the API response
      const faces = data.detected_faces || [];
      const faceTimestamps = faces.map((face) => face.timestamp);
      setTimestamps(faceTimestamps);

      setResults(data);
      setShowResults(true);

      // Scroll hint logic
      setTimeout(() => {
        if (resultsRef.current) {
          const rect = resultsRef.current.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (!isVisible) {
            setShowScrollHint(true);
          }
        }
      }, 500);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
      // Stop recognition timer
      if (recognitionTimerRef.current) {
        clearInterval(recognitionTimerRef.current);
        recognitionTimerRef.current = null;
      }
    }
  };

  const handleHintDismiss = () => {
    setShowScrollHint(false);
  };

  // ✅ called when AddFaceForm succeeds
  const handleFaceAddedSuccess = (data) => {
    console.log("Face added successfully from recognition page:", data);
    triggerUsersRefresh(); // 🔁 refresh the UsersTable
  };

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <IntroSection />

        {/* ℹ️ Info banner about how recognition works */}
        <div className="mt-4 mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <p className="font-medium">Important:</p>
          <p className="mt-1">
            Video face identification only works for people whose faces are
            already registered in the <span className="font-semibold">Known Faces</span> table below.
            Please add/register faces first, then run video analysis.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Video Selector */}
          <VideoSelector
            selectedVideo={selectedVideo}
            onVideoSelect={handleVideoSelect}
          />

          {/* Video Player */}
          <VideoPlayer
            selectedVideo={selectedVideo}
            onTimeUpdate={handleTimeUpdate}
            timestamps={timestamps}
          />
        </div>

        {/* Analysis Button with recognition timer */}
        <AnalysisButton
          selectedVideo={selectedVideo}
          currentTime={currentTime}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          recognitionElapsed={recognitionElapsed}
        />

        {/* Results Table */}
        <div ref={resultsRef}>
          <ResultsTable results={results} isVisible={showResults} />
        </div>

        {/* Scroll Hint Arrow */}
        <ScrollHintArrow
          showHint={showScrollHint}
          onHintDismiss={handleHintDismiss}
        />

        {/* 👇 Manage Faces: Add + Table (reusing AddFaceForm) */}
        <div className="mt-10 space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Manage Known Faces
            </h2>
            <p className="text-xs text-gray-500">
              Faces added here are used for identification during video analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Add face form */}
            <div className="bg-white rounded-xl shadow p-4">
              <AddFaceForm
                onSuccess={handleFaceAddedSuccess}
                showResultInline={true}
                compact={false}
              />
            </div>

            {/* Faces table with refresh support */}
            <UsersTable refreshToken={usersRefreshToken} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
