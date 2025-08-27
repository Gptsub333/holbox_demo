"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Upload } from "lucide-react";
import { FeatureIcon } from "@/components/feature-icons";

import AudioSamples from "./_components/AudioSamples";
import TranscriptDisplay from "./_components/TranscriptDisplay";
import ChatModal from "./_components/ChatModal";
import UploadModal from "./_components/UploadModal";
import { useAuthContext } from "../../context/AuthContext"; // Import the context

// Predefined audio files from S3 bucket
const predefinedAudios = [
  {
    id: "1",
    title: "Sample data 1.mp3",
    url: "https://s3.us-east-1.amazonaws.com/demo.holbox.ai/health_scribe/predefinedAudios/predefinedAudios1.mp3",
    s3: "s3://dax-healthscribe-v2/predefinedAudios/predefinedAudios1.mp3",
    duration: "10:26",
    transcript:
      "This is a sample transcript for the first audio recording. The actual transcript will be generated when you click 'Transcribe Audio.",
  },
  {
    id: "2",
    title: "Sample data 2.mp3",
    url: "https://s3.us-east-1.amazonaws.com/demo.holbox.ai/health_scribe/predefinedAudios/predefinedAudios2.mp3",
    s3: "s3://dax-healthscribe-v2/predefinedAudios/predefinedAudios2.mp3",
    duration: "10:45",
    transcript:
      "This is a sample transcript for the second audio recording. The actual transcript will be generated when you click 'Transcribe Audio.",
  },
  {
    id: "3",
    title: "Sample data 3.mp3",
    url: "https://s3.us-east-1.amazonaws.com/demo.holbox.ai/health_scribe/predefinedAudios/predefinedAudios3.mp3",
    s3: "s3://dax-healthscribe-v2/predefinedAudios/predefinedAudios3.mp3",
    duration: "10:46",
    transcript:
      "This is a sample transcript for the third audio recording. The actual transcript will be generated when you click 'Transcribe Audio.",
  },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
  const [sampleAudios, setSampleAudios] = useState(predefinedAudios);
  const [formattedTranscript, setFormattedTranscript] = useState({});
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioProgress, setAudioProgress] = useState({}); // { audioId: secondsPlayed }
  const [uploadedAudios, setUploadedAudios] = useState([]);
  const [displayedText, setDisplayedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Get session token from context
  const { sessionToken, isLoaded, isSignedIn } = useAuthContext();
  const token = "Bearer " + sessionToken;

  // === Refs ===
  const transcriptRef = useRef(null);
  const audioRef = useRef(new Audio());
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // === Effects ===

  // Track progress and reset on ended

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  // Listen for audio time updates and ended event
  useEffect(() => {
    const audioEl = audioRef.current;

    const updateProgress = () => {
      setAudioProgress((prev) => ({
        ...prev,
        [playingAudioId]: audioEl.currentTime,
      }));
    };

    const handleEnded = () => {
      setPlayingAudioId(null);
      setAudioProgress((prev) => ({
        ...prev,
        [playingAudioId]: 0,
      }));
    };

    if (playingAudioId) {
      audioEl.addEventListener("timeupdate", updateProgress);
      audioEl.addEventListener("ended", handleEnded);
    }

    return () => {
      audioEl.removeEventListener("timeupdate", updateProgress);
      audioEl.removeEventListener("ended", handleEnded);
    };
  }, [playingAudioId]);

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
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // === Handlers ===

  // Play or pause audio, ensure only one plays at a time
  const onPlayPauseClick = (audio) => {
    if (playingAudioId === audio.id) {
      // Pause if clicking on the currently playing audio
      audioRef.current.pause();
      setPlayingAudioId(null);
    } else {
      // Play new audio
      audioRef.current.pause(); // Pause previous if any
      audioRef.current.src = audio.url;
      audioRef.current.play();
      setActiveAudio(audio);
      setPlayingAudioId(audio.id);
    }
  };

  // Play/Pause toggle handler for audios
  const togglePlay = async (audio) => {
    const audioEl = audioRef.current;

    try {
      if (playingAudioId === audio.id) {
        audioEl.pause();
        setPlayingAudioId(null);
      } else {
        audioEl.src = audio.url;
        await audioEl.play(); // wait for play() promise to resolve
        setPlayingAudioId(audio.id);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Audio play error:", error);
      }
      // Ignore AbortError since it's expected during rapid source changes
    }
  };

  function formatTranscript(transcript) {
    return {
      chiefComplaint: {
        title: "Chief Complaint",
        content: transcript.match(
          /CHIEF_COMPLAINT:([\s\S]*?)(HISTORY_OF_PRESENT_ILLNESS:|$)/
        ),
      },
      historyOfPresentIllness: {
        title: "History of Present Illness",
        content: transcript.match(
          /HISTORY_OF_PRESENT_ILLNESS:([\s\S]*?)(REVIEW_OF_SYSTEMS:|$)/
        ),
      },
      reviewOfSystems: {
        title: "Review of Systems",
        content: transcript.match(
          /REVIEW_OF_SYSTEMS:([\s\S]*?)(PAST_MEDICAL_HISTORY:|$)/
        ),
      },
      pastMedicalHistory: {
        title: "Past Medical History",
        content: transcript.match(
          /PAST_MEDICAL_HISTORY:([\s\S]*?)(ASSESSMENT:|$)/
        ),
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
      // 1. Upload the file, get S3 URL
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch(
        `${BACKEND_URL}/healthscribe/upload-audio`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: token, // Include Bearer token for authentication
          },
        }
      );

      if (!uploadResponse.ok) throw new Error("File upload failed");

      const uploadData = await uploadResponse.json();
      console.log("Upload response data:", uploadData);

      const fileUrl = uploadData.fileUrl; // S3 URL of uploaded audio

      setUploadStatus("processing");

      // 2. Start transcription with S3 URL
      const transcriptionResponse = await fetch(
        `${BACKEND_URL}/healthscribe/start-transcription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({ audioUrl: fileUrl }),
        }
      );

      if (!transcriptionResponse.ok) throw new Error("Transcription failed");

      const transcriptionData = await transcriptionResponse.json();
      console.log("Transcription response data:", transcriptionData);

      // 3. Create local URL for audio playback from user file
      const localAudioUrl = URL.createObjectURL(selectedFile);

      // 4. Build new audio object with local playback URL + transcription summary
      const newAudio = {
        id: Date.now().toString(),
        title: selectedFile.name,
        duration: transcriptionData.duration || "00:00", // fallback if available
        transcript: transcriptionData.summary || "",
        url: localAudioUrl,
        s3: fileUrl,
      };

      // 5. Update UI state
      setActiveAudio(newAudio);
      setTranscript(newAudio.transcript);
      setUploadedAudios((prev) => [newAudio, ...prev]);

      // Reset modal and states after short delay for UX
      setTimeout(() => {
        setUploadModalOpen(false);
        setUploadProgress(0);
        setUploadStatus("idle");
        setSelectedFile(null);
      }, 1000);
    } catch (error) {
      console.error("Upload or transcription failed", error);
      setUploadStatus("idle");
      setUploadProgress(0);
      alert("Upload or transcription failed: " + error.message);
    }
  };

  const handleTranscribe = async () => {
    if (!activeAudio) return;

    setIsTranscribing(true);
    setTranscribeProgress(0);

    try {
      const response = await fetch(
        `${BACKEND_URL}/healthscribe/start-transcription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({ audioUrl: activeAudio.s3 }),
        }
      );

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

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: currentQuestion },
    ]);
    setCurrentQuestion("");
    setIsLoadingAnswer(true);

    try {
      const response = await fetch(`${BACKEND_URL}/healthscribe/question-ans`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ question: currentQuestion, transcript }),
      });

      if (!response.ok) throw new Error("Failed to get answer");

      const data = await response.json();

      setChatMessages((prev) => [...prev, { sender: "ai", text: data.answer }]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong." },
      ]);
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
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
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
      transition={{ duration: 0.8, staggerChildren: 0.2 }}
    >
      {/* Header - keep here */}
      <motion.div className="mb-8 flex items-center" variants={itemVariants}>
        <FeatureIcon
          icon={Stethoscope}
          size="lg"
          gradient="blue"
          className="mr-4"
        />
        <div>
          <h1 className="text-3xl font-bold heading-font">Health Scribe</h1>
          <p className="text-muted-foreground mt-1">
            Transform medical audio into accurate transcriptions with AI-powered
            insights
          </p>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="grid gap-8 lg:grid-cols-5 ">
        {/* Left: Audio Samples */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <AudioSamples
            sampleAudios={sampleAudios}
            playingAudioId={playingAudioId}
            togglePlay={togglePlay}
            audioProgress={audioProgress}
            selectAudio={selectAudio}
          />
          {uploadedAudios.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-8 mb-4">
                Uploaded Audios
              </h2>
              <AudioSamples
                sampleAudios={uploadedAudios}
                playingAudioId={playingAudioId}
                togglePlay={togglePlay}
                audioProgress={audioProgress}
                selectAudio={selectAudio}
              />
            </>
          )}
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
            handleUploadClick={handleUploadClick}
          />
        </motion.div>
      </div>

      {/* Floating Upload Button */}
      <div className="fixed top-[calc(5rem)] right-10 flex flex-col items-end space-y-4">
        <motion.button
          onClick={handleUploadClick}
    className="flex items-center space-x-1 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors relative left-[-6px] sm:left-[-28px] p-[7px_17px] top-[-50px] sm:top-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Upload Audio"
          // style={{
          //   transform: "none",
          //   position: "relative",
          //   left: "-28px", // Move button 28px to the left
          //   padding: "7px 17px", // Adjust padding
          // }}
        >
          <Upload className="w-5 h-5" /> {/* Smaller icon */}
          <span className="text-xs font-medium">Upload Audio</span>{" "}
          {/* Smaller text */}
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
