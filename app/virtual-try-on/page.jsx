"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import SampleGallery from "./_components/SampleGallery";
import UploadSection from "./_components/UploadSection";
import ResultModal from "./_components/ResultModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const BACKEND_URL = "http://0.0.0.0:8000/api/demo_backend_v2" ;

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
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
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
  // Check if both model and garment images are already set
  const isModelImageSet = modelImage !== null;
  const isGarmentImageSet = garmentImage !== null;

  // If both images are not set, set both model and garment
  if (!isModelImageSet && !isGarmentImageSet) {
    setModelImagePreview(sample.model);
    setGarmentImagePreview(sample.garment);

    fetchImageAsFile(sample.model).then((file) => setModelImage(file));
    fetchImageAsFile(sample.garment).then((file) => setGarmentImage(file));
  } else {
    // If model image is missing, set it
    if (!isModelImageSet) {
      setModelImagePreview(sample.model);
      fetchImageAsFile(sample.model).then((file) => setModelImage(file));
    }

    // If garment image is missing, set it
    if (!isGarmentImageSet) {
      setGarmentImagePreview(sample.garment);
      fetchImageAsFile(sample.garment).then((file) => setGarmentImage(file));
    }

    // If both images are already set, replace both
    if (isModelImageSet && isGarmentImageSet) {
      setModelImagePreview(sample.model);
      setGarmentImagePreview(sample.garment);

      fetchImageAsFile(sample.model).then((file) => setModelImage(file));
      fetchImageAsFile(sample.garment).then((file) => setGarmentImage(file));
    }
  }
};



  const fetchImageAsFile = async (url) => {
    const response = await fetch(url, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      }
    });
    const blob = await response.blob();
    return new File([blob], 'sample.jpg', { type: blob.type });
  };

  const pollJobStatus = async (jobId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/virtual-tryon/status/${jobId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        }
      });
      
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        setIsProcessing(false);
        setStatus("failed");
        return;
      }
      
      setStatus(data.status);

      if (data.status === "completed") {
        if (data.output && data.output.length > 0) {
          setResult(data.output[0]);
          setProgress(100);
          setShowResultModal(true);
        } else {
          setStatus("failed");
        }
        setIsProcessing(false);
        
      } else if (data.status === "failed") {
        setIsProcessing(false);
        setStatus("failed");
        
        alert("Virtual try-on failed. This could be due to:\n" +
          "• Image format/size issues\n" + 
          "• Backend processing error\n" +
          "• AI model limitations\n" +
          "Check console for details.");
        
      } else if (data.status === "processing" || data.status === "pending") {
        setProgress((prev) => {
          const newProgress = Math.min(prev + 5, 90);
          return newProgress;
        });
        
        setTimeout(() => pollJobStatus(jobId), 3000);
        
      } else {
        setTimeout(() => pollJobStatus(jobId), 3000);
      }
      
    } catch (error) {
      setIsProcessing(false);
      setStatus("failed");
    }
  };

  const handleProcess = async () => {
    if (!modelImage || !garmentImage) {
      return;
    }

    // Validate image types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(modelImage.type)) {
      alert(`Invalid model image type: ${modelImage.type}. Please use JPG, PNG, or WebP.`);
      return;
    }
    if (!validTypes.includes(garmentImage.type)) {
      alert(`Invalid garment image type: ${garmentImage.type}. Please use JPG, PNG, or WebP.`);
      return;
    }

    // Check file sizes (limit to 10MB each)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (modelImage.size > maxSize) {
      alert(`Model image too large: ${(modelImage.size / 1024 / 1024).toFixed(1)}MB. Please use images under 10MB.`);
      return;
    }
    if (garmentImage.size > maxSize) {
      alert(`Garment image too large: ${(garmentImage.size / 1024 / 1024).toFixed(1)}MB. Please use images under 10MB.`);
      return;
    }
    
    setIsProcessing(true);
    setProgress(10);
    setResult(null);
    setStatus("processing");

    try {
      const modelBase64 = await convertToBase64(modelImage);
      const garmentBase64 = await convertToBase64(garmentImage);

      const requestBody = {
        model_image: modelBase64,
        garment_image: garmentBase64,
        category: "tops"
      };

      const response = await fetch(`${BACKEND_URL}/virtual-tryon/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (!data.id) {
        throw new Error("No job ID returned from API");
      }

      setJobId(data.id);
      setProgress(30);
      
      pollJobStatus(data.id);
      
    } catch (error) {
      setIsProcessing(false);
      setStatus("failed");
      alert(`Processing failed: ${error.message}`);
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