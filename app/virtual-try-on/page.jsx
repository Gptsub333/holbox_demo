"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import SampleGallery from "./_components/SampleGallery";
import UploadSection from "./_components/UploadSection";
import ResultModal from "./_components/ResultModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VirtualTryOnPage() {
  const [modelImage, setModelImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(null);
  const [modelImagePreview, setModelImagePreview] = useState(null);
  const [garmentImagePreview, setGarmentImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const modelInputRef = useRef(null);
  const garmentInputRef = useRef(null);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleModelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelImage(file);
      const preview = URL.createObjectURL(file);
      setModelImagePreview(preview);
    }
  };

  const handleGarmentUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setGarmentImage(file);
      const preview = URL.createObjectURL(file);
      setGarmentImagePreview(preview);
    }
  };

  const removeModelImage = () => {
    setModelImage(null);
    setModelImagePreview(null);
    if (modelInputRef.current) {
      modelInputRef.current.value = "";
    }
  };

  const removeGarmentImage = () => {
    setGarmentImage(null);
    setGarmentImagePreview(null);
    if (garmentInputRef.current) {
      garmentInputRef.current.value = "";
    }
  };

  const handleSampleSelect = (sample) => {
    // Convert sample URLs to File objects if needed
    // For now, we'll use the URLs directly
    setModelImagePreview(sample.model);
    setGarmentImagePreview(sample.garment);
    
    // You might need to fetch these images and convert to File objects
    // depending on your backend requirements
    fetchImageAsFile(sample.model).then(file => setModelImage(file));
    fetchImageAsFile(sample.garment).then(file => setGarmentImage(file));
  };

  const fetchImageAsFile = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'sample.jpg', { type: blob.type });
  };

  const pollJobStatus = async (jobId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/virtual-tryon/status/${jobId}`);
      const data = await response.json();
      
      setStatus(data.status);
      
      if (data.status === "completed") {
        setResult(data.output[0]);
        setIsProcessing(false);
        setProgress(100);
        setShowResultModal(true);
      } else if (data.status === "failed") {
        setIsProcessing(false);
        setStatus("failed");
      } else if (data.status === "processing") {
        setProgress(prev => Math.min(prev + 10, 90));
        setTimeout(() => pollJobStatus(jobId), 3000);
      }
    } catch (error) {
      console.error("Error polling status:", error);
      setIsProcessing(false);
      setStatus("failed");
    }
  };

  const handleProcess = async () => {
    if (!modelImage || !garmentImage) return;

    setIsProcessing(true);
    setProgress(10);
    setResult(null);
    setStatus("processing");

    try {
      const modelBase64 = await convertToBase64(modelImage);
      const garmentBase64 = await convertToBase64(garmentImage);

      const response = await fetch(`${BACKEND_URL}/virtual-tryon/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_image: modelBase64,
          garment_image: garmentBase64,
          category: "tops"
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setJobId(data.id);
      setProgress(30);
      
      pollJobStatus(data.id);
    } catch (error) {
      console.error("Error processing try-on:", error);
      setIsProcessing(false);
      setStatus("failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header - Updated to match PII Extractor style */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
              <Shirt className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                AI Virtual Try-On Studio
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Experience the future of fashion with our AI-powered virtual try-on technology
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Sample Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SampleGallery onSampleSelect={handleSampleSelect} />
          </motion.div>

          {/* Right Side - Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <UploadSection
              modelImage={modelImage}
              garmentImage={garmentImage}
              modelImagePreview={modelImagePreview}
              garmentImagePreview={garmentImagePreview}
              modelInputRef={modelInputRef}
              garmentInputRef={garmentInputRef}
              isProcessing={isProcessing}
              progress={progress}
              status={status}
              onModelUpload={handleModelUpload}
              onGarmentUpload={handleGarmentUpload}
              onRemoveModel={removeModelImage}
              onRemoveGarment={removeGarmentImage}
              onProcess={handleProcess}
            />
          </motion.div>
        </div>

        {/* Result Modal */}
        <ResultModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          result={result}
          isProcessing={isProcessing}
          progress={progress}
          status={status}
        />
      </motion.div>
    </div>
  );
}