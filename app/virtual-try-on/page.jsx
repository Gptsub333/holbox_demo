"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import SampleGallery from "./_components/SampleGallery";
import UploadSection from "./_components/UploadSection";
import ResultModal from "./_components/ResultModal";
import { useAuthContext } from "../../context/AuthContext"; // Import the context

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const BACKEND_URL = "http://0.0.0.0:8000/api/demo_backend_v2" ;

export default function VirtualTryOnPage() {
  const [modelImage, setModelImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(null);
  const [modelImagePreview, setModelImagePreview] = useState(null);
  const [garmentImagePreview, setGarmentImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const modelInputRef = useRef(null);
  const garmentInputRef = useRef(null);
  const { sessionToken } = useAuthContext(); // Get the session token from the context
  const [garmentType, setGarmentType] = useState("");

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
    setGarmentType(sample.category); 

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

  const handleProcess = async () => {
    if (!modelImage || !garmentImage || !garmentType) {
      alert("Please upload both images and provide a garment type.");
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
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('person_image', modelImage);
      formData.append('garment_image', garmentImage);
      formData.append('garment_type', garmentType);

      setProgress(30);

      const response = await fetch(`${BACKEND_URL}/try_on`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          // Don't set Content-Type header when using FormData - browser will set it automatically with boundary
        },
        body: formData,
      });

      setProgress(70);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Check if response is an image
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        // Response is an image - create blob URL
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        
        setResult(imageUrl);
        setStatus("completed");
        setProgress(100);
        setShowResultModal(true);
      } else {
        // Response might be JSON with image URL or base64
        const responseText = await response.text();
        let data;
        
        try {
          data = JSON.parse(responseText);
          // Handle different possible response formats
          if (data.image_url) {
            setResult(data.image_url);
          } else if (data.result) {
            setResult(data.result);
          } else if (data.output) {
            setResult(data.output);
          } else {
            throw new Error("No image data found in response");
          }
        } catch (parseError) {
          // If it's not JSON, treat as direct image URL or base64
          setResult(responseText);
        }
        
        setStatus("completed");
        setProgress(100);
        setShowResultModal(true);
      }

      setIsProcessing(false);

    } catch (error) {
      setIsProcessing(false);
      setStatus("failed");
      setProgress(0);
      alert(`Processing failed: ${error.message}`);
      console.error('Processing error:', error);
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
          className="mt-[40px] sm:mt-0 mb-8"
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
              garmentType={garmentType}
              setGarmentType={setGarmentType}
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