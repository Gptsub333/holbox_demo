"use client";
import { motion } from "framer-motion";
import { FeatureIcon } from "@/components/feature-icons";
import { Upload, BookOpen, FileText} from "lucide-react";
import DocumentSamples from "./_components/DocumentSamples";
import { useState } from "react";
import TranscriptDisplay from "./_components/TranscriptDisplay";
import UploadModal from "./_components/UploadModal";

const predefinedDocuments = [
  {
    id: "1",
    title: "Sample 1: Routing Office Visit",
    url: "/document-sample/sample1.pdf",
    transcript: {
      message: "Sample transcript for the first PDF.",
      result: {
        approval_prediction: {
          likelihood: "HIGH",
          confidence_score: 0.85,
          predicted_outcome: "APPROVED",
        },
        risk_factors: [
          {
            factor: "Incomplete details",
            severity: "MEDIUM",
            description: "Some patient details are missing.",
          },
        ],
        recommendations: ["Add full patient details", "Attach insurance policy info"],
      },
    },
  },
  {
    id: "2",
    title: "Sample 2: Specialist Consultation",
    url: "/document-sample/sample2.pdf",
    transcript: {
      message: "Sample transcript for the second PDF.",
      result: {
        approval_prediction: {
          likelihood: "MEDIUM",
          confidence_score: 0.7,
          predicted_outcome: "PENDING",
        },
        risk_factors: [
          {
            factor: "Missing insurance info",
            severity: "HIGH",
            description: "Insurance provider not included.",
          },
        ],
        recommendations: ["Include provider details", "Attach claim form"],
      },
    },
  },
   {
    id: "3",
    title: "Sample 3: Emergency Room Visit",
    url: "/document-sample/sample3.pdf",
    transcript: {
      message: "Sample transcript for the third PDF.",
      result: {
        approval_prediction: {
          likelihood: "MEDIUM",
          confidence_score: 0.7,
          predicted_outcome: "PENDING",
        },
        risk_factors: [
          {
            factor: "Missing insurance info",
            severity: "HIGH",
            description: "Insurance provider not included.",
          },
        ],
        recommendations: ["Include provider details", "Attach claim form"],
      },
    },
  },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MedicalClaimVerifierPage() {
  const [activeDocument, setActiveDocument] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const selectDocument = (doc) => {
    setActiveDocument(doc);
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
    const maxSize = 20 * 1024 * 1024;
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

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    } else {
      e.target.value = "";
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploadStatus("uploading");
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${BACKEND_URL}/verify-medical-claim`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");

      setUploadProgress(100);
      const result = await response.json();
      setUploadStatus("complete");

      const newDoc = {
        id: Date.now().toString(),
        title: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        transcript: result, // ✅ store full API response
      };

      setUploadedDocuments((prev) => [...prev, newDoc]);
      setActiveDocument(newDoc);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Failed to upload document.");
      setUploadStatus("idle");
    }
  };

  const handleCancel = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setSelectedFile(null);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) setSelectedFile(file);
  };

  return (
    <motion.div
      className="container mx-auto py-8 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="mb-8 flex items-center" variants={itemVariants}>
        <FeatureIcon icon={FileText} size="lg" gradient="blue" className="mr-4" />
        <div>
          <h1 className="text-3xl font-bold">Medical Claim Verifier</h1>
          <p className="text-muted-foreground mt-1">
            Medical claim verification against insurance policies.
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: Samples + Uploaded */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <DocumentSamples
            documents={predefinedDocuments}
            selectDocument={selectDocument}
            activeDocumentId={activeDocument?.id}
            nameDisplay="Sample Documents"
          />
          {uploadedDocuments.length > 0 && (
            <div className="mt-4">
              {/* <h2 className="text-lg font-semibold mb-2">Uploaded Documents</h2> */}
              <DocumentSamples
                documents={uploadedDocuments}
                selectDocument={selectDocument}
                activeDocumentId={activeDocument?.id}
                nameDisplay="Uploaded Documents"
              />
            </div>
          )}
        </motion.div>

        {/* Right: Transcript/Response */}
        <motion.div className="lg:col-span-3" variants={itemVariants}>
          <TranscriptDisplay
            activeDocument={activeDocument}
            handleUploadClick={handleUploadClick}
          />
        </motion.div>
      </div>

      {/* Upload Button */}
      <div className="fixed top-[5rem] right-10">
        <motion.button
          onClick={handleUploadClick}
          className="flex items-center space-x-1 rounded-lg bg-blue-600 text-white px-4 py-2 shadow hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload className="w-5 h-5" />
          <span className="text-sm font-medium">Upload Document</span>
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
