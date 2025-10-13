"use client";

import { Loader2, Wand2 } from "lucide-react";

export default function VideoResult({ videoUrl, isProcessing }) {
  if (isProcessing) {
    return (
      <div className="aspect-square w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-3" />
          <p className="text-base text-gray-500">Processing your edit...</p>
          <p className="text-sm text-gray-400 mt-1">
            This may take 10-30 seconds
          </p>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="aspect-square w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
            <Wand2 className="h-10 w-10 text-purple-500" />
          </div>
          <p className="text-base text-gray-500">
            Your video of image will appear here
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Upload an image and add editing instructions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h3 className="text-md font-semibold mb-3">Generated Video</h3>
      <video
        src={videoUrl}
        controls
        autoPlay
        loop
        className="w-full h-full rounded-lg shadow"
      />
    </div>
  );
}
