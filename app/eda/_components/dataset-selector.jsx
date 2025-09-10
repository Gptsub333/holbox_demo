"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UploadCloud } from "lucide-react";

export default function DatasetSelector({
  selectedFile,
  setSelectedFile,
  uploadedFile,
  setUploadedFile,
  isLoading,
  setIsFileSelected,
  setSessionId, // Add this prop to set the session_id in the parent
  setIsLoading
}) {
  const sampleFiles = [
    { label: "Sample 1", file: "sample1.csv" },
    { label: "Heart Disease", file: "heart.csv" },
    { label: "Customers", file: "customers.csv" },
  ];

  // Upload the file to the backend API
  const uploadFile = async (file) => {
    setIsFileSelected(false); // Reset file selected flag
    setIsLoading(true); // Start loading indicator

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/eda/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "File upload failed");

      console.log("File uploaded successfully:", data);

      // Set the session_id received from the response
      const sessionId = data.session_id;
      setSessionId(sessionId); // Pass the session_id to the parent

      setUploadedFile(true);
      setIsFileSelected(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadedFile(false);
      setIsFileSelected(false);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  // Handle file change event and upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
      uploadFile(file);  // Call the uploadFile function when a file is selected
    } else {
      setUploadedFile(false);
      setIsFileSelected(false);
    }
  };

  // Handle sample file selection and trigger upload
  const handleSampleChange = async (value) => {
    const selectedSample = sampleFiles.find(sample => sample.file === value);
    if (selectedSample) {
      try {
        const response = await fetch(`/${selectedSample.file}`);
        if (!response.ok) throw new Error(`Failed to fetch file: ${selectedSample.file}`);

        const blob = await response.blob();
        const file = new File([blob], selectedSample.file, { type: "text/csv" });

        setSelectedFile(file);
        uploadFile(file);  // Trigger the file upload API for the sample
      } catch (error) {
        console.error("Error fetching sample file:", error);
        setUploadedFile(false);
        setIsFileSelected(false);
      }
    }
  };

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

        {/* Show loading spinner when the file is being uploaded */}
        {isLoading && (
          <div className="mt-4 text-center">
            <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
