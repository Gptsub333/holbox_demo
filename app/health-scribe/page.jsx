"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Upload } from "lucide-react";
import { FeatureIcon } from "@/components/feature-icons";

import AudioSamples from "./_components/AudioSamples";
import TranscriptDisplay from "./_components/TranscriptDisplay";
import ChatModal from "./_components/ChatModal";
import UploadModal from "./_components/UploadModal";

// Predefined audio files from S3 bucket
const predefinedAudios = [
  {
    id: "1",
    title: "Sample_data1.mp3",
    url: "https://dax-health-transcribe.s3.amazonaws.com/predefined/Sample_data1.mp3",
    s3: "s3://dax-health-transcribe/predefined/Sample_data1.mp3",
    duration: "10:26",
    transcript:
      "This is a sample transcript for the first audio recording. The actual transcript will be generated when you click 'Transcribe Audio'.",
  },
  {
    id: "2",
    title: "Sample_data2.mp3",
    url: "https://dax-health-transcribe.s3.amazonaws.com/predefined/Sample_data2.mp3",
    s3: "s3://dax-health-transcribe/predefined/Sample_data2.mp3",
    duration: "10:45",
    transcript:
      "This is a sample transcript for the second audio recording. The actual transcript will be generated when you click 'Transcribe Audio'.",
  },
  {
    id: "3",
    title: "Sample_data3.mp3",
    url: "https://dax-health-transcribe.s3.amazonaws.com/predefined/Sample_data3.mp3",
    s3: "s3://dax-health-transcribe/predefined/Sample_data3.mp3",
    duration: "10:46",
    transcript:
      "This is a sample transcript for the third audio recording. The actual transcript will be generated when you click 'Transcribe Audio'.",
  },
];

