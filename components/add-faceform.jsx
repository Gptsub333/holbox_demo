// components/face-form/AddFaceForm.jsx
"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UploadArea } from "@/app/face-detection/_components/upload-area";
import ShowResult from "@/app/face-detection/_components/ShowResult";
import { useAuthContext } from "@/context/AuthContext";

export function AddFaceForm({
  onSuccess,
  onSubmit,
  showResultInline = true,
  apiEndpoint,
  compact = false,
  className = ""
}) {
  const { sessionToken } = useAuthContext();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [lastAddedFace, setLastAddedFace] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const BACKEND_URL = apiEndpoint || process.env.NEXT_PUBLIC_BACKEND_URL;

  // Handle file processing
  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Drag and drop handlers
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  // Form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }
    
    if (!name.trim()) {
      setError("Please enter a name to add the face.");
      return;
    }
    if (!age.trim()) {
      setError("Please enter age.");
      return;
    }
    if (!gender.trim()) {
      setError("Please select gender.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("name", name.trim().replace(/\s+/g, "_"));
    formData.append("age", age.trim());
    formData.append("gender", gender.trim());

    try {
      // If custom onSubmit prop is provided, use it
      if (onSubmit) {
        await onSubmit(formData);
        if (onSuccess) onSuccess(formData);
      } else {
        // Otherwise use default API call
        const res = await fetch(`${BACKEND_URL}/add_face`, {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": `Bearer ${sessionToken}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Failed to add face");
        }

        const addedFace = {
          name: name.trim(),
          age: age.trim(),
          gender: gender.trim(),
          imagePreview,
        };

        setLastAddedFace(addedFace);
        if (onSuccess) onSuccess(addedFace);
        
        if (showResultInline) {
          setShowResult(true);
        }

        // Reset form
        setImageFile(null);
        setImagePreview(null);
        setName("");
        setAge("");
        setGender("male");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the API.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setName("");
    setAge("");
    setGender("male");
    setError(null);
    setShowResult(false);
    setLastAddedFace(null);
  };

  if (showResultInline && showResult && lastAddedFace) {
    return (
      <ShowResult
        section="add"
        imagePreview={lastAddedFace.imagePreview}
        name={lastAddedFace.name}
        age={lastAddedFace.age}
        gender={lastAddedFace.gender}
        onClose={() => {
          setShowResult(false);
          resetForm();
        }}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {compact ? (
        // Compact version
        <form onSubmit={handleSubmit} className="space-y-3">
          <UploadArea
            imagePreview={imagePreview}
            isDragOver={isDragOver}
            onFileChange={processFile}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClearImage={() => { setImagePreview(null); setImageFile(null); }}
            compact={compact}
          />

          <div className="grid grid-cols-3 gap-2">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              aria-label="Name"
              className="text-sm"
            />
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              aria-label="Age"
              min="1"
              max="120"
              className="text-sm"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Gender"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {error && <div className="text-xs text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={isLoading || !imageFile || !name.trim() || !age.trim() || !gender.trim()}
            className={cn(
              "w-full py-2 rounded-lg font-semibold text-sm transition",
              isLoading ? "bg-blue-200 text-blue-50 cursor-wait" : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isLoading ? "Adding..." : "Add Face"}
          </button>
        </form>
      ) : (
        // Full version
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Face</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <UploadArea
                imagePreview={imagePreview}
                isDragOver={isDragOver}
                onFileChange={processFile}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClearImage={() => { setImagePreview(null); setImageFile(null); }}
              />

              <div className="space-y-3">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  aria-label="Name"
                />
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  aria-label="Age"
                  min="1"
                  max="120"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Gender"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {error && <div className="text-xs text-red-500">{error}</div>}

              <button
                type="submit"
                disabled={isLoading || !imageFile || !name.trim() || !age.trim() || !gender.trim()}
                className={cn(
                  "w-full py-2 rounded-xl font-semibold text-sm transition",
                  isLoading ? "bg-blue-200 text-blue-50 cursor-wait" : "bg-blue-600 text-white hover:bg-blue-700 shadow"
                )}
              >
                {isLoading ? "Adding..." : "Add Face"}
              </button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}