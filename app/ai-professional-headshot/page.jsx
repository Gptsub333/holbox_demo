"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "./_components/Header";
import SampleImages from "./_components/SampleImages";
import ImageUpload from "./_components/ImageUpload";
import ImageResult from "./_components/ImageResult";
import helpers from "@/utils/helper";
import constants from "@/utils/constants";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AIImageEditor() {
  const [selectedImage, setSelectedImage] = useState(null);   // File OR sample object
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Handle file selection (single image)
  const handleFileSelect = (file) => {
    if (!file) return;

    const typeError = helpers.checkImageFileType(file);
    if (typeError) {
      setError(typeError);
      return;
    }
    const sizeError = helpers.fileSize(
      constants.fileSize.imageEdit.inBytes,
      constants.fileSize.imageEdit.inMB
    )(file);
    if (sizeError) {
      setError(sizeError);
      return;
    }

    setError(null);
    setEditedImage(null);
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Handle sample image selection (take first prompt as optional extra hint)
  const handleSampleSelect = (sample) => {
    setSelectedImage(sample);             // keep sample object
    setImagePreview(sample.fullImage);    // preview URL
    setEditedImage(null);
    setError(null);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setEditedImage(null);
    setError(null);
    setZoom(100);
  };

  // Call /generate_headshot with ONE image + view_descriptions=front
  const handleGenerateHeadshot = async () => {
    if (!selectedImage) {
      setError("Please upload or choose a sample image.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setEditedImage(null);

    try {
      const fd = new FormData();

      // If it's a file, append directly. If it's a sample, fetch and convert to File.
      if (selectedImage instanceof File) {
        fd.append("images", selectedImage);
      } else {
        // sample object from SampleImages
        const response = await fetch(selectedImage.fullImage);
        const blob = await response.blob();
        const file = new File([blob], "sample.jpg", { type: blob.type || "image/jpeg" });
        fd.append("images", file);

        // Optional: pass a helpful prompt string from the sample (backend can ignore if unsupported)
        const samplePrompt = selectedImage.prompts?.[0] || "";
        if (samplePrompt) {
          fd.append("prompt", samplePrompt);
        }
      }

      // Required by your API for this flow
      fd.append("view_descriptions", "front");

      const resp = await fetch(`${BACKEND_URL}/generate_headshot`, {
        method: "POST",
        body: fd
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(text || `HTTP ${resp.status}`);
      }

      const contentType = resp.headers.get("content-type") || "";
      if (contentType.includes("image/")) {
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        setEditedImage(url);
      } else {
        // If backend returns JSON with an image URL
        const data = await resp.json().catch(() => ({}));
        if (data.image_url) {
          setEditedImage(data.image_url);
        } else {
          throw new Error("Unexpected response from server.");
        }
      }
    } catch (err) {
      console.error(err);
      setError(`Headshot generation failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header />

        {/* Sample Images */}
        <SampleImages handleSampleSelect={handleSampleSelect} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Upload */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageUpload
              imagePreview={imagePreview}
              dragOver={dragOver}
              setDragOver={setDragOver}
              clearImage={clearImage}
              setZoom={setZoom}
              zoom={zoom}
              handleFileSelect={handleFileSelect}
            />

            {/* Actions */}
            <div className="flex items-center justify-center w-full">
              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6
                  mx-auto text-center w-full max-w-sm md:max-w-md">
                {error && (
                  <div className="mb-4 text-sm text-red-600">{error}</div>
                )}

                <div className="flex flex-col items-center">
                  <button
                    onClick={handleGenerateHeadshot}
                    disabled={isProcessing || !selectedImage}
                    className={`w-full md:w-auto px-4 py-2 rounded-lg text-white ${isProcessing || !selectedImage
                        ? "bg-gray-400"
                        : "bg-purple-600 hover:bg-purple-700"
                      }`}
                  >
                    {isProcessing ? "Generating..." : "Generate Headshot (front)"}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Uses one image and sends <code>view_descriptions="front"</code>.
                </p>
              </div>
            </div>

          </motion.div>

          {/* Right Panel: Results */}
          <ImageResult
            editedImage={editedImage}
            imagePreview={imagePreview}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
