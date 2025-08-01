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
  onProcess,
  isLoading,
}) {
  const sampleFiles = [
    { label: "Sample 1", file: "sample1.csv" },
    { label: "Heart Disease", file: "heart.csv" },
    { label: "Customers", file: "customers.csv" },
  ]

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.name.endsWith(".csv")) {
      setUploadedFile(file)
      setSelectedFile("") 
    } else {
      setUploadedFile(null)
      // You can add an error toast/message here
    }
  }

  const handleSampleChange = (value) => {
    setSelectedFile(value)
    setUploadedFile(null)
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
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Dropdown */}
          <Select onValueChange={handleSampleChange} value={selectedFile}>
            <SelectTrigger className="w-full sm:w-[220px] h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition text-gray-800 font-medium">
              <SelectValue placeholder="Select a sample CSV" />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow border w-[220px] bg-white border-gray-200">
              {sampleFiles.map(({ label, file }) => (
                <SelectItem
                  key={file}
                  value={file}
                  className="h-12 px-4 text-gray-800 hover:bg-blue-50 focus:bg-blue-100 font-normal"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-gray-500 font-semibold">OR</span>

          {/* File Input */}
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full sm:w-[220px] h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition text-gray-800 font-medium"
          />

          {/* Process Button */}
          <Button
            className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition disabled:bg-blue-300"
            onClick={onProcess}
            disabled={(!selectedFile && !uploadedFile) || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Process File
          </Button>
        </div>
        {/* Upload info */}
        {uploadedFile && (
          <div className="mt-2 text-xs text-blue-800 bg-blue-50 px-2 py-1 rounded font-semibold inline-block">
            Selected for upload: <span className="font-semibold">{uploadedFile.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
