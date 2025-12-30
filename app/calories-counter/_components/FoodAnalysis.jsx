"use client"

import { Card } from "@/components/ui/card"

export default function FoodAnalysis({
  selectedFood,
  foodAnalysis,
  onAnalyzeFood,
  loading,
  imagePreview,
  errorMessage,
}) {
  if (!selectedFood) {
    return (
      <Card className="p-12 text-center border-2 border-dashed border-slate-300">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-slate-400 text-2xl">🍽️</span>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Select a Food Item</h3>
        <p className="text-slate-500">Choose a sample food or upload your own image to get started</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Food Analysis</h2>
      </div>

      <Card className="p-6">
        <div className="text-center mb-6">
          {/* Display the preview or image based on the selected food */}
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={selectedFood.name}
              className="w-48 h-48 rounded-xl object-cover mx-auto mb-4 shadow-lg"
            />
          ) : (
            <img
              src={selectedFood.image || "/placeholder.svg"}
              alt={selectedFood.name}
              className="w-48 h-48 rounded-xl object-cover mx-auto mb-4 shadow-lg"
            />
          )}

          <h3 className="text-lg font-semibold text-slate-900">{selectedFood.name}</h3>
        </div>

        <div className="mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-6">
            <h4 className="font-semibold text-slate-900 mb-4 text-center">Nutritional Information</h4>
            {errorMessage && (
              <p className="text-red-500 font-medium text-center mb-4">
                {errorMessage}
              </p>
            )}


            <div className="text-center">
              {/* Show the button when no analysis is available */}
              <button
                onClick={onAnalyzeFood} // Ensure this triggers the API call
                className={`bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading} // Disable the button while loading
              >
                {loading ? (
                  <span>Loading...</span> // Show a loading message or spinner
                ) : (
                  "Analyze Nutrition"
                )}
              </button>
            </div>

          </div>
        </div>
      </Card>
    </div>
  );
}
