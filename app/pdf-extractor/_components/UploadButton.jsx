"use client";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

const UploadButton = ({ onClick }) => {
  return (
    <div className="fixed top-[calc(5rem)] right-10 flex flex-col items-end space-y-4">
      <motion.button
        onClick={onClick}
        className="flex items-center space-x-1 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Upload Audio"
        style={{
          transform: "none",
          position: "relative",
          left: "-28px", // Move button 28px to the left
          padding: "7px 17px", // Adjust padding
        }}
      >
        <Upload className="w-5 h-5" /> {/* Smaller icon */} 
        <span className="text-xs font-medium">Upload PDF</span>{" "}
        {/* Smaller text */}
      </motion.button>
    </div>
  );
};

export default UploadButton;
