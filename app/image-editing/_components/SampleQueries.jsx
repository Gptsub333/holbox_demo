"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sampleQueries = [
  "Change the background to a sunset beach scene",
  "Make the person smile more naturally",
  "Add a vintage film effect with warm tones",
  "Remove the background and make it transparent",
  "Convert to black and white with high contrast",
  "Add dramatic lighting and shadows",
  "Change the color of the car to bright red",
  "Add a professional headshot background",
  "Make the image look like a painting",
  "Add a subtle blur effect to the background",
  "Enhance the colors to be more vibrant",
  "Add a vintage sepia tone effect"
]

export function SampleQueries({ onSelect }) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-semibold mb-4 subheading-font">Sample Edit Descriptions</h3>
      <p className="text-sm text-gray-600 mb-4 para-font">
        Click on any of these examples to get started, or create your own description
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sampleQueries.map((query, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Button
              variant="ghost"
              onClick={() => onSelect(query)}
              className={cn(
                "w-full text-left justify-start p-3 h-auto",
                "text-sm text-gray-700 hover:text-blue-600",
                "hover:bg-blue-50 border border-transparent hover:border-blue-200",
                "transition-all duration-200 para-font"
              )}
            >
              <span className="line-clamp-2">{query}</span>
            </Button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700 para-font">
          <strong>Tip:</strong> Be specific about what you want to change. The more detailed your description, the better the results will be.
        </p>
      </div>
    </motion.div>
  )
}
