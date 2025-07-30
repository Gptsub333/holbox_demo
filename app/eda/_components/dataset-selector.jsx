"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UploadCloud } from "lucide-react"
import { toast } from "sonner" 

export default function DatasetSelector({
  selectedFile,
  setSelectedFile,
  uploadedFile,
  setUploadedFile,
  onProcess,
  isLoading,
}) {
  // List should match your /public folder files
  const sampleFiles = [
    { label: "Sample 1", file: "sample1.csv" },
    { label: "Heart Disease", file: "heart.csv" },
    { label: "Customers", file: "customers.csv" },
  ]

  // Fires when user picks a file from disk
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.name.endsWith(".csv")) {
      setUploadedFile(file)
      setSelectedFile("") // Clear sample selection if uploading
    } else {
      setUploadedFile(null)
      // (You could add a UI message for non-csv here)
    }
  }

  // Fires when user picks a sample from dropdown
  const handleSampleChange = (value) => {
    setSelectedFile(value)
    setUploadedFile(null) // Clear uploaded file if picking a sample
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-6 w-6 text-gray-600" />
          1. Select and Process Dataset
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col  sm:flex-row items-center gap-4">
          <Select
            onValueChange={handleSampleChange}
            value={selectedFile}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Select a sample CSV" />
            </SelectTrigger>
            <SelectContent>
              {sampleFiles.map(({ label, file }) => (
                <SelectItem key={file} value={file}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-gray-500">OR</span>

          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full sm:w-[220px]"
          />

          <Button
            className="bg-black text-white"
            onClick={onProcess}
            disabled={(!selectedFile && !uploadedFile) || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Process File
          </Button>
        </div>
        {uploadedFile && (
          <div className="mt-2 text-xs text-gray-600">
            Selected for upload: <span className="font-semibold">{uploadedFile.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
