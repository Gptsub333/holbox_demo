"use client";
import React from "react";
import {
  Upload,
  Camera,
  X,
  ZoomOut,
  ZoomIn,
  RotateCcw,
} from "lucide-react";

const ImageUpload = ({
  imagePreview,
  dragOver,
  clearImage,
  setZoom,
  zoom,
  handleFileSelect,
  setDragOver,
  videoPropmp
}) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // Normalize imagePreview (support File and URL string)
  const getPreviewSrc = () => {
    if (!imagePreview) return null;
    if (typeof imagePreview === "string") {
      return imagePreview; // sample image (URL)
    }
    return URL.createObjectURL(imagePreview); // uploaded file
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Selected Image</h2>

      {!imagePreview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? "border-purple-500 bg-purple-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop your image here or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports JPG, JPEG, PNG, WEBP, GIF up to 10MB
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
          >
            <Camera className="mr-2 h-4 w-4" />
            Choose File
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg border">
            <div
              className="w-full max-h-64 flex items-center justify-center"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center center",
              }}
            >
              <img
                src={getPreviewSrc()}
                alt="Preview"
                className="max-w-full max-h-64 object-contain rounded-lg"
              />
            </div>
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={clearImage}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Replace Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
