"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText, CheckCircle, ChevronRight, Loader2 } from "lucide-react"
import ResultsModal from "./resultsmodal"  // Import the ResultsModal component

// Mock data for sample analysis with amounts
const sampleMerchants = {
  "statement-1.pdf": [
    { name: "Amazon", amount: 142.5 },
    { name: "Starbucks", amount: 18.25 },
    { name: "Netflix", amount: 15.99 },
    { name: "Shell", amount: 55.7 },
    { name: "Walmart", amount: 89.3 },
    { name: "Apple Store", amount: 1199.0 },
    { name: "Uber Eats", amount: 25.45 },
  ],
  "statement-2.pdf": [
    { name: "Best Buy", amount: 499.99 },
    { name: "Costco", amount: 210.65 },
    { name: "Home Depot", amount: 121.8 },
    { name: "Spotify", amount: 9.99 },
    { name: "Delta Airlines", amount: 345.0 },
    { name: "Marriott", amount: 280.5 },
    { name: "Target", amount: 76.15 },
  ],
  "statement-3.pdf": [
    { name: "Adobe", amount: 52.99 },
    { name: "Microsoft", amount: 149.0 },
    { name: "Google Cloud", amount: 75.0 },
    { name: "ExxonMobil", amount: 62.3 },
    { name: "AT&T", amount: 180.44 },
    { name: "Verizon", amount: 165.21 },
    { name: "Whole Foods", amount: 134.98 },
  ],
}

export default function SampleSelection() {
  const [selectedSample, setSelectedSample] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [merchants, setMerchants] = useState([])

  const handleSelectSample = (sample) => {
    setSelectedSample(sample)
  }

  const handleAnalyze = () => {
    if (!selectedSample) return

    setIsAnalyzing(true)
    // Simulate analysis delay
    setTimeout(() => {
      setMerchants(sampleMerchants[selectedSample])
      setIsAnalyzing(false)
      setShowResults(true)
    }, 1500)
  }

  const handleCloseResults = () => {
    setShowResults(false)
    setSelectedSample(null) // Reset selection after closing
  }

  const sampleFiles = [
    { name: "statement-1.pdf", description: "Retail & Subscriptions" },
    { name: "statement-2.pdf", description: "Travel & Groceries" },
    { name: "statement-3.pdf", description: "Tech & Utilities" },
  ]

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start relative">
        {/* Sample Selection */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>1. Select a Sample Statement</CardTitle>
            <CardDescription>Choose one of the files below to begin.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4">
            {sampleFiles.map((file) => (
              <button
                key={file.name}
                onClick={() => handleSelectSample(file.name)}
                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 md:flex md:items-center md:gap-4 ${selectedSample === file.name
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-offset-2"
                    : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50"
                  }`}
              >
                <FileText className="h-8 w-8 text-blue-600 flex-shrink-0 mb-2 md:mb-0" />
                <div>
                  <p className="font-semibold text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">{file.description}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Analysis Trigger */}
        <div className="sticky top-8 w-full md:w-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>2. Analyze Your Selection</CardTitle>
              <CardDescription>The selected file will appear below.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center p-4 rounded-md bg-gray-100 min-h-[80px] mb-4 border border-gray-200">
                {selectedSample ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                    <p className="font-medium text-gray-700 truncate">{selectedSample}</p>
                  </>
                ) : (
                  <p className="text-gray-500 text-center w-full">No file selected</p>
                )}
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!selectedSample || isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base py-6"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Statement <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Modal Component */}
      <ResultsModal
        showResults={showResults}
        merchants={merchants}
        selectedSample={selectedSample}
        handleCloseResults={handleCloseResults}
      />
    </div>
  )
}
