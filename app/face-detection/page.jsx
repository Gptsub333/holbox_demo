"use client";

// import { useState, useCallback } from "react";
// import { motion } from "framer-motion";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { UploadArea } from "./_components/upload-area";
// import { ActionButtons } from "./_components/action-buttons";
// import { ResponseDisplay } from "./_components/response-display";
// import { cn } from "@/lib/utils";
// import { ScanFace } from "lucide-react";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// async function addFaceAPI(formData) {
//   const res = await fetch(`${BACKEND_URL}/add_face`, {
//     method: "POST",
//     body: formData,
//   });
//   if (!res.ok)
//     throw new Error((await res.json()).detail || "Failed to add face");
//   return { success: true, data: await res.json() };
// }

// async function recognizeFaceAPI(formData) {
//   const res = await fetch(`${BACKEND_URL}/recognize_face`, {
//     method: "POST",
//     body: formData,
//   });
//   if (!res.ok)
//     throw new Error((await res.json()).detail || "Failed to recognize face");
//   return { success: true, data: await res.json() };
// }

// export default function FaceDetectionPage() {
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [name, setName] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiResponse, setApiResponse] = useState(null);
//   const [error, setError] = useState(null);
//   const [isDragOver, setIsDragOver] = useState(false);

//   const clearImagePreview = () => {
//     setImageFile(null);
//     setImagePreview(null);
//   };

//   const processFile = (file) => {
//     if (file && file.type.startsWith("image/")) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => { 
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//       setApiResponse(null);
//       setError(null);
//     } else {
//       setError("Please upload a valid image file.");
//       setImageFile(null);
//       setImagePreview(null);
//     }
//   };

//   const handleFileChange = useCallback(processFile, []);

//   const handleDragOver = useCallback((event) => {
//     event.preventDefault();
//     setIsDragOver(true);
//   }, []);

//   const handleDragLeave = useCallback(() => {
//     setIsDragOver(false);
//   }, []);

//   const handleDrop = useCallback((event) => {
//     event.preventDefault();
//     setIsDragOver(false);
//     const file = event.dataTransfer.files?.[0];
//     if (file) {
//       processFile(file);
//     }
//   }, []);

//   const handleSubmit = async (actionType) => {
//     if (!imageFile) {
//       setError("Please upload an image first.");
//       return;
//     }
//     if (actionType === "add" && !name.trim()) {
//       setError("Please enter a name to add the face.");
//       return;
//     }

//     setIsLoading(true);
//     setApiResponse(null);
//     setError(null);

//     const formData = new FormData();
//     formData.append("image", imageFile);
//     if (actionType === "add") {
//       formData.append("name", name.trim().replace(/\s+/g, "_"));
//     }

//     try {
//       let response;
//       if (actionType === "add") {
//         response = await addFaceAPI(formData);
//       } else {
//         response = await recognizeFaceAPI(formData);
//       }

//       if (response.success) {
//         setApiResponse(response.data);
//         if (
//           actionType === "add" &&
//           response.data.message?.includes("successfully")
//         ) {
//           setImageFile(null);
//           setImagePreview(null);
//           setName("");
//         }
//       } else {
//         setError(response.message || "An unknown error occurred.");
//       }
//     } catch (err) {
//       setError(err.message || "Failed to connect to the API.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 100 },
//     },
//   };

//   const isNameRequiredAndMissing = !!imageFile && !name.trim();

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         className="max-w-3xl mx-auto"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* === MODIFIED HEADER SECTION START === */}
//         <motion.div variants={itemVariants} className="mb-8">
//           {" "}
//           {/* Was text-center mb-10 */}
//           <div className="flex items-center space-x-3">
//             <ScanFace className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
//             <h1 className="text-3xl font-bold text-gray-800 heading-font">
//               AI Face Detection
//             </h1>
//           </div>
//           <p className="mt-2 text-base text-gray-600 para-font">
//             {" "}
//             {/* Was text-lg */}
//             Upload an image to add or recognize faces with our advanced AI.
//           </p>
//         </motion.div>
//         {/* === MODIFIED HEADER SECTION END === */}

//         <motion.div variants={itemVariants}>
//           <Card className="shadow-xl rounded-xl overflow-hidden">
//             <CardContent className="p-6 md:p-8 space-y-6">
//               <UploadArea
//                 onFileChange={handleFileChange}
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 imagePreview={imagePreview}
//                 isDragOver={isDragOver}
//                 onClearImage={clearImagePreview}
//               />

//               <div>
//                 <Input
//                   type="text"
//                   placeholder={"Enter name (for adding face)"}
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className={cn(
//                     "text-sm para-font rounded-lg focus-visible:ring-blue-500"
//                   )}
//                 />
//                 {isNameRequiredAndMissing && (
//                   <p className="text-xs text-blue-600 mt-1.5 para-font px-1">
//                     Adding a new face name is required!!
//                   </p>
//                 )}
//               </div>

//               <ActionButtons
//                 onAddFace={() => handleSubmit("add")}
//                 onRecognizeFace={() => handleSubmit("recognize")}
//                 isLoading={isLoading}
//                 isImageUploaded={!!imageFile}
//                 isNameEntered={!!name.trim()}
//               />
//             </CardContent>
//           </Card>
//         </motion.div>

//         <ResponseDisplay
//           apiResponse={apiResponse}
//           error={error}
//           imagePreview={imagePreview}
//         />
//       </motion.div>
//     </div>
//   );
// }

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScanFace } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadArea } from "./_components/upload-area";
import ShowResult from "./_components/ShowResult";

