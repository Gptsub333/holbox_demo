"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, CheckCircle } from "lucide-react";

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    setIsUploading(true);
    setUploadedFile(file);
    // Simulating upload time
    setTimeout(() => {
      setIsUploading(false);
      onUpload(file); // Call the provided onUpload function
      onClose(); // Close the modal after upload
    }, 2000); // Simulating 2 seconds upload time
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
                <h2 className="text-xl font-semibold heading-font">
                  Upload PDF
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isUploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {!isUploading && !uploadedFile && (
                  <>
                    <div
                      className={`border-2 border-dashed ${
                        isDragging
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      } rounded-lg p-8 text-center mb-6 cursor-pointer hover:border-blue-500 transition-colors`}
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragLeave={handleDragLeave}
                    >
                      <Upload className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                      <p className="mb-2 text-sm font-medium">
                        Drag and drop your PDF file here
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        PDF only (MAX. 20MB)
                      </p>
                      <button className="rounded-lg bg-blue-100 px-4 py-2 text-blue-700 text-sm font-medium hover:bg-blue-200 transition-colors">
                        Browse Files
                      </button>
                      <input
                        id="fileInput"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </div>
                  </>
                )}

                {isUploading && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mx-auto mb-6"></div>
                    <h3 className="text-lg font-medium mb-2">Uploading...</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Your file is being uploaded
                    </p>
                  </div>
                )}

                {uploadedFile && !isUploading && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleFileUpload}
                      disabled={isUploading}
                      className="w-full rounded-lg px-4 py-3 text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Upload and Process
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
