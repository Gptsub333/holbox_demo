"use client"

import { useState } from "react";
import Header from "./_components/header";
import UploadArea from "./_components/UploadArea";
import SampleFoods from "./_components/SampleFoods";
import FoodAnalysis from "./_components/FoodAnalysis";
import FoodAnalysisResult from "./_components/FoodAnalysisResult"; // Import the result component

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/demo_backend_v2/estimate-calories";

export default function CalorieCounter() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodAnalysis, setFoodAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // To store the preview
  const [showResultModal, setShowResultModal] = useState(false); // State to control the modal visibility

  const handleFoodSelect = (food) => {
    if (food.image.startsWith("/food/")) {
      handleSampleImageSelect(food.image); // For static image, handle as sample image
    } else {
      setSelectedFood(food);
      setImagePreview(null); // Reset preview for sample foods
      setFoodAnalysis(null); // Reset food analysis
    }
  };

  const handleSampleImageSelect = async (imagePath) => {
    try {
      const response = await fetch(imagePath);
      const imageBlob = await response.blob();
      const file = new File([imageBlob], imagePath.split("/").pop(), { type: imageBlob.type });
      setSelectedFood({ name: "Sample Food", image: file });
      setImagePreview(URL.createObjectURL(file)); // Set preview for static image
      setFoodAnalysis(null); // Reset food analysis for sample foods
    } catch (error) {
      console.error("Error fetching sample image:", error);
    }
  };

  const handleImageUpload = (file) => {
    setSelectedFood({ name: "Uploaded Food", image: file });
    const preview = URL.createObjectURL(file); // Create a preview URL
    setImagePreview(preview); // Set preview state
    setFoodAnalysis(null); // Reset food analysis when a new image is uploaded
  };

  const handleAnalyzeFood = async () => {
    console.log("Button clicked");

    if (selectedFood) {
      if (typeof selectedFood.image === "string") {
        // This means it's a static image path, so skip the API call
        console.log("Static image path selected:", selectedFood.image);
        return; // No API call for static image paths
      }

      // If it's a valid File object
      if (selectedFood.image instanceof File) {
        console.log("Valid file selected:", selectedFood.image); // Log the file to confirm it's a valid File

        const formData = new FormData();
        formData.append("image", selectedFood.image, selectedFood.image.name); // Append the file directly
        //formData.append("portion_hint", selectedFood.name); // Optional portion hint

        // Set loading to true when starting the API call
        setLoading(true);

        try {
          const response = await fetch(`${BACKEND_URL}/estimate-calories`, {
            method: "POST",
            body: formData, // Send the form data with the file
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data from the API");
          }

          const data = await response.json();
          console.log("Received data:", data);
          setFoodAnalysis(data); // Set the food analysis data

          setShowResultModal(true); // Show the result modal after analysis is complete
        } catch (error) {
          console.error("Error during API request:", error);
        } finally {
          // Set loading to false after the API call finishes
          setLoading(false);
        }
      } else {
        console.error("No valid file selected for analysis");
      }
    } else {
      console.error("No food selected");
    }
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false); // Close the modal when the user clicks "Close"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UploadArea onImageUpload={handleImageUpload} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Sample Foods */}
          <div className="space-y-8">
            <SampleFoods selectedFood={selectedFood} onFoodSelect={handleFoodSelect} />
          </div>

          {/* Right Side - Food Analysis */}
          <FoodAnalysis
            selectedFood={selectedFood}
            foodAnalysis={foodAnalysis}
            onAnalyzeFood={handleAnalyzeFood} // Pass down the handler here
            loading={loading} // Pass down the loading state
            imagePreview={imagePreview} // Pass the image preview to FoodAnalysis
          />
        </div>
      </main>

      {/* Show the result modal after analysis is complete */}
      {showResultModal && (
        <FoodAnalysisResult
          foodAnalysis={foodAnalysis} // Pass the food analysis data to the result component
          onClose={handleCloseResultModal} // Function to close the modal
        />
      )}
    </div>
  );
}
