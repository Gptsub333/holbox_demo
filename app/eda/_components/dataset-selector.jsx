"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UploadCloud } from "lucide-react"

export default function DatasetSelector({
  selectedFile,
  setSelectedFile,
  uploadedFile,
  setUploadedFile,
  isLoading,
  setIsFileSelected,
}) {
  const sampleFiles = [
    { label: "Sample 1", file: "sample1.csv" },
    { label: "Heart Disease", file: "heart.csv" },
    { label: "Customers", file: "customers.csv" },
  ]

  // Handle file upload and update the uploadedFile state
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file)  // Update the selectedFile state
      setUploadedFile(true)   // Show the query section
      setIsFileSelected(true)  // Set the file selection state to true
    } else {
      setUploadedFile(false)  // Reset if invalid file is chosen
      setIsFileSelected(false) // Hide query section
    }
  }

  // Handle sample file selection and update the uploadedFile state
  const handleSampleChange = async (value) => {
    const selectedSample = sampleFiles.find(sample => sample.file === value)
    if (selectedSample) {
      try {
        // Fetch the file from the public folder as a Blob
        const response = await fetch(`/${selectedSample.file}`)
        if (!response.ok) throw new Error(`Failed to fetch file: ${selectedSample.file}`)
        
        const blob = await response.blob()
        
        // Convert the Blob to a File object
        const file = new File([blob], selectedSample.file, { type: "text/csv" })
        
        // Set the file in the state and show the query section
        setSelectedFile(file)
        setUploadedFile(true)
        setIsFileSelected(true)
      } catch (error) {
        console.error("Error fetching sample file:", error)
        setUploadedFile(false)
        setIsFileSelected(false)
      }
    }
  }

  return (
    <Card className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
          <UploadCloud className="h-6 w-6 text-blue-600" />
          1. Select and Process Dataset
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 w-full">

          {/* Dropdown for selecting sample files */}
          <div className="w-full sm:w-[48%]">
            <Select 
              onValueChange={handleSampleChange} 
              value={selectedFile ? selectedFile.name : ""} 
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition text-gray-800 font-medium"
            >
              <SelectTrigger className="w-full h-full">
                <SelectValue placeholder="Select a sample CSV" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow border w-[270px] lg:w-[420px] items-center justify-center bg-white border-gray-200 ">
                {sampleFiles.map(({ label, file }) => (
                  <SelectItem
                    key={file}
                    value={file}
                    className="h-12 px-4 w-[270px] lg:w-[520px] text-gray-800 hover:bg-blue-50 focus:bg-blue-100 font-normal"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Input for uploading CSV */}
          <div className="w-full sm:w-[48%]">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition text-gray-800 font-medium"
            />
          </div>
        </div>

        {/* Removed the "Selected for upload" info text */}
      </CardContent>
    </Card>
  )
}