export default function HealthScribePage() {
  // === States ===
  const [activeAudio, setActiveAudio] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeProgress, setTranscribeProgress] = useState(0);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [sampleAudios, setSampleAudios] = useState([]);
  const [formattedTranscript, setFormattedTranscript] = useState({});
  const [displayedText, setDisplayedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // === Refs ===
  const transcriptRef = useRef(null);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // === Effects ===
  useEffect(() => {
    setSampleAudios(predefinedAudios);
  }, []);

  useEffect(() => {
    if (transcript) {
      const formatted = formatTranscript(transcript);
      setFormattedTranscript(formatted);
    }
  }, [transcript]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [formattedTranscript]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // === Handlers ===

  function formatTranscript(transcript) {
    return {
      chiefComplaint: {
        title: "Chief Complaint",
        content: transcript.match(/CHIEF_COMPLAINT:([\s\S]*?)(HISTORY_OF_PRESENT_ILLNESS:|$)/),
      },
      historyOfPresentIllness: {
        title: "History of Present Illness",
        content: transcript.match(/HISTORY_OF_PRESENT_ILLNESS:([\s\S]*?)(REVIEW_OF_SYSTEMS:|$)/),
      },
      reviewOfSystems: {
        title: "Review of Systems",
        content: transcript.match(/REVIEW_OF_SYSTEMS:([\s\S]*?)(PAST_MEDICAL_HISTORY:|$)/),
      },
      pastMedicalHistory: {
        title: "Past Medical History",
        content: transcript.match(/PAST_MEDICAL_HISTORY:([\s\S]*?)(ASSESSMENT:|$)/),
      },
    };
  }

  const selectAudio = (audio) => {
    setActiveAudio(audio);
    setTranscript("");
    setChatMessages([]);
  };

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  // const handleChatClick = () => {
  //   if (transcript) setChatModalOpen(true);
  // };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("https://demo.holbox.ai/api/healthbox/transcription/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("File upload failed");

      const uploadData = await uploadResponse.json();

      const fileUrl = uploadData.fileUrl;

      setUploadStatus("processing");

      const transcriptionResponse = await fetch("https://demo.holbox.ai/api/healthbox/transcription/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl: fileUrl }),
      });

      if (!transcriptionResponse.ok) throw new Error("Transcription failed");

      const transcriptionData = await transcriptionResponse.json();

      setUploadStatus("complete");

      const newAudio = {
        id: Date.now().toString(),
        title: selectedFile.name,
        duration: transcriptionData.duration || "00:00",
        transcript: transcriptionData.transcript || "",
        url: fileUrl,
      };

      setActiveAudio(newAudio);
      setTranscript(newAudio.transcript);

      setTimeout(() => {
        setUploadModalOpen(false);
        setUploadProgress(0);
        setUploadStatus("idle");
        setSelectedFile(null);
      }, 1000);

      setSampleAudios((prev) => [newAudio, ...prev]);
    } catch (error) {
      console.error("Upload failed", error);
      setUploadStatus("idle");
      setUploadProgress(0);
      alert("Upload failed: " + error.message);
    }
  };

  const handleTranscribe = async () => {
    if (!activeAudio) return;

    setIsTranscribing(true);
    setTranscribeProgress(0);

    try {
      const response = await fetch("https://demo.holbox.ai/api/healthbox/transcription/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl: activeAudio.s3 }),
      });

      if (!response.ok) throw new Error("Transcription failed");

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        result += decoder.decode(value, { stream: true });
        receivedLength += value.length;

        if (total) {
          const percentage = Math.round((receivedLength / total) * 100);
          setTranscribeProgress(percentage);
        }
      }

      result += decoder.decode();
      const json = JSON.parse(result);

      setTranscript(json.summary || "Transcription completed successfully.");
      setTranscribeProgress(100);
    } catch (error) {
      console.error("Transcription error:", error.message);
      setTranscript("Error during transcription. Please try again.");
    } finally {
      setIsTranscribing(false);
      setTranscribeProgress(0);
    }
  };

  const formatResponseText = (text) =>
    text.split("\n").map((line, index) => <p key={index}>{line}</p>);

   // handleChatSubmit: process the user question, call API, update chat messages
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: currentQuestion }]);
    setCurrentQuestion("");
    setIsLoadingAnswer(true);

    try {
      const response = await fetch("https://demo.holbox.ai/api/healthbox/qa/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion, transcript }),
      });

      if (!response.ok) throw new Error("Failed to get answer");

      const data = await response.json();

      setChatMessages((prev) => [...prev, { sender: "ai", text: data.answer }]);
    } catch (error) {
      setChatMessages((prev) => [...prev, { sender: "ai", text: "Sorry, something went wrong." }]);
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  // handleChatClick: open chat modal
  const handleChatClick = () => {
    setChatModalOpen(true);
  };

  // === Animation Variants ===
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // === JSX ===
  return (
    <motion.div
      className="container mx-auto py-8 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.8, staggerChildren: 0.3 }}
    >
      {/* Header - keep here */}
      <motion.div className="mb-8 flex items-center" variants={itemVariants}>
        <FeatureIcon icon={Stethoscope} size="lg" gradient="blue" className="mr-4" />
        <div>
          <h1 className="text-3xl font-bold heading-font">Health Scribe</h1>
          <p className="text-muted-foreground mt-1">
            Transform medical audio into accurate transcriptions with AI-powered insights
          </p>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: Audio Samples */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <AudioSamples
            sampleAudios={sampleAudios}
            activeAudio={activeAudio}
            selectAudio={selectAudio}
          />
        </motion.div>

        {/* Right: Transcript and controls */}
        <motion.div className="lg:col-span-3" variants={itemVariants}>
          <TranscriptDisplay
            activeAudio={activeAudio}
            transcript={transcript}
            isTranscribing={isTranscribing}
            transcribeProgress={transcribeProgress}
            formattedTranscript={formattedTranscript}
            handleTranscribe={handleTranscribe}
            handleChatClick={handleChatClick}
          />
        </motion.div>
      </div>

      {/* Floating Upload Button */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4">
        <motion.button
          onClick={handleUploadClick}
          className="rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Upload Audio"
        >
          <Upload className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Upload Modal */}
      <UploadModal
        uploadModalOpen={uploadModalOpen}
        setUploadModalOpen={setUploadModalOpen}
        uploadStatus={uploadStatus}
        setUploadStatus={setUploadStatus}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleFileSelect={handleFileSelect}
        handleUpload={handleUpload}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
      />

      {/* Chat Modal */}
 <ChatModal
  chatModalOpen={chatModalOpen}
  setChatModalOpen={setChatModalOpen}
  chatMessages={chatMessages}
  currentQuestion={currentQuestion}
  setCurrentQuestion={setCurrentQuestion}
  handleChatSubmit={handleChatSubmit}
  isLoadingAnswer={isLoadingAnswer}
  formatResponseText={formatResponseText}
/>

    </motion.div>
  );
}
