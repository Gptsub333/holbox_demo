'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import Header from '../medical-code-extractor/_components/header';
import SampleDocuments from '../medical-code-extractor/_components/SampleDocuments';
import InputBox from '../medical-code-extractor/_components/InputBox';
import Result from '../medical-code-extractor/_components/Result';
import Processing from '../medical-code-extractor/_components/Processing';
import helpers from '@/utils/helper';
import constants from '@/utils/constants';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MedicalCodeExtractor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionResult, setExtractionResult] = useState('');
  const [error, setError] = useState(null);
  const [transcribeProgress, setTranscribeProgress] = useState(0);
  const abortRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const TypeError = helpers.checkMedicalExractorFileType(file);
    if (TypeError) {
      setError(TypeError);
      return;
    }

    // Validate file size (20MB max)

    const sizeError = helpers.fileSize(
      constants.fileSize.medicalCodeExtractor.inBytes,
      constants.fileSize.medicalCodeExtractor.inMB
    )(file);
    if (sizeError) {
      setError(sizeError);
      return;
    }

    setError(null);
    setSelectedFile(file);
    setExtractionResult('');

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  // Handle sample document selection
// Handle sample document selection
const handleSampleSelect = async (sample) => {
  try {
    setError(null);
    setIsProcessing(true);
    
    // Fetch the actual PDF file from the server
    const response = await fetch(sample.sampleFile);
    if (!response.ok) {
      throw new Error(`Failed to fetch sample: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create a proper File object from the blob
    const file = new File([blob], sample.sampleFile.split('/').pop(), { 
      type: blob.type || 'application/pdf' 
    });
    
    // Set the file and preview
    setSelectedFile(file);
    setFilePreview(null); // PDFs don't need image preview
    setExtractionResult('');
    setError(null);
    
  } catch (error) {
    setError('Error loading sample document: ' + error.message);
    console.error('Error loading sample:', error);
  } finally {
    setIsProcessing(false);
  }
};

  // Handle code extraction
// Handle code extraction
const handleExtract = async () => {
  if (!selectedFile) return;

  setIsProcessing(true);
  setError(null);
  setTranscribeProgress(0);

  try {
    const formData = new FormData();
    formData.append('file', selectedFile); // Now selectedFile is always a File object

    const controller = new AbortController();
    abortRef.current = () => controller.abort();

    const response = await fetch(`${BACKEND_URL}/extract-medical-coding`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      result += decoder.decode(value, { stream: true });
      receivedLength += value.length;

      if (total) {
        const percentage = Math.round((receivedLength / total) * 100);
        console.log(`Transcription progress: ${percentage}%`);
        setTranscribeProgress(percentage);
      }
    }

    result += decoder.decode();
    const data = JSON.parse(result);
    
    if (data.detail) {
      setError(data.detail);
    } else {
      setExtractionResult(data.result || 'No data returned from server');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      setError('You cancelled the process.');
    } else {
      setError('Error processing document: ' + error.message);
      // For demo purposes, you can add mock data here if needed
      // setExtractionResult('Sample extraction completed...');
    }
  } finally {
    setIsProcessing(false);
  }
};

  // Clear file
  const clearFile = () => {
    if (abortRef.current) {
      abortRef.current(); // cancel upload or transcription
    }

    setSelectedFile(null);
    setFilePreview(null);
    setExtractionResult('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header - keep here */}
        <Header />

        {/* Sample Documents Section */}
        <SampleDocuments handleSampleSelect={handleSampleSelect} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - File Upload and Controls */}
          <InputBox
            selectedFile={selectedFile}
            handleFileSelect={handleFileSelect}
            error={error}
            clearFile={clearFile}
            handleExtract={handleExtract}
            isProcessing={isProcessing}
            filePreview={filePreview}
          />

          {/* Right Panel - Results */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {extractionResult ? (
              <Result extractionResult={extractionResult} />
            ) : isProcessing ? (
              <Processing transcribeProgress={transcribeProgress} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <BarChart3 className="h-12 w-12 text-blue-500" />
                  </div>
                  <p className="text-base text-gray-500 mb-2">Your results will appear here</p>
                  <p className="text-sm text-gray-400 text-center">
                    Upload a medical document and click "Extract Medical Codes" to begin analysis
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
