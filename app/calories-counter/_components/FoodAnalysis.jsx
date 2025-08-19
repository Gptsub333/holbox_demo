"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function FoodAnalysis({ selectedFood }) {
  const [showNutrition, setShowNutrition] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleCheckCalories = async () => {
    if (!selectedFood) return

    setIsAnalyzing(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsAnalyzing(false)
    setShowNutrition(true)
  }

  if (!selectedFood) {
    return (
      <Card className="p-12 text-center border-2 border-dashed border-slate-300">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-slate-400 text-2xl">🍽️</span>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Select a Food Item</h3>
        <p className="text-slate-500">Choose a sample food or upload your own image to get started</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Food Analysis</h2>
      </div>

      <Card className="p-6">
        <div className="text-center mb-6">
          <img
            src={selectedFood.image || "/placeholder.svg"}
            alt={selectedFood.name}
            className="w-48 h-48 rounded-xl object-cover mx-auto mb-4 shadow-lg"
          />
          <h3 className="text-lg font-semibold text-slate-900">{selectedFood.name}</h3>
        </div>

        <Button
          onClick={handleCheckCalories}
          disabled={isAnalyzing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium transition-all duration-200"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            "Check Calories"
          )}
        </Button>

        {showNutrition && (
          <div className="mt-6 animate-in fade-in duration-500">
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-6">
              <h4 className="font-semibold text-slate-900 mb-4 text-center">Nutritional Information</h4>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{selectedFood.calories}</div>
                  <div className="text-sm text-slate-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-900">{selectedFood.protein}</div>
                  <div className="text-sm text-slate-600">Protein</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-900">{selectedFood.carbs}</div>
                  <div className="text-sm text-slate-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-900">{selectedFood.fat}</div>
                  <div className="text-sm text-slate-600">Fat</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
