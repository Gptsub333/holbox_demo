"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import HeaderSection from "./_components/HeaderSection";
import PDFSample from "./_components/PDFSample";
import PDFReader from "./_components/PDFReader";
import UploadButton from "./_components/UploadButton";
import UploadModal from "./_components/UploadModal";
import ChatInterface from "./_components/ChatInterface";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function PDFExtractorPage() {
  const [selectedPDF, setSelectedPDF] = useState(null); // Preview info
  const [pdfId, setPdfId] = useState(null);             // Backend PDF ID
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);            // Force reset chat
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState([]);

  // User selects sample PDF: instant preview + background upload
  const handleSelectPDF = async (pdf) => {
    setSelectedPDF({
      id: pdf.id,
      title: pdf.title,
      file: null,
      url: pdf.url,
      pages: pdf.pages || 0,
    });
    setIsChatOpen(false);
    setIsUploading(true);
    setMessages([]);
    setChatKey((k) => k + 1);

    try {
      const response = await fetch(pdf.url);
      if (!response.ok) throw new Error("Failed to fetch sample PDF.");
      const blob = await response.blob();
      const file = new File([blob], pdf.title + ".pdf", { type: "application/pdf" });

      // Update selectedPDF with file for download preview
      setSelectedPDF((prev) => ({ ...prev, file }));

      // Upload file
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch(`${BACKEND_URL}/pdf_data_extraction/upload_pdf`, {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Failed to upload sample PDF to backend.");

      const data = await uploadRes.json();
      setPdfId(data.pdf_id);

      // Update PDF id in preview
      setSelectedPDF((prev) => ({
        ...prev,
        id: data.pdf_id,
        file,
      }));
    } catch (err) {
      console.error("Error selecting/uploading sample PDF:", err);
      alert("Failed to process sample PDF.");
      setPdfId(null);
    } finally {
      setIsUploading(false);
    }
  };

  // User uploads PDF file: instant preview + background upload
  const handleUploadPDF = (file) => {
    setIsUploading(true);
    const url = URL.createObjectURL(file);
    setSelectedPDF({ file, url, title: file.name });
    setPdfId(null);
    setMessages([]);
    setChatKey((k) => k + 1);
    setIsChatOpen(false);

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

  const handleAskQuestion = () => {
    setIsChatOpen(true);
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
            onAskQuestion={handleAskQuestion}
            isUploading={isUploading}
          />
        </div>
      </motion.div>

      <UploadButton onClick={() => setIsUploadModalOpen(true)} />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadPDF}
      />

      <ChatInterface
        key={chatKey}  // Force reset chat on PDF change
        isOpen={isChatOpen}
        pdfId={pdfId}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}
