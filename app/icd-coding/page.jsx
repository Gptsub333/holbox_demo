"use client";
import { motion } from "framer-motion";
import { FeatureIcon } from "@/components/feature-icons";
import { Upload, BookOpen } from "lucide-react";
import DocumentSamples from "./_components/DocumentSamples";
import { useState } from "react";
import TranscriptDisplay from "./_components/TranscriptDisplay";
import UploadModal from "./_components/UploadModal"; // ✅ Import modal

// Predefined document files (update later for docs)
const predefinedDocuments = [
  {
    id: "1",
    title: "Sample 1: Routing Office Visit",
    url: "https://s3.us-east-1.amazonaws.com/demo.holbox.ai/health_scribe/predefinedAudios/predefinedAudios1.mp3",
    s3: "s3://dax-healthscribe-v2/predefinedAudios/predefinedAudios1.mp3",
    duration: "10:26",
    transcript:
      "This is a sample transcript for the first audio recording. The actual transcript will be generated when you click 'Transcribe Audio.",
  },
  {
    id: "2",
    title: "Sample 2: Specialist Consultation",
    url: "https://s3.us-east-1.amazonaws.com/demo.holbox.ai/health_scribe/predefinedAudios/predefinedAudios2.mp3",
    s3: "s3://dax-healthscribe-v2/predefinedAudios/predefinedAudios2.mp3",
    duration: "10:45",
    transcript:
      "This is a sample transcript for the second audio recording. The actual transcript will be generated when you click 'Transcribe Audio.",
  },
  {
    id: "3",
    title: "Sample 3: Emergency Room Visit",
    url: "https://s3.us-east-1.amazonaws.com/demo.holbox.ai/health_scribe/predefinedAudios/predefinedAudios3.mp3",
    s3: "s3://dax-healthscribe-v2/predefinedAudios/predefinedAudios3.mp3",
    duration: "10:46",
    transcript:
      "This is a sample transcript for the third audio recording. The actual transcript will be generated when you click 'Transcribe Audio.",
  },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function IcdCodingPage() {
  const [activeDocument, setActiveDocument] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [formattedTranscript, setFormattedTranscript] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  // Upload state
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const selectDocument = (doc) => {
    setActiveDocument(doc);
    // Trigger transcription/analysis here if needed
  };

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (!allowedTypes.includes(file.type)) {
      alert("❌ Only PDF, DOCX, and TXT files are allowed.");
      return false;
    }

    if (file.size > maxSize) {
      alert("❌ File size must be less than 20MB.");
      return false;
    }

    return true;
  };

  // Handlers for modal
  // const handleFileSelect = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    } else {
      e.target.value = ""; // reset input so user can retry
      setSelectedFile(null);
    }
  };

  // const handleUpload = () => {
  //   if (!selectedFile) return;
  //   setUploadStatus("uploading");
  //   let progress = 0;

  //   const interval = setInterval(() => {
  //     progress += 10;
  //     setUploadProgress(progress);
  //     if (progress >= 100) {
  //       clearInterval(interval);
  //       setUploadStatus("processing");

  //       setTimeout(() => {
  //         setUploadStatus("complete");

  //         // Add to uploaded docs
  //         setUploadedDocuments((prev) => [
  //           ...prev,
  //           {
  //             id: Date.now().toString(),
  //             title: selectedFile.name,
  //             url: URL.createObjectURL(selectedFile),
  //             transcript: "Processing complete. Transcript will appear here.",
  //           },
  //         ]);

  //         setSelectedFile(null);
  //       }, 1500);
  //     }
  //   }, 300);
  // };


  const handleUpload = async () => {
  if (!selectedFile) return;

  try {
    setUploadStatus("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    // optional: formData.append("insurance_provider", "Aetna");

    const response = await fetch(`${BACKEND_URL}/verify-medical-claim`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    // Track progress (fake here since fetch doesn’t expose it)
    setUploadProgress(100);

    const result = await response.json();

    setUploadStatus("complete");

    // ✅ Add uploaded doc to the list
    setUploadedDocuments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        transcript: result?.message || "Uploaded successfully.",
      },
    ]);

    setSelectedFile(null);
  } catch (error) {
    console.error("Upload error:", error);
    alert("❌ Failed to upload document. Please try again.");
    setUploadStatus("idle");
  }
};


  const handleCancel = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setSelectedFile(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   const file = e.dataTransfer.files?.[0];
  //   if (file) setSelectedFile(file);
  // };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  return (
    <motion.div
      className="container mx-auto py-8 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.8, staggerChildren: 0.2 }}
    >
      {/* Header */}
      <motion.div className="mb-8 flex items-center" variants={itemVariants}>
        <FeatureIcon
          icon={BookOpen}
          size="lg"
          gradient="blue"
          className="mr-4"
        />
        <div>
          <h1 className="text-3xl font-bold heading-font">ICD Coding</h1>
          <p className="text-muted-foreground mt-1">
            Automated medical coding for healthcare documentation
          </p>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="grid gap-8 lg:grid-cols-5 ">
        {/* Left: Samples */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <DocumentSamples
            documents={predefinedDocuments}
            selectDocument={selectDocument}
            activeDocumentId={activeDocument?.id}
          />

          {uploadedDocuments.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-2">Uploaded Documents</h2>
              <DocumentSamples
                documents={uploadedDocuments}
                selectDocument={selectDocument}
                activeDocumentId={activeDocument?.id}
              />
            </>
          )}
        </motion.div>

        <motion.div className="lg:col-span-3" variants={itemVariants}>
          <TranscriptDisplay
            activeDocument={activeDocument}
            formattedTranscript={formattedTranscript}
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
        >
          <Upload className="w-5 h-5" />
          <span className="text-xs font-medium">Upload Document</span>
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
        handleCancel={handleCancel}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
      />
    </motion.div>
  );
}
