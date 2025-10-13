"use client";
import { useState } from "react";
import { Header } from "./_components/Header";
import SampleImages from "./_components/SampleImages";
import ImageUpload from "./_components/ImageUpload";
import VideoResult from "./_components/VideoResult";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function GenerateVideoPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("720p");
  const [videoUrl, setVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSampleSelect = (sample) => {
    setSelectedImage(sample);
    setImagePreview(sample.fullImage);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrompt("");
    setNegativePrompt("");
    setAspectRatio("16:9");
    setResolution("720p");
    setVideoUrl(null);
    setError(null);
  };

  const handleGenerateVideo = async () => {
    if (!selectedImage) {
      setError("Please upload or choose an image");
      return;
    }

    setIsProcessing(true);
    setVideoUrl(null);
    setError(null);

    try {
      const fd = new FormData();

      // Handle image upload
      if (selectedImage instanceof File) {
        fd.append("image_path", selectedImage);
      } else {
        const response = await fetch(selectedImage.fullImage);
        const blob = await response.blob();
        const file = new File([blob], "sample.jpg", { type: blob.type || "image/jpeg" });
        fd.append("image_path", file);
      }

      if (prompt) fd.append("prompt", prompt);
      if (negativePrompt) fd.append("negative_prompt", negativePrompt);
      if (aspectRatio) fd.append("aspect_ratio", aspectRatio);
      if (resolution) fd.append("resolution", resolution);

      const resp = await fetch(`${BACKEND_URL}/generate_video`, {
        method: "POST",
        body: fd,
      });

      if (!resp.ok) throw new Error("Video generation failed");

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (err) {
      console.error(err);
      setError(`Video generation failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header title="Generate Video from Image" />

        <SampleImages handleSampleSelect={handleSampleSelect} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Left - Upload + Generate */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <ImageUpload
              imagePreview={imagePreview}
              handleFileSelect={handleFileSelect}
              clearImage={clearImage}
            />

            <textarea
              placeholder="Enter your video prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />

            <textarea
              placeholder="Enter negative prompt (optional)"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />

            <div className="flex gap-2">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 flex-1"
              >
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="1:1">1:1</option>
              </select>

              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 flex-1"
              >
                <option value="480p">480p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              onClick={handleGenerateVideo}
              disabled={isProcessing || !selectedImage}
              className={`w-full px-4 py-2 rounded-lg text-white ${
                isProcessing || !selectedImage
                  ? "bg-gray-400"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isProcessing ? "Generating..." : "Generate Video"}
            </button>
          </div>

          {/* Right - Video Output */}
          <VideoResult videoUrl={videoUrl} isProcessing={isProcessing} />
        </div>
      </div>
    </div>
  );
}
