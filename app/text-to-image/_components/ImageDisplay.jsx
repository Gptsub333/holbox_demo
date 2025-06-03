"use client"

import { motion } from "framer-motion"
import { Download, Loader2, Wand2 } from "lucide-react"

export function ImageDisplay({ generatedImages = [], isGenerating }) {
  // Download function
  const handleDownload = async (imageUrl) => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;  // You can modify this for different formats
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-xl font-semibold subheading-font text-gray-800">Generated Image</h3>
      </div>

      <div className="p-6">
        <div className="aspect-square w-full bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden shadow-inner">
          {isGenerating ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full w-full"
            >
              <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-3" />
              <p className="text-base text-gray-500 para-font">Creating your masterpiece...</p>
            </motion.div>
          ) : generatedImages.length > 0 ? (
            generatedImages.map((generatedImage, index) => (
              <motion.div
                key={index}
                className="relative w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={generatedImage}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))
          ) : (
            <div className="text-center p-8 h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Wand2 className="h-10 w-10 text-purple-500" />
              </div>
              <p className="text-base text-gray-500 para-font">Your generated image will appear here</p>
              <p className="text-sm text-gray-400 para-font mt-2">Enter a prompt and click Generate</p>
            </div>
          )}
        </div>

        {generatedImages.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500 para-font">AI-generated images</span>
            {generatedImages.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => handleDownload(imageUrl)}  // Download on button click
                className="flex items-center justify-center h-9 w-9 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors duration-200"
                aria-label="Download image"
                title="Download image"
              >
                <Download className="h-4 w-4 text-purple-700" />
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
