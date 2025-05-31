import { motion } from "framer-motion";
import { 
  Camera, 
  Upload, 
  Shirt, 
  User, 
  RefreshCcw, 
  X, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";

export default function UploadSection({
  modelImage,
  garmentImage,
  modelImagePreview,
  garmentImagePreview,
  modelInputRef,
  garmentInputRef,
  isProcessing,
  progress,
  status,
  onModelUpload,
  onGarmentUpload,
  onRemoveModel,
  onRemoveGarment,
  onProcess
}) {
  const getStatusColor = () => {
    switch (status) {
      case "completed": return "text-green-600";
      case "failed": return "text-red-600";
      case "processing": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "failed": return <AlertTriangle className="h-4 w-4" />;
      case "processing": return <Clock className="h-4 w-4 animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upload & Try-On</h2>
            <p className="text-sm text-gray-600">Upload your images or use samples</p>
          </div>
        </div>
        
        {status && (
          <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="capitalize font-medium">{status}</span>
          </div>
        )}
      </div>

      {/* Upload Areas */}
      <div className="space-y-6 mb-6">
        {/* Model Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Model Image
          </label>
          <div className="relative">
            {modelImagePreview ? (
              <motion.div
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-48 rounded-xl border-2 border-dashed border-purple-200 overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center relative">
                  <img
                    src={modelImagePreview}
                    alt="Model preview"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl"></div>
                </div>
                <motion.button
                  onClick={onRemoveModel}
                  className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                onClick={() => modelInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-3 group-hover:from-purple-200 group-hover:to-blue-200 transition-colors">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Upload Model Image
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG up to 10MB
                </p>
              </motion.div>
            )}
            <input
              ref={modelInputRef}
              type="file"
              accept="image/*"
              onChange={onModelUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Garment Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Garment Image
          </label>
          <div className="relative">
            {garmentImagePreview ? (
              <motion.div
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-48 rounded-xl border-2 border-dashed border-blue-200 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
                  <img
                    src={garmentImagePreview}
                    alt="Garment preview"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl"></div>
                </div>
                <motion.button
                  onClick={onRemoveGarment}
                  className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                onClick={() => garmentInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-3 group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                  <Shirt className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Upload Garment Image
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG up to 10MB
                </p>
              </motion.div>
            )}
            <input
              ref={garmentInputRef}
              type="file"
              accept="image/*"
              onChange={onGarmentUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Progress Bar (shown during processing) */}
      {isProcessing && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Processing...</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </motion.div>
      )}

      {/* Generate Button */}
      <motion.button
        onClick={onProcess}
        disabled={!modelImage || !garmentImage || isProcessing}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
        whileHover={{ scale: isProcessing ? 1 : 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {isProcessing ? (
          <>
            <RefreshCcw className="h-5 w-5 animate-spin" />
            <span>Generating Magic...</span>
          </>
        ) : (
          <>
            <Zap className="h-5 w-5" />
            <span>Generate Virtual Try-On</span>
          </>
        )}
      </motion.button>

      {/* Tips */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start space-x-3">
          <div className="p-1 bg-purple-200 rounded-full flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-3 w-3 text-purple-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-1">
              💡 Pro Tips
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Use well-lit, clear images for best results</li>
              <li>• Model should face forward with arms at sides</li>
              <li>• Garment should be displayed flat or on hanger</li>
              <li>• Processing takes 30-60 seconds</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}