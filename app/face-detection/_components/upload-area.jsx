"use client"

// import { UploadCloud, XCircle } from "lucide-react"
// import { motion } from "framer-motion"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"

// export function UploadArea({ onFileChange, onDrop, onDragOver, onDragLeave, imagePreview, isDragOver, onClearImage }) {
// const handleInputChange = (event) => {
//   const file = event.target.files?.[0];
//   if (file) {
//     onFileChange(file); // This calls processFile in page.jsx
//   }
//   // Reset the input value to allow re-uploading the same file
//   // and ensure onChange fires for subsequent identical selections or any new selection.
//   if (event.target) {
//     event.target.value = null; // Corrected line (removed the 'ßß')
//   }
// }


//   return (
//     <div
//       className={cn(
//         "relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300 bg-white min-h-[200px] flex flex-col justify-center items-center",
//         isDragOver && "border-blue-600 bg-blue-50",
//       )}
//       onDragOver={onDragOver}
//       onDragLeave={onDragLeave}
//       onDrop={onDrop}
//       onClick={() => !imagePreview && document.getElementById("fileUploadInput")?.click()}
//     >
//       <input type="file" id="fileUploadInput" accept="image/*" onChange={handleInputChange} className="hidden" />
//       {imagePreview ? (
//         <motion.div
//           className="w-full h-full flex flex-col items-center justify-center"
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.9 }}
//         >
//           <img
//             src={imagePreview || "/placeholder.svg"}
//             alt="Uploaded preview"
//             className="max-h-48 w-auto object-contain rounded-md shadow-sm"
//           />
//           <Button
//             variant="ghost"
//             size="sm"
//             className="mt-3 text-red-500 hover:text-red-700 hover:bg-red-100"
//             onClick={(e) => {
//               e.stopPropagation() // Prevent triggering file input click
//               onClearImage()
//             }}
//           >
//             <XCircle className="mr-2 h-4 w-4" />
//             Clear Image
//           </Button>
//         </motion.div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex flex-col items-center justify-center"
//         >
//           <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
//           <p className="mt-3 text-sm text-gray-600 para-font">
//             <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
//           </p>
//           <p className="text-xs text-gray-500 para-font mt-1">PNG, JPG, GIF up to 10MB</p>
//         </motion.div>
//       )}
//     </div>
//   )
// }
"use client";
import { UploadCloud, XCircle, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Dynamically import react-webcam for desktop webcam capture
const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

export function UploadArea({
  onFileChange,
  onDrop,
  onDragOver,
  onDragLeave,
  imagePreview,
  isDragOver,
  onClearImage,
}) {
  const fileInputRef = useRef();
  const captureInputRef = useRef();
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);

  // Always stable and correct input handler
  const handleInputChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) onFileChange(file);
      event.target.value = ""; // Allow re-uploads of the same file
    },
    [onFileChange]
  );

  // Device check for mobile browsers
  const isMobile =
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // File picker for gallery upload
  const handleFileClick = useCallback((e) => {
    e?.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  // Camera input for "Take Photo" (mobile)
  const handleMobileCapture = useCallback((e) => {
    e?.stopPropagation();
    captureInputRef.current?.click();
  }, []);

  // Webcam modal for "Take Photo" (desktop)
  const handleDesktopCapture = useCallback((e) => {
    e?.stopPropagation();
    setShowWebcam(true);
  }, []);

  // Capture from webcam
  const handleCapturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
        onFileChange(file);
        setShowWebcam(false);
      });
  }, [onFileChange]);

  return (
    <div
      className={cn(
        "relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300 bg-white min-h-[200px] flex flex-col justify-center items-center",
        isDragOver && "border-blue-600 bg-blue-50"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => {
        if (!imagePreview) fileInputRef.current?.click();
      }}
      tabIndex={0}
      role="button"
      aria-label="Upload Image"
    >
      {/* File picker for gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        tabIndex={-1}
      />
      {/* Camera input for mobile */}
      <input
        ref={captureInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
        tabIndex={-1}
      />
      {/* Webcam Modal for desktop */}
            {showWebcam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={e => e.stopPropagation()} // <-- Prevent click bubbling to upload area
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center relative"
            onClick={e => e.stopPropagation()} // Also on modal content
          >
            <button
              className="absolute top-3 right-3"
              onClick={() => setShowWebcam(false)}
              tabIndex={0}
            >
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
              className="rounded-lg shadow"
            />
            <Button
              onClick={handleCapturePhoto}
              className="mt-4 bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture Photo
            </Button>
          </div>
        </div>
      )}

      {imagePreview ? (
        <motion.div
          className="w-full h-full flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <img
            src={imagePreview || "/placeholder.svg"}
            alt="Uploaded preview"
            className="max-h-48 w-auto object-contain rounded-md shadow-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 text-red-500 hover:text-red-700 hover:bg-red-100"
            onClick={(e) => {
              e.stopPropagation();
              onClearImage();
            }}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Clear Image
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-3"
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <p className="mt-3 text-sm text-gray-600 para-font">
            <span
              onClick={handleFileClick}
              className="font-semibold text-blue-600 cursor-pointer"
            >
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500 para-font">PNG, JPG, GIF up to 10MB</p>
          <div className="flex space-x-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={(e) => {
                isMobile ? handleMobileCapture(e) : handleDesktopCapture(e);
              }}
            >
              <Camera className="w-4 h-4 mr-1" />
              Take Photo
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
