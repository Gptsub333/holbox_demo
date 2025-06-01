"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import HeaderSection from "./_components/HeaderSection";
import PDFSample from "./_components/PDFSample";
import PDFReader from "./_components/PDFReader";
import UploadButton from "./_components/UploadButton";
import UploadModal from "./_components/UploadModal";
import SummaryInterface from "./_components/SummaryInterface"; // Import the new Summary component

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PDFExtractorPage() {
  const [selectedPDF, setSelectedPDF] = useState(null); // Preview info
  const [pdfId, setPdfId] = useState(null);             // Backend PDF ID
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false); // Control visibility of summary modal
  const [summary, setSummary] = useState("");              // Store the summary text
  const [isUploading, setIsUploading] = useState(false);

  // Dummy summary text to simulate backend response
  const dummySummary = `
    This document provides a detailed analysis of PDF processing using React and PDF.js.
    It explains how to integrate PDF viewer components, handle file uploads, and render the contents 
    of a PDF file dynamically in the web application. The key takeaway from this document is the 
    efficient management of resources and how to implement interactive features for end-users.
  `;

  // User selects sample PDF: instant preview + background upload
  const handleSelectPDF = async (pdf) => {
    setSelectedPDF({
      id: pdf.id,
      title: pdf.title,
      file: null,
      url: pdf.url,
      pages: pdf.pages || 0,
    });
    setIsUploading(true);
    setSummary(""); // Clear previous summary
    setIsSummaryOpen(false);

    // Simulate a successful upload and directly set a dummy summary
    setTimeout(() => {
      setIsUploading(false); // End uploading
    }, 1000); // Simulate a delay before showing the summary
  };

  // User uploads PDF file: instant preview + background upload
  const handleUploadPDF = (file) => {
    setIsUploading(true);
    const url = URL.createObjectURL(file);
    setSelectedPDF({ file, url, title: file.name });
    setPdfId(null);
    setSummary(""); // Clear previous summary
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

  async function uploadPDFToBackend(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BACKEND_URL}/pdf_data_extraction/upload_pdf`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.pdf_id;
  }

  // Trigger to show the summary
  const handleSummarize = () => {
    setSummary(dummySummary); // Set dummy summary
    setIsSummaryOpen(true); // Open the summary modal
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
          />
        </div>
      </motion.div>

      <UploadButton onClick={() => setIsUploadModalOpen(true)} />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadPDF}
      />

      {/* Button to trigger summarization */}
      <motion.div className="mt-4 text-center">
        <button
          onClick={handleSummarize}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Summarize PDF
        </button>
      </motion.div>

      {/* Pass the summary to the new SummaryInterface */}
      <SummaryInterface
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        summary={summary}
      />
    </div>
  );
}
