import React from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, Wand2 } from 'lucide-react';

const ImageResult = ({ editedImage, imagePreview, isProcessing }) => {
  // Handle download
  const handleDownload = () => {
    if (!editedImage) return;

    const link = document.createElement('a');
    link.href = editedImage;
    link.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <motion.div
      className="lg:col-span-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">{editedImage ? 'Before & After' : 'Results'}</h3>
        </div>

        <div className="p-6">
          {editedImage ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Original</div>
                  <img
                    src={imagePreview}
                    alt="Original"
                    className="w-full aspect-square object-cover rounded-lg border"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Edited</div>
                  <img src={editedImage} alt="Edited" className="w-full aspect-square object-cover rounded-lg border" />
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
                <p className="text-base text-gray-500">Processing your edit...</p>
                <p className="text-sm text-gray-400 mt-1">This may take 10-30 seconds</p>
              </div>
            </div>
          ) : (
            <div className="aspect-square w-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                  <Wand2 className="h-10 w-10 text-purple-500" />
                </div>
                <p className="text-base text-gray-500">Your edited image will appear here</p>
                <p className="text-sm text-gray-400 mt-2">Upload an image and add editing instructions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ImageResult;
