import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Loader2, X, Clock, BarChart3, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const InputBox = ({
  selectedFile,
  handleFileSelect,
  error,
  clearFile,
  handleExtract,
  isProcessing,
  filePreview,
  
}) => {
  const [zoom, setZoom] = useState(100);
  const [dragOver, setDragOver] = useState(false);


    // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  return (
    <motion.div
      className="lg:col-span-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* File Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Medical Document</h2>

        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Drop your medical document here or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">Supports PDF, DOC, DOCX... up to 20MB</p>

            {/* Supported formats */}
            {/* <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {['PDF', 'DOC', 'DOCX', 'TXT', 'RTF', 'JPG', 'PNG'].map((format) => (
                      <span key={format} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-md">
                        {format}
                      </span>
                    ))}
                  </div> */}

            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.png"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              Choose File
            </label>

            {/* HIPAA Notice */}
            {/* <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-xs text-blue-800 font-medium">HIPAA Compliant Processing</span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      All documents are processed securely and not stored permanently.
                    </p>
                  </div> */}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {selectedFile instanceof File ? selectedFile.name : selectedFile.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedFile instanceof File
                        ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                        : `Sample Document - ${selectedFile.specialty}`}
                    </div>
                  </div>
                </div>
                <button onClick={clearFile} className="p-1 text-red-500 hover:text-red-700 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {filePreview && (
                <div className="mt-3">
                  <div className="relative overflow-hidden rounded-lg border">
                    <div
                      className="w-full max-h-48 flex items-center justify-center bg-gray-50"
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                    >
                      <img src={filePreview} alt="Document Preview" className="max-w-full max-h-48 object-contain" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setZoom(Math.max(50, zoom - 25))}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white rounded transition-colors"
                      >
                        <ZoomOut className="h-3 w-3" />
                      </button>
                      <span className="text-xs text-gray-600 min-w-[35px] text-center">{zoom}%</span>
                      <button
                        onClick={() => setZoom(Math.min(200, zoom + 25))}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white rounded transition-colors"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setZoom(100)}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white rounded transition-colors"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Extract Button */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Extract Medical Codes</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-4">
          <button
            onClick={handleExtract}
            disabled={!selectedFile || isProcessing}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Extracting Codes...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-5 w-5" />
                Extract Medical Codes
              </>
            )}
          </button>
        </div>

        {/* {isProcessing && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800 font-medium">Processing Stages</span>
            </div>
            <div className="space-y-2 text-xs text-blue-700">
              <div>✓ Document uploaded and validated</div>
              <div>✓ Text extraction in progress...</div>
              <div>⏳ AI analysis and code identification...</div>
              <div>⏳ Confidence scoring and validation...</div>
            </div>
          </div>
        )} */}
      </div>
    </motion.div>
  );
};

export default InputBox;
