"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "./_components/Header";
import SampleImages  from "./_components/SampleImages";
import PromptInput from "./_components/PromptInput";
import ImageUpload from "./_components/ImageUpload";
import ImageResult from "./_components/ImageResult";
import helpers from "@/utils/helper";
import constants from "@/utils/constants";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;



const promptSuggestions = {
  "Background Changes": [
    "Change background to...",
    "Remove background",
    "Blur background",
    "Add mountain landscape background"
  ],
  "Style Effects": [
    "Make it vintage",
    "Apply watercolor effect",
    "Add film grain",
    "Make it look like an oil painting"
  ],
  "Object Manipulation": [
    "Remove the person in red shirt",
    "Add a golden retriever",
    "Change hair color to blonde"
  ],
  "Lighting": [
    "Add dramatic lighting",
    "Make it brighter",
    "Add soft shadows",
    "Add golden hour lighting"
  ]
};

export default function AIImageEditor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState({});
  const [zoom, setZoom] = useState(100);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;
    
    const TypeError = helpers.checkImageFileType(file)
    if (TypeError) {
      setError(TypeError)
      return
    }

    const sizeError = helpers.fileSize(constants.fileSize.imageEdit.inBytes, constants.fileSize.imageEdit.inMB)(file)
    if (sizeError) {
      setError(sizeError)
      return
    }

    setError(null);
    setSelectedImage(file);
    setEditedImage(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

 

  // Handle sample image selection
  const handleSampleSelect = (sample) => {
    setSelectedImage(sample);
    setImagePreview(sample.fullImage);
    setEditedImage(null);
    setError(null);
  };

  // Handle prompt selection
  const handlePromptSelect = (selectedPrompt) => {
    setPrompt(selectedPrompt);
    setShowSuggestions(false);
  };

  // Filter suggestions based on user input
  const filterSuggestions = (inputText) => {
    if (!inputText.trim()) {
      setFilteredSuggestions(promptSuggestions);
      return;
    }

    const filtered = {};
    const searchText = inputText.toLowerCase();

    Object.entries(promptSuggestions).forEach(([category, suggestions]) => {
      const matchingSuggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchText)
      );
      
      if (matchingSuggestions.length > 0) {
        filtered[category] = matchingSuggestions;
      }
    });

    setFilteredSuggestions(filtered);
    
    // Auto-hide suggestions if no matches found
    if (Object.keys(filtered).length === 0) {
      setShowSuggestions(false);
    }
  };

  // Handle image editing
  const handleEdit = async () => {
    if (!selectedImage || !prompt.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      
      if (selectedImage instanceof File) {
        formData.append('image', selectedImage);
      } else {
        // For sample images, we need to fetch and convert to File
        const response = await fetch(selectedImage.fullImage);
        const blob = await response.blob();
        const file = new File([blob], 'sample-image.jpg', { type: 'image/jpeg' });
        formData.append('image', file);
      }
      
      formData.append('prompt', prompt);

      const response = await fetch(`${BACKEND_URL}/image_editing/edit`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // Check if response is binary (image) or JSON (error)
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('image')) {
        // Binary image response
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setEditedImage(imageUrl);
      } else {
        // JSON error response
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setError('Unknown error occurred');
        }
      }
    } catch (error) {
      console.error("Error editing image:", error);
      setError('Error processing the image: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear image
  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setEditedImage(null);
    setError(null);
    setPrompt('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
       <Header />

        {/* Sample Images Section */}
        <SampleImages handleSampleSelect={handleSampleSelect} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Image Upload and Controls */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Image Upload Section */}
            
            <ImageUpload 
              imagePreview={imagePreview}
              dragOver={dragOver}
              setDragOver={setDragOver}
              clearImage={clearImage}
              setZoom={setZoom}
              zoom={zoom}
              handleFileSelect={handleFileSelect}
            />

            {/* Prompt Input Section */}
            <PromptInput 
              prompt={prompt}
              setPrompt={setPrompt}
              handlePromptSelect={handlePromptSelect}
              handleEdit={handleEdit}
              isProcessing={isProcessing}
              selectedImage={selectedImage}
              error={error}
              filteredSuggestions={filteredSuggestions}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              setFilteredSuggestions={setFilteredSuggestions}
              filterSuggestions={filterSuggestions}
            />
          </motion.div>

          {/* Right Panel - Results */}
          <ImageResult 
            editedImage={editedImage}
            imagePreview={imagePreview}
            isProcessing={isProcessing}
          />

        </div>
      </div>
    </div>
  )
}