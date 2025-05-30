"use client";

import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileQuestion,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

// Set PDF worker src
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs";

const PDFReader = ({ selectedPDF, onAskQuestion, isUploading }) => {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [objectUrl, setObjectUrl] = useState(null);

  // Track container width for responsive scaling
  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Create object URL for file if available
  useEffect(() => {
    if (selectedPDF?.file) {
      const url = URL.createObjectURL(selectedPDF.file);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setObjectUrl(null);
      };
    } else {
      setObjectUrl(null);
    }
  }, [selectedPDF]);

  useEffect(() => {
    if (selectedPDF) {
      setCurrentPage(1);
      setZoom(1);
      setNumPages(null);
    }
  }, [selectedPDF]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Adjust zoom buttons to increase/decrease scale (optional)
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, numPages));

  // Calculate responsive scale based on container width and zoom state
  // Assuming the PDF page width is ~600px at scale=1, adjust accordingly
  const basePdfWidth = 600;
  const responsiveScale = containerWidth
    ? Math.min(zoom, containerWidth / basePdfWidth)
    : zoom;

  const pdfFile = selectedPDF ? selectedPDF.url || objectUrl || null : null;

  return (
    <motion.div
      ref={containerRef}
      className="bg-gray-50 border rounded-lg p-3 h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-gray-700 flex items-center">
          <FileQuestion className="w-4 h-4 mr-1.5 text-gray-500" />
          PDF Viewer
        </h2>

        <div className="flex items-center space-x-3">
          {selectedPDF && !isUploading && (
            <button
              onClick={onAskQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md flex items-center transition-colors"
              aria-label="Ask Question"
            >
              <FileQuestion className="w-3.5 h-3.5 mr-1.5" />
              Ask Question
            </button>
          )}
          {isUploading && (
            <div className=" bg-blue-50 p-2 rounded-xl  flex items-center space-x-1 text-blue-600 text-xs">
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Uploading...</span>
            </div>
          )}

          {selectedPDF && (
            <div className="flex items-center space-x-2">
              {/* Zoom buttons hidden on small screens */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  aria-label="Zoom Out"
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition disabled:opacity-50"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-gray-500 min-w-[40px] text-center">
                  {Math.round(responsiveScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  aria-label="Zoom In"
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition disabled:opacity-50"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Download button always visible */}
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = pdfFile;
                  link.download = (selectedPDF.title || "document") + ".pdf";
                  link.click();
                }}
                aria-label="Download PDF"
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

          )}
        </div>
      </div>

      {/* Document area */}
      <div className="flex-grow bg-white border rounded-md relative overflow-auto flex justify-center items-center">
        <AnimatePresence mode="wait">
          {!selectedPDF ? (
            <motion.div
              key="empty"
              className="absolute inset-0 flex flex-col items-center justify-center text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FileQuestion className="w-12 h-12 mb-2 text-gray-300" />
              <p className="text-sm">Select or upload a PDF</p>
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedPDF.id}-${currentPage}`}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => {
                  console.error("PDF loading error:", error);
                }}
                loading={<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />}
              >
                <Page pageNumber={currentPage} scale={responsiveScale} />
              </Document>

              {/* Pagination */}
              <div className="border-t border-gray-200 p-2 flex items-center justify-between bg-gray-50 w-full mt-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-600">
                  Page {currentPage} of {numPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === numPages}
                  aria-label="Next Page"
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PDFReader;
