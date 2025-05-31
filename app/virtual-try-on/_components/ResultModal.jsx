import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Download, 
  Share2, 
  Heart, 
  RefreshCcw,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Eye
} from "lucide-react";

export default function ResultModal({ 
  isOpen, 
  onClose, 
  result, 
  isProcessing, 
  progress, 
  status 
}) {
  const handleDownload = async () => {
    if (!result) return;

    try {
      const response = await fetch(result);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `virtual-tryon-result-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      window.open(result, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: 'My Virtual Try-On Result',
          text: 'Check out my AI-generated virtual try-on!',
          url: result
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Virtual Try-On Result
                </h2>
                <p className="text-sm text-gray-600">
                  {status === 'completed' ? 'Your AI-generated look is ready!' : 'Processing your virtual try-on...'}
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-5 w-5 text-gray-500" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isProcessing || status === 'processing' ? (
              /* Processing State */
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="relative mb-6">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center"
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                  >
                    <RefreshCcw className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  {/* Animated rings */}
                  <motion.div
                    className="absolute inset-0 border-4 border-purple-200 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 border-4 border-blue-200 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Creating Your Perfect Look
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI is working its magic to generate your virtual try-on...
                </p>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Processing</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Processing Steps */}
                <div className="mt-8 max-w-sm mx-auto">
                  <div className="space-y-3">
                    {[
                      { step: "Analyzing model pose", completed: progress > 20 },
                      { step: "Processing garment details", completed: progress > 50 },
                      { step: "Generating virtual fit", completed: progress > 80 },
                      { step: "Finalizing result", completed: progress > 95 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          item.completed 
                            ? 'bg-green-500' 
                            : progress > (index + 1) * 20 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300'
                        }`}>
                          {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <span className={`text-sm ${
                          item.completed ? 'text-green-600 font-medium' : 'text-gray-600'
                        }`}>
                          {item.step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : status === 'failed' ? (
              /* Error State */
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Processing Failed
                </h3>
                <p className="text-gray-600 mb-6">
                  We encountered an issue while processing your try-on. Please try again with different images.
                </p>
                <button
                  onClick={onClose}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : result ? (
              /* Success State */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Result Image */}
                <div className="lg:col-span-2">
                  <motion.div
                    className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <img
                      src={result}
                      alt="Virtual try-on result"
                      className="w-full h-auto max-h-96 object-contain mx-auto"
                    />
                    
                    {/* Image overlay with view button */}
                    <div className="absolute top-4 right-4">
                      <motion.button
                        className="p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/30 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => window.open(result, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                {/* Actions Panel */}
                <div className="space-y-4">
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Success!</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your virtual try-on has been generated successfully.
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      onClick={handleDownload}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Download className="h-5 w-5" />
                      <span>Download Result</span>
                    </motion.button>

                  </div>

                 
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}