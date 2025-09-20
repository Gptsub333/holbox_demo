import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";

export default function UploadModal({
  uploadModalOpen,
  setUploadModalOpen,
  uploadStatus,
  setUploadStatus,
  uploadProgress,
  setUploadProgress,
  selectedFile,
  setSelectedFile,
  handleFileSelect,
  handleUpload,
  handleCancel,
  handleDragOver,
  handleDrop,
}) {
  const fileInputRef = useRef(null);

  // Close modal safely
  const handleClose = () => {
    setUploadModalOpen(false);
    setUploadProgress(0);
    setUploadStatus("idle");
    setSelectedFile(null);
    handleCancel();
  };

  if (!uploadModalOpen) return null;

  return (
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold heading-font">Upload Document</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
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
                <p className="mb-2 text-sm font-medium">
                  Drag and drop your document here
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  PDF, DOCX, TXT (MAX. 20MB)
                </p>
                <button className="rounded-lg bg-blue-100 px-4 py-2 text-blue-700 text-sm font-medium hover:bg-blue-200 transition-colors">
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {selectedFile && (
                <div className="bg-gray-50 rounded-lg p-4 flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`w-full rounded-lg px-4 py-3 text-white font-medium ${
                  selectedFile
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                } transition-colors`}
              >
                Upload and Transcribe
              </button>
            </>
          )}

          {(uploadStatus === "uploading" || uploadStatus === "processing") && (
            <>
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mx-auto mb-6"></div>
                <h3 className="text-lg font-medium mb-2">
                  {uploadStatus === "uploading" ? "Uploading..." : "Processing..."}
                </h3>
                <div className="flex-1 min-w-0 mb-2">
                  <p className="text-sm font-medium truncate">
                    {selectedFile?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {uploadStatus === "uploading" && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {uploadStatus === "uploading"
                    ? `${uploadProgress}% complete`
                    : "Analyzing document"}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="w-full rounded-lg px-4 py-3 text-white font-medium bg-gray-300  hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {uploadStatus === "complete" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your document has been successfully uploaded
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
