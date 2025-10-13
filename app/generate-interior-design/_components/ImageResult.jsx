import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Wand2, X } from "lucide-react"; // <-- Add X here

const ImageResult = ({ editedImage, imagePreview, isProcessing }) => {
  // State for modal visibility and zoom level
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Handle download
  const handleDownload = () => {
    if (!editedImage) return;

    const link = document.createElement("a");
    link.href = editedImage;
    link.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open modal
  const openModal = () => setIsModalOpen(true);

  // Close modal
  const closeModal = () => setIsModalOpen(false);

  // Zoom in and out
  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));

  return (
    <motion.div
      className="lg:col-span-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            {editedImage ? "Before & After" : "Results"}
          </h3>
        </div>

        <div className="p-6">
          {editedImage ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Original
                  </div>
                  <img
                    src={imagePreview}
                    alt="Original"
                    className="w-full aspect-square object-cover rounded-lg border"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Edited
                  </div>
                  <img
                    src={editedImage}
                    alt="Edited"
                    className="w-full aspect-square object-cover rounded-lg border cursor-pointer"
                    onClick={openModal} // Open modal on click
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Edited Image
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            <div className="aspect-square w-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-3" />
                <p className="text-base text-gray-500">
                  Processing your edit...
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  This may take 10-30 seconds
                </p>
              </div>
            </div>
          ) : (
            <div className="aspect-square w-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                  <Wand2 className="h-10 w-10 text-purple-500" />
                </div>
                <p className="text-base text-gray-500">
                  Your edited image will appear here
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Upload an image and add editing instructions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for image preview */}
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal} // Close modal when clicking outside the image
        >
          <div
            className="relative bg-white p-6 max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex justify-center mb-4">
              <img
                src={editedImage}
                alt="Zoomed"
                className="max-w-full max-h-96 object-contain"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "center center",
                }}
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={zoomOut}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Zoom Out
              </button>
              <button
                onClick={zoomIn}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Zoom In
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ImageResult;
