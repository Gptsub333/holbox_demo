<<<<<<< HEAD
"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { UploadArea } from "./_components/upload-area"
import { ActionButtons } from "./_components/action-buttons"
import { ResponseDisplay } from "./_components/response-display"
import { cn } from "@/lib/utils"
import { ScanFace } from "lucide-react"

=======
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UploadArea } from "./_components/upload-area";
import { ActionButtons } from "./_components/action-buttons";
import { ResponseDisplay } from "./_components/response-display";
import { cn } from "@/lib/utils";
import { ScanFace } from "lucide-react";
>>>>>>> origin/main

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function addFaceAPI(formData) {
  const res = await fetch(`${BACKEND_URL}/add_face`, {
    method: "POST",
    body: formData,
  });
<<<<<<< HEAD
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to add face");
=======
  if (!res.ok)
    throw new Error((await res.json()).detail || "Failed to add face");
>>>>>>> origin/main
  return { success: true, data: await res.json() };
}

async function recognizeFaceAPI(formData) {
  const res = await fetch(`${BACKEND_URL}/recognize_face`, {
    method: "POST",
    body: formData,
  });
<<<<<<< HEAD
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to recognize face");
=======
  if (!res.ok)
    throw new Error((await res.json()).detail || "Failed to recognize face");
>>>>>>> origin/main
  return { success: true, data: await res.json() };
}

export default function FaceDetectionPage() {
<<<<<<< HEAD
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const [error, setError] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const clearImagePreview = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setApiResponse(null)
      setError(null)
    } else {
      setError("Please upload a valid image file.")
      setImageFile(null)
      setImagePreview(null)
    }
  }

  const handleFileChange = useCallback(processFile, [])

  const handleDragOver = useCallback((event) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((event) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [])

  const handleSubmit = async (actionType) => {
    if (!imageFile) {
      setError("Please upload an image first.")
      return
    }
    if (actionType === "add" && !name.trim()) {
      setError("Please enter a name to add the face.")
      return
    }

    setIsLoading(true)
    setApiResponse(null)
    setError(null)

    const formData = new FormData()
    formData.append("image", imageFile)
    if (actionType === "add") {
      formData.append("name", name.trim().replace(/\s+/g, "_"))
    }

    try {
      let response
      if (actionType === "add") {
        response = await addFaceAPI(formData)
      } else {
        response = await recognizeFaceAPI(formData)
      }

      if (response.success) {
        setApiResponse(response.data)
        if (actionType === "add" && response.data.message?.includes("successfully")) {
          setImageFile(null)
          setImagePreview(null)
          setName("")
        }
      } else {
        setError(response.message || "An unknown error occurred.")
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the API.")
    } finally {
      setIsLoading(false)
    }
  }
=======
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const clearImagePreview = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setApiResponse(null);
      setError(null);
    } else {
      setError("Please upload a valid image file.");
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleFileChange = useCallback(processFile, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleSubmit = async (actionType) => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }
    if (actionType === "add" && !name.trim()) {
      setError("Please enter a name to add the face.");
      return;
    }

    setIsLoading(true);
    setApiResponse(null);
    setError(null);

    const formData = new FormData();
    formData.append("image", imageFile);
    if (actionType === "add") {
      formData.append("name", name.trim().replace(/\s+/g, "_"));
    }

    try {
      let response;
      if (actionType === "add") {
        response = await addFaceAPI(formData);
      } else {
        response = await recognizeFaceAPI(formData);
      }

      if (response.success) {
        setApiResponse(response.data);
        if (
          actionType === "add" &&
          response.data.message?.includes("successfully")
        ) {
          setImageFile(null);
          setImagePreview(null);
          setName("");
        }
      } else {
        setError(response.message || "An unknown error occurred.");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the API.");
    } finally {
      setIsLoading(false);
    }
  };
>>>>>>> origin/main

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
<<<<<<< HEAD
  }
=======
  };
>>>>>>> origin/main

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
<<<<<<< HEAD
  }

  const isNameRequiredAndMissing = !!imageFile && !name.trim()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-3xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
=======
  };

  const isNameRequiredAndMissing = !!imageFile && !name.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
>>>>>>> origin/main
        {/* === MODIFIED HEADER SECTION START === */}
        <motion.div variants={itemVariants} className="mb-8">
          {" "}
          {/* Was text-center mb-10 */}
          <div className="flex items-center space-x-3">
            <ScanFace className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
<<<<<<< HEAD
            <h1 className="text-3xl font-bold text-gray-800 heading-font">AI Face Detection</h1>
=======
            <h1 className="text-3xl font-bold text-gray-800 heading-font">
              AI Face Detection
            </h1>
>>>>>>> origin/main
          </div>
          <p className="mt-2 text-base text-gray-600 para-font">
            {" "}
            {/* Was text-lg */}
            Upload an image to add or recognize faces with our advanced AI.
          </p>
        </motion.div>
        {/* === MODIFIED HEADER SECTION END === */}

        <motion.div variants={itemVariants}>
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <UploadArea
                onFileChange={handleFileChange}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                imagePreview={imagePreview}
                isDragOver={isDragOver}
                onClearImage={clearImagePreview}
              />

              <div>
                <Input
                  type="text"
<<<<<<< HEAD
                  placeholder={
                    isNameRequiredAndMissing ? "Name is required to add face" : "Enter name (for adding face)"
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "text-sm para-font rounded-lg focus-visible:ring-blue-500",
                    isNameRequiredAndMissing &&
                      "border-red-500 placeholder-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
                  )}
                />
                {isNameRequiredAndMissing && (
                  <p className="text-xs text-red-600 mt-1.5 para-font px-1">
                    Please enter a name to enable the "Add Face" button.
=======
                  placeholder={"Enter name (for adding face)"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "text-sm para-font rounded-lg focus-visible:ring-blue-500"
                  )}
                />
                {isNameRequiredAndMissing && (
                  <p className="text-xs text-blue-600 mt-1.5 para-font px-1">
                    Adding a new face name is required!!
>>>>>>> origin/main
                  </p>
                )}
              </div>

              <ActionButtons
                onAddFace={() => handleSubmit("add")}
                onRecognizeFace={() => handleSubmit("recognize")}
                isLoading={isLoading}
                isImageUploaded={!!imageFile}
                isNameEntered={!!name.trim()}
              />
            </CardContent>
          </Card>
        </motion.div>

<<<<<<< HEAD
        <ResponseDisplay apiResponse={apiResponse} error={error} imagePreview={imagePreview} />
      </motion.div>
    </div>
  )
=======
        <ResponseDisplay
          apiResponse={apiResponse}
          error={error}
          imagePreview={imagePreview}
        />
      </motion.div>
    </div>
  );
>>>>>>> origin/main
}