// You can swap this for process.env.NEXT_PUBLIC_BACKEND_URL in production
// const BACKEND_URL = "http://localhost:8000/api/demo_backend_v2";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function addFaceAPI(formData) {
  const res = await fetch(`${BACKEND_URL}/add_face`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok)
    throw new Error((await res.json()).detail || "Failed to add face");
  return { success: true };
}

async function recognizeFaceAPI(formData) {
  const res = await fetch(`${BACKEND_URL}/recognize_face`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok)
    throw new Error((await res.json()).detail || "Failed to recognize face");
  return { success: true, data: await res.json() };
}

export default function FaceDetectionPage() {
  // UI and Form State
  const [section, setSection] = useState("add");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Result State
  const [lastAddedFace, setLastAddedFace] = useState(null); // For add result
  const [apiResponse, setApiResponse] = useState(null);     // For recognize result
  const [showResult, setShowResult] = useState(false);

  // Drag-and-drop helpers
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle file selection and preview
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

  // Drag and drop events
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

  // Unified form submit handler
  const handleSubmit = async (actionType) => {
    setError(null);

    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }
    if (actionType === "add") {
      if (!name.trim()) return setError("Please enter a name to add the face.");
      if (!age.trim()) return setError("Please enter age.");
      if (!gender.trim()) return setError("Please select gender.");
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", imageFile);
    if (actionType === "add") {
      formData.append("name", name.trim().replace(/\s+/g, "_"));
      formData.append("age", age.trim());
      formData.append("gender", gender.trim());
    }

    try {
      if (actionType === "add") {
        const response = await addFaceAPI(formData);
        if (response.success) {
          setLastAddedFace({
            name: name.trim(),
            age: age.trim(),
            gender: gender.trim(),
            imagePreview,
          });
          setShowResult(true);
          // Clear input fields
          setImageFile(null);
          setImagePreview(null);
          setName("");
          setAge("");
          setGender("male");
        }
      } else {
        const response = await recognizeFaceAPI(formData);
        if (response.success) {
          setApiResponse(response.data);
          setShowResult(true);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the API.");
    } finally {
      setIsLoading(false);
    }
  };

  // Section toggle resets result state
  const handleSectionChange = (newSection) => {
    setSection(newSection);
    setShowResult(false);
    setError(null);
    setApiResponse(null);
    setLastAddedFace(null);
  };

  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center space-x-3">
            <ScanFace className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold text-gray-800 heading-font">AI Face Detection</h1>
          </div>
          <p className="mt-2 text-base text-gray-600 para-font">
            Upload an image to add or recognize faces with our advanced AI.
          </p>
        </motion.div>

        <SectionToggle current={section} onChange={handleSectionChange} />

        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-5">
            {/* Show result if available, only in respective section */}
            {showResult && section === "add" && lastAddedFace && (
              <ShowResult
                section="add"
                imagePreview={lastAddedFace.imagePreview}
                name={lastAddedFace.name}
                age={lastAddedFace.age}
                gender={lastAddedFace.gender}
                onClose={() => setShowResult(false)}
              />
            )}
            {showResult && section === "recognize" && apiResponse && (
              <ShowResult
                section="recognize"
                imagePreview={imagePreview}
                apiResponse={apiResponse}
                onClose={() => setShowResult(false)}
              />
            )}
            {/* Form */}
            {!showResult && (
              <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <UploadArea
                  imagePreview={imagePreview}
                  isDragOver={isDragOver}
                  onFileChange={processFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClearImage={() => { setImagePreview(null); setImageFile(null); }}
                />

                {section === "add" && (
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
                )}

                {error && <div className="text-xs text-red-500">{error}</div>}

                <button
                  type="button"
                  onClick={() => handleSubmit(section)}
                  disabled={isLoading || !imageFile || (section === "add" && (!name.trim() || !age.trim() || !gender.trim()))}
                  className={cn(
                    "w-full py-2 rounded-xl font-semibold text-sm transition",
                    isLoading ? "bg-blue-200 text-blue-50 cursor-wait" : "bg-blue-600 text-white hover:bg-blue-700 shadow"
                  )}
                >
                  {section === "add"
                    ? isLoading ? "Adding..." : "Add Face"
                    : isLoading ? "Recognizing..." : "Recognize Face"}
                </button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function SectionToggle({ current, onChange }) {
  return (
    <div className="flex w-full bg-gray-100 rounded-lg overflow-hidden my-4">
      {["add", "recognize"].map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={cn(
            "w-1/2 py-2 text-center font-medium text-base transition",
            current === type ? "bg-white text-blue-600 shadow-sm" : "bg-gray-100 text-gray-400 hover:text-blue-600"
          )}
          style={{
            borderBottom: current === type ? "2px solid #2564eb" : "none",
            fontWeight: 600,
          }}
          aria-pressed={current === type}
        >
          {type === "add" ? "Add Face" : "Recognize Face"}
        </button>
      ))}
    </div>
  );
}
