"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Stethoscope, Upload, X, MessageSquare, Send, Clock, FileAudio, CheckCircle2, Loader2 } from "lucide-react"
import { FeatureIcon } from "@/components/feature-icons"

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
]

export default function HealthScribePage() {
  const [activeAudio, setActiveAudio] = useState(null)
  // const [isPlaying, setIsPlaying] = useState(false)
  // const [isMuted, setIsMuted] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("idle") // idle, uploading, processing, complete
  const [selectedFile, setSelectedFile] = useState(null)
  const [transcript, setTranscript] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribeProgress, setTranscribeProgress] = useState(0)
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  // const [audioError, setAudioError] = useState(false)
  // const [audioLoaded, setAudioLoaded] = useState(false)
  const [sampleAudios, setSampleAudios] = useState([])
  const [formattedTranscript, setFormattedTranscript] = useState({}); // formatted transcript
  const [displayedText, setDisplayedText] = useState("");
const [isGenerating, setIsGenerating] = useState(false); // To control the progressive text generation

 

  useEffect(() => {
    setSampleAudios(predefinedAudios);
  }, []);
  
 
  // This function formats the transcript into a more structured format
 const formatTranscript = (transcript) => {
  const removeUnderscores = (text) => text.replace(/_/g, " "); // Remove underscores

  return {
    chiefComplaint: {
      title: "Chief Complaint", // Title for the section, bolded
      content: transcript.match(/CHIEF_COMPLAINT:([\s\S]*?)(HISTORY_OF_PRESENT_ILLNESS:|$)/)
    },
    historyOfPresentIllness: {
      title: "History of Present Illness", // Title for the section, bolded
      content: transcript.match(/HISTORY_OF_PRESENT_ILLNESS:([\s\S]*?)(REVIEW_OF_SYSTEMS:|$)/)
    },
    reviewOfSystems: {
      title: "Review of Systems", // Title for the section, bolded
      content: transcript.match(/REVIEW_OF_SYSTEMS:([\s\S]*?)(PAST_MEDICAL_HISTORY:|$)/)
    },
    pastMedicalHistory: {
      title: "Past Medical History", // Title for the section, bolded
      content: transcript.match(/PAST_MEDICAL_HISTORY:([\s\S]*?)(ASSESSMENT:|$)/)
    },
    // You can continue to add more sections as necessary, following the same pattern
  };
};


  // Scroll to the bottom whenever the transcript is updated
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [formattedTranscript]); // Scroll when formatted transcript changes
  
  const transcriptRef = useRef(null);
  const audioRef = useRef(null)
  const fileInputRef = useRef(null)
  const chatContainerRef = useRef(null)
  // const audioRefs = useRef({})

  // // Handle audio play/pause
  // const togglePlay = () => {
  //   if (!audioRef.current || !activeAudio) return

  //   if (isPlaying) {
  //     audioRef.current.pause()
  //     setIsPlaying(false)
  //   } else {
  //     audioRef.current
  //       .play()
  //       .then(() => {
  //         setIsPlaying(true)
  //       })
  //       .catch((error) => {
  //         console.error("Audio playback error:", error)
  //         setAudioError(true)
  //         setIsPlaying(false)
  //       })
  //   }
  // }

  // Handle audio mute/unmute
  // const toggleMute = () => {
  //   if (audioRef.current) {
  //     audioRef.current.muted = !isMuted
  //     setIsMuted(!isMuted)
  //   }
  // }

  // Handle audio selection
  // const selectAudio = (audio) => {
  //   // if (isPlaying && audioRef.current) {
  //   //   audioRef.current.pause()
  //   //   setIsPlaying(false)
  //   // }

  //   setActiveAudio(audio)
  //   setTranscript(audio.transcript || "")
  //   setAudioError(false)
  //   setAudioLoaded(false)
  //   setChatMessages([])

  //   // Reset any previous audio source errors
  //   if (audioRef.current) {
  //     try {
  //       // For demo purposes, we'll just set the source without actually loading
  //       // This prevents CORS and other loading issues in the demo
  //       audioRef.current.src = ""
  //       console.log("Audio source cleared for demo purposes")
  //     } catch (error) {
  //       console.error("Error clearing audio source:", error)
  //     }
  //   }
  // }
  const selectAudio = (audio) => {
    setActiveAudio(audio);
    setTranscript(""); // Clear transcript initially
    setChatMessages([]);
  };
  
  
  useEffect(() => {
    // When the transcript is available, format it.
    if (transcript) {
      const formattedData = formatTranscript(transcript);
      setFormattedTranscript(formattedData);
    }
  }, [transcript]);

  // Set up audio source after selection
  useEffect(() => {
    if (activeAudio && audioRef.current) {
      try {
        // For demo purposes, we'll avoid actually loading the audio
        // This prevents CORS and other loading issues
        // In a real implementation, you would uncomment the line below
        // audioRef.current.src = activeAudio.url;

        // Instead, we'll just simulate a successful audio load
        // setTimeout(() => {
        //   setAudioLoaded(true)
        //   setAudioError(false)
        // }, 500)

        console.log("Audio source would be set to:", activeAudio.url)
      } catch (error) {
        console.error("Error setting audio source:", error)
        setAudioError(true)
      }
    }
  }, [activeAudio])

  // Handle file upload click
  const handleUploadClick = () => {
    setUploadModalOpen(true)
  }

  // Handle chat button click
  const handleChatClick = () => {
    if (transcript) {
      setChatModalOpen(true)
    }
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Handle file upload
// Handle file upload and transcription
const handleUpload = async () => {
  if (!selectedFile) return;

  // Update UI to reflect upload status
  setUploadStatus("uploading");
  setUploadProgress(0);

  try {
    // Create form data for the file upload
    const formData = new FormData();
    formData.append("file", selectedFile);

    // First, upload the file to the server
    const uploadResponse = await fetch("https://demo.holbox.ai/api/healthbox/transcription/upload-audio", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("File upload failed");
    }

    const uploadData = await uploadResponse.json();
    console.log("File uploaded successfully:", uploadData);

    // Extract the URL of the uploaded file
    const fileUrl = uploadData.fileUrl;

    // Move to processing state
    setUploadStatus("processing");

    // Call the transcription API to start transcription
    const transcriptionResponse = await fetch("https://demo.holbox.ai/api/healthbox/transcription/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioUrl: fileUrl }),
    });

    if (!transcriptionResponse.ok) {
      throw new Error("Transcription failed");
    }

    const transcriptionData = await transcriptionResponse.json();
    console.log("Transcription complete:", transcriptionData);

    // Update UI to show that the upload and transcription are complete
    setUploadStatus("complete");

    // Create a new audio entry
    const newAudio = {
      id: Date.now().toString(),
      title: selectedFile.name,
      duration: transcriptionData.duration || "00:00",
      transcript: transcriptionData.transcript || "",
      url: fileUrl,
    };

    // Set the newly uploaded and transcribed audio as the active audio
    setActiveAudio(newAudio);
    setTranscript(newAudio.transcript);

    // Close the upload modal after a brief delay
    setTimeout(() => {
      setUploadModalOpen(false);
      setUploadProgress(0);
      setUploadStatus("idle");
      setSelectedFile(null);
    }, 1000);

    // Add the new audio to the list of sample audios
    setSampleAudios((prev) => [newAudio, ...prev]);
  } catch (error) {
    console.error("Upload failed", error);
    setUploadStatus("idle");
    setUploadProgress(0);
    alert("Upload failed: " + error.message);
  }
};


  // Handle transcription
  const handleTranscribe = async () => {
    if (!activeAudio) return;
  
    setIsTranscribing(true);
    setTranscribeProgress(0);
  
    try {
      const response = await fetch("https://demo.holbox.ai/api/healthbox/transcription/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioUrl: activeAudio.s3 }),
      });
  
      if (!response.ok) {
        throw new Error("Transcription failed");
      }
  
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
  
      result += decoder.decode(); // decode any remaining bytes
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
  

// Utility function to format the response
// Format function for the response text
const formatResponseText = (text) => {
  return text.split('\n').map((line, index) => (
    <p key={index}>{line}</p> // Wrap each line in a paragraph tag
  ));
};

const handleChatSubmit = async (e) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }

  if (!currentQuestion.trim() || !transcript) return;

  // Add user question to chat
  setChatMessages((prev) => [...prev, { sender: "user", text: currentQuestion }]);
  setCurrentQuestion("");
  setIsLoadingAnswer(true);

  try {
    const response = await fetch("https://demo.holbox.ai/api/healthbox/qa/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: currentQuestion,
        transcript: transcript,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get answer");
    }

    const data = await response.json();

    // Show the AI response progressively
    const fullText = data.answer;

    setIsGenerating(true);
    let index = 0;
    setDisplayedText("");

    // Reveal text progressively
    const intervalId = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(intervalId);
        setIsGenerating(false);
      }
    }, 50); // Adjust speed (50ms for each character)

    // Add AI response to chat with progressive text
    setChatMessages((prev) => [
      ...prev,
      { sender: "ai", text: fullText }, // You can also store the full answer here
    ]);
  } catch (error) {
    console.error("Chat error:", error);
    setChatMessages((prev) => [
      ...prev,
      { sender: "ai", text: "Sorry, I couldn't process your question. Please try again." },
    ]);
  } finally {
    setIsLoadingAnswer(false);
  }
};

