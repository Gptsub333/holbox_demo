"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import HeaderSection from "./_components/HeaderSection";
import PDFSample from "./_components/PDFSample";
import PDFReader from "./_components/PDFReader";
import UploadButton from "./_components/UploadButton";
import UploadModal from "./_components/UploadModal";
import SummaryInterface from "./_components/SummaryInterface"; // Modal to show summary

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PDFSummarizerPage() {
  const [selectedPDF, setSelectedPDF] = useState(null); // { id, title, file?, url?, pages? }
  const [pdfId, setPdfId] = useState(null);             // Backend-generated pdf_id (string)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);


  // When user selects a sample PDF:
  // 1) Show preview instantly,
  // 2) Upload file in background (simulate or real upload),
  // 3) Save returned pdf_id.
  const handleSelectPDF = async (pdf) => {
    setSelectedPDF({
      id: pdf.id,
      title: pdf.title,
      file: null,
      url: pdf.url,
      pages: pdf.pages || 0,
    });
    setIsUploading(true);
    setSummary("");
    setIsSummaryOpen(false);

    try {
      // For sample PDFs, we fetch file from URL and upload it
      const response = await fetch(pdf.url);
      const blob = await response.blob();
      const file = new File([blob], pdf.title + ".pdf", { type: "application/pdf" });

      const uploadedId = await uploadPDFToBackend(file);
      setPdfId(uploadedId);
    } catch (err) {
      alert("Failed to upload sample PDF: " + err.message);
      setPdfId(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle user uploading a PDF file
  const handleUploadPDF = (file) => {
    setIsUploading(true);
    const url = URL.createObjectURL(file);
    setSelectedPDF({ file, url, title: file.name });
    setPdfId(null);
    setSummary("");
    setIsSummaryOpen(false);

    uploadPDFToBackend(file)
      .then((id) => {
        setPdfId(id);
      })
      .catch(() => {
        alert("Failed to upload PDF to backend.");
        setPdfId(null);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // Upload PDF file to backend, returns pdf_id string
  async function uploadPDFToBackend(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BACKEND_URL}/summarizer/upload_pdf`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.pdf_id;
  }

  // Trigger to show the summary
 const handleSummarize = async () => {
  try {
    setIsSummarizing(true);
    // Create the body as a JSON string
    const res = await fetch(`${BACKEND_URL}/summarizer/get_summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure content type is set to JSON
      },
      body: JSON.stringify({ pdf_id: pdfId }), // Stringify the body
    });

    // Check if the request was successful
    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    setSummary(data.summary || "No summary returned.");
    setIsSummaryOpen(true); // Open the summary modal
  } catch (error) {
    console.error("Error during summarization:", error.message);
    alert(`Error: ${error.message}`);
  }finally{
    setIsSummarizing(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <HeaderSection />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 min-h-[600px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="md:col-span-1">
          <PDFSample onSelectPDF={handleSelectPDF} selectedPDF={selectedPDF} />
        </div>

        <div className="md:col-span-2 relative">
          <PDFReader
            selectedPDF={selectedPDF}
            isUploading={isUploading}
            handleSummarize={handleSummarize}
           isSummarizing={isSummarizing}
          />
        </div>
      </motion.div>

      <UploadButton onClick={() => setIsUploadModalOpen(true)} />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadPDF}
      />

      {/* Summarize button */}
      <motion.div className="mt-4 text-center">
        <button
          onClick={handleSummarize}
          disabled={isUploading || !selectedPDF}
          className={`px-4 py-2 rounded-md text-white ${
            isUploading || !selectedPDF
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? "Processing..." : "Summarize PDF"}
        </button>
      </motion.div>

      {/* Show summary modal */}
      <SummaryInterface
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        summary={summary}
      />
    </div>
  );
}
