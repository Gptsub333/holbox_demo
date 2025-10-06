"use client";

import { Video } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.div
      className="flex flex-col items-start text-left mb-12 pt-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon + Title Row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
          <Video className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
          Generate Video
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">
        Create a video from an image using a text prompt. Customize aspect ratio, resolution, and optionally exclude unwanted content.
      </p>
    </motion.div>
  );
}
