"use client"

import { useState } from "react"
import Header from "./_components/header"
import UploadArea from "./_components/UploadArea"
import SampleFoods from "./_components/SampleFoods"
import FoodAnalysis from "./_components/FoodAnalysis"

export default function CalorieCounter() {
  const [selectedFood, setSelectedFood] = useState(null)

  const handleFoodSelect = (food) => {
    setSelectedFood(food)
  }

  const handleImageUpload = (uploadedFood) => {
    setSelectedFood(uploadedFood)
  }

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
          <FoodAnalysis selectedFood={selectedFood} />
        </div>
      </main>
    </div>
  )
}