// Scroll to the bottom whenever a new message is added
useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
}, [chatMessages]);





  // Page animations
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
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  // Initialize with predefined audio files
  useEffect(() => {
    // DEMO MODE: Use predefined audio files
    setSampleAudios(predefinedAudios)

    // Initialize with predefined audio files

  }, []); // Close the outer useEffect properly

  return (
    <motion.div
      className="container mx-auto py-8 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.8,
        staggerChildren: 0.3,
      }}
    >
      <motion.div className="mb-8 flex items-center" variants={itemVariants}>
        <FeatureIcon icon={Stethoscope} size="lg" gradient="blue" className="mr-4" />
        <div>
          <h1 className="text-3xl font-bold heading-font">Health Scribe</h1>
          <p className="text-muted-foreground mt-1">
            Transform medical audio into accurate transcriptions with AI-powered insights
          </p>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left sidebar - Audio samples */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <div className="rounded-xl border bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold heading-font">Sample Recordings</h2>
            <div className="space-y-4">
              {sampleAudios.map((audio) => (
                <div
                  key={audio.id}
                  className={`rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    activeAudio?.id === audio.id
                      ? "bg-blue-50 border-2 border-blue-200"
                      : "bg-gray-50 border border-gray-100 hover:bg-blue-50"
                  }`}
                  onClick={() => selectAudio(audio)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FileAudio className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{audio.title}</h3>
                        <p className="text-xs text-muted-foreground">{audio.duration}</p>
                      </div>
                    </div>
                    {activeAudio?.id === audio.id && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right content area - Player and transcript */}
        <motion.div className="lg:col-span-3" variants={itemVariants}>
          {activeAudio ? (
           <>      
  {/* Transcript */}
<div className="rounded-xl border bg-white p-8 shadow-md mb-6">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-xl font-semibold heading-font">Transcript</h2>
      {activeAudio && (
        <p className="text-sm text-muted-foreground mt-1">
          {activeAudio.title} • {activeAudio.duration}
        </p>
      )}
    </div>

    {/* Transcription Button */}
    {transcript ? (
      <button
        onClick={handleChatClick}
        className="text-sm flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <MessageSquare className="w-4 h-4 mr-1.5" />
        Ask Questions
      </button>
    ) : (
      <button
        onClick={handleTranscribe}
        disabled={isTranscribing}
        className={`text-sm flex items-center ${
          isTranscribing
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 hover:text-blue-800 transition-colors"
        }`}
      >
        {isTranscribing ? (
          <>
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            Transcribing...
          </>
        ) : (
          <>
            <FileAudio className="w-4 h-4 mr-1" />
            Transcribe Audio
          </>
        )}
      </button>
    )}
  </div>

  {/* Transcription Process or Content */}
  {isTranscribing ? (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4"></div>
      <p className="text-sm font-medium mb-2">Transcribing audio...</p>
      <div className="w-full max-w-md bg-gray-200 rounded-full h-1.5 mb-1">
        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${transcribeProgress}%` }}></div>
      </div>
      <p className="text-xs text-muted-foreground">{transcribeProgress}% complete</p>
    </div>
  ) : transcript ? (
    <div className="bg-gray-50 rounded-lg p-6">
      {/* Scrollable Transcript Section */}
      <div className="max-h-[400px] overflow-y-auto mb-4">
        {/* Format the sections of the transcript */}
        {formattedTranscript?.chiefComplaint && (
          <div className="transcript-section">
            <h3 className="font-bold">{formattedTranscript.chiefComplaint.title}</h3>
            <div className="pl-5">
              {formattedTranscript.chiefComplaint.content[1]
                ? formattedTranscript.chiefComplaint.content[1]
                    .split("\n")
                    .map((line, index) => (
                      <div key={index}>
                        {line.startsWith("-") ? (
                          <ul>
                            <li className="text-base para-font leading-relaxed">{line.slice(1).trim()}</li>
                          </ul>
                        ) : (
                          <p className="text-base para-font leading-relaxed">{line}</p>
                        )}
                      </div>
                    ))
                : null}
            </div>
          </div>
        )}

        {formattedTranscript?.historyOfPresentIllness && (
          <div className="transcript-section">
            <h3 className="font-bold">{formattedTranscript.historyOfPresentIllness.title}</h3>
            <div className="pl-5">
              {formattedTranscript.historyOfPresentIllness.content[1]
                ? formattedTranscript.historyOfPresentIllness.content[1]
                    .split("\n")
                    .map((line, index) => (
                      <div key={index}>
                        {line.startsWith("-") ? (
                          <ul>
                            <li className="text-base para-font leading-relaxed">{line.slice(1).trim()}</li>
                          </ul>
                        ) : (
                          <p className="text-base para-font leading-relaxed">{line}</p>
                        )}
                      </div>
                    ))
                : null}
            </div>
          </div>
        )}

        {formattedTranscript?.reviewOfSystems && (
          <div className="transcript-section">
            <h3 className="font-bold">{formattedTranscript.reviewOfSystems.title}</h3>
            <div className="pl-5">
              {formattedTranscript.reviewOfSystems.content[1]
                ? formattedTranscript.reviewOfSystems.content[1]
                    .split("\n")
                    .map((line, index) => (
                      <div key={index}>
                        {line.startsWith("-") ? (
                          <ul>
                            <li className="text-base para-font leading-relaxed">{line.slice(1).trim()}</li>
                          </ul>
                        ) : (
                          <p className="text-base para-font leading-relaxed">{line}</p>
                        )}
                      </div>
                    ))
                : null}
            </div>
          </div>
        )}

        {formattedTranscript?.pastMedicalHistory && (
          <div className="transcript-section">
            <h3 className="font-bold">{formattedTranscript.pastMedicalHistory.title}</h3>
            <div className="pl-5">
              {formattedTranscript.pastMedicalHistory.content[1]
                ? formattedTranscript.pastMedicalHistory.content[1]
                    .split("\n")
                    .map((line, index) => (
                      <div key={index}>
                        {line.startsWith("-") ? (
                          <ul>
                            <li className="text-base para-font leading-relaxed">{line.slice(1).trim()}</li>
                          </ul>
                        ) : (
                          <p className="text-base para-font leading-relaxed">{line}</p>
                        )}
                      </div>
                    ))
                : null}
            </div>
          </div>
        )}
      </div>

      {/* Ask Questions Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleChatClick}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 transition-colors flex items-center"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Ask Questions About This Transcript
        </button>
      </div>
    </div>
  ) : (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
      <FileAudio className="w-10 h-10 text-blue-500 mb-3 opacity-70" />
      <p className="text-sm font-medium mb-1">No transcript available</p>
      <p className="text-xs text-muted-foreground mb-4">
        Click the button below to extract a transcript from this recording
      </p>
      <button
        onClick={handleTranscribe}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 transition-colors"
      >
        Extract Transcript
      </button>
    </div>
                )}
                {/* {activeAudio && audioError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    <p className="font-medium">Audio could not be loaded</p>
                    <p className="text-xs mt-1">
                      This is a demo application. In a real implementation, audio would be loaded from the server.
                    </p>
                  </div>
                )} */}
                {/* Hidden audio element for functionality */}
                {/* <audio
                  ref={audioRef}
                  className="hidden"
                  preload="metadata"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    // Log the detailed error information
                    console.error("Audio loading error:", e.target.error ? e.target.error.message : "Unknown error")
                    setAudioError(true)
                    setIsPlaying(false)
                  }}
                  onCanPlay={() => {
                    setAudioLoaded(true)
                    setAudioError(false)
                  }}
                  onEnded={() => {
                    setIsPlaying(false)
                  }}
                /> */}
              </div>
            </>
          ) : (
            <div className="rounded-xl border bg-white p-8 shadow-md flex flex-col items-center justify-center text-center h-80">
              <Clock className="w-12 h-12 text-blue-500 mb-4 opacity-70" />
              <h2 className="text-xl font-semibold heading-font mb-2">No Recording Selected</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Select a recording from the list or upload your own audio file to see the transcript and interact with
                it.
              </p>
              <button
                onClick={handleUploadClick}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Audio
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4">
        <motion.button
          onClick={handleUploadClick}
          className="rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Upload modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold heading-font">Upload Audio</h2>
                <button
                  onClick={() => {
                    if (uploadStatus !== "uploading" && uploadStatus !== "processing") {
                      setUploadModalOpen(false)
                      setUploadProgress(0)
                      setUploadStatus("idle")
                      setSelectedFile(null)
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={uploadStatus === "uploading" || uploadStatus === "processing"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {uploadStatus === "idle" && (
                  <>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                      <p className="mb-2 text-sm font-medium">Drag and drop your audio file here</p>
                      <p className="text-xs text-muted-foreground mb-4">MP3, WAV, or M4A (MAX. 20MB)</p>
                      <button className="rounded-lg bg-blue-100 px-4 py-2 text-blue-700 text-sm font-medium hover:bg-blue-200 transition-colors">
                        Browse Files
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </div>

                    {selectedFile && (
                      <div className="bg-gray-50 rounded-lg p-4 flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <FileAudio className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-gray-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile}
                      className={`w-full rounded-lg px-4 py-3 text-white font-medium ${
                        selectedFile ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                      } transition-colors`}
                    >
                      Upload and Transcribe
                    </button>
                  </>
                )}

                {(uploadStatus === "uploading" || uploadStatus === "processing") && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mx-auto mb-6"></div>
                    <h3 className="text-lg font-medium mb-2">
                      {uploadStatus === "uploading" ? "Uploading..." : "Processing..."}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {uploadStatus === "uploading" ? "Your file is being uploaded" : "Converting audio to text"}
                    </p>

                    {uploadStatus === "uploading" && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {uploadStatus === "uploading" ? `${uploadProgress}% complete` : "This may take a minute"}
                    </p>
                  </div>
                )}

                {uploadStatus === "complete" && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Processing Complete!</h3>
                    <p className="text-sm text-muted-foreground">Your audio has been successfully transcribed</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

{/* Q&A Modal (Centered) */}
<AnimatePresence>
  {chatModalOpen && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
        }}
      >
        <motion.div
          className="flex items-center justify-between p-6 border-b"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold heading-font">Ask Questions</h2>
          <button onClick={() => setChatModalOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        <div ref={chatContainerRef} className="h-80 overflow-y-auto p-6">
          {chatMessages.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MessageSquare className="w-10 h-10 mb-4 text-blue-500 opacity-70" />
              <p className="text-sm font-medium mb-1">Ask Questions About This Transcript</p>
              <p className="text-xs text-muted-foreground mb-6">
                Get insights and information from the transcribed content
              </p>
              <div className="grid grid-cols-1 gap-3 w-full">
                <motion.button
                  className="text-left text-sm bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                  onClick={() => {
                    setCurrentQuestion("What are the key points in this transcript?");
                    handleChatSubmit({ preventDefault: () => {} });
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: "#dbeafe" }}
                  whileTap={{ scale: 0.98 }}
                >
                  What are the key points in this transcript?
                </motion.button>
                <motion.button
                  className="text-left text-sm bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                  onClick={() => {
                    setCurrentQuestion("Can you summarize this transcript?");
                    handleChatSubmit({ preventDefault: () => {} });
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: "#dbeafe" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Can you summarize this transcript?
                </motion.button>
                <motion.button
                  className="text-left text-sm bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                  onClick={() => {
                    setCurrentQuestion("What medical terms are mentioned?");
                    handleChatSubmit({ preventDefault: () => {} });
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: "#dbeafe" }}
                  whileTap={{ scale: 0.98 }}
                >
                  What medical terms are mentioned?
                </motion.button>
              </div>
            </motion.div>
          ) : (
         // Main JSX rendering part
<div className="space-y-4">
  {chatMessages.map((message, index) => (
    <motion.div
      key={index}
      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="space-y-4">
  {chatMessages.map((message, index) => (
    <motion.div
      key={index}
      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <motion.div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-50 border border-gray-200"
        }`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className="text-sm">
          {/* Display the AI response using formatResponseText but no line-by-line animation */}
          {message.sender === "ai" ? (
            formatResponseText(message.text) // format the entire message at once
          ) : (
            message.text
          )}
        </div>
      </motion.div>
    </motion.div>
  ))}
</div>

    </motion.div>
  ))}

  {isLoadingAnswer && (
    <motion.div
      className="flex justify-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center max-w-[80%]">
        <div className="flex items-center space-x-1 mr-2">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
          <div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
        <span className="text-sm text-gray-500">Thinking...</span>
      </div>
    </motion.div>
  )}
</div>

          )}
        </div>

        <form onSubmit={handleChatSubmit} className="p-6 border-t bg-white rounded-b-xl">
          <div className="flex items-center space-x-2">
            <motion.input
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Ask a question about the transcript..."
              className="flex-1 rounded-full border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.button
              type="submit"
              disabled={isLoadingAnswer || !currentQuestion.trim()}
              className={`rounded-full p-3 text-white ${
                isLoadingAnswer || !currentQuestion.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </motion.div>
  );
}
  
