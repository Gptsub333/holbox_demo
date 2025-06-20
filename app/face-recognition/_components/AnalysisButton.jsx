import { motion } from "framer-motion"
import { Search, Loader2 } from "lucide-react"

export default function AnalysisButton({ selectedVideo, currentTime, onAnalyze, isLoading, recognitionElapsed }) {
  const handleAnalyze = () => {
    if (selectedVideo && !isLoading) {
      onAnalyze(currentTime)
    }
  }

  return (
    <motion.div
      className="flex justify-center mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.button
        onClick={handleAnalyze}
        disabled={!selectedVideo || isLoading}
        className={`
          px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center space-x-2 shadow-sm
          ${
            selectedVideo && !isLoading
              ? "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          }
        `}
        whileHover={selectedVideo && !isLoading ? { scale: 1.02, y: -1 } : {}}
        whileTap={selectedVideo && !isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing...</span>
            <span className="ml-2">{recognitionElapsed}s</span>
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            <span>Analyze Video</span>
          </>
        )}
      </motion.button>
    </motion.div>
  )
}
