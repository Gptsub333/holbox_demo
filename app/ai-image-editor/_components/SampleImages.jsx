import React from 'react'
import { motion } from "framer-motion"


// Sample images with editing prompts
const sampleImages = [
    {
      id: 1,
      category: "Portrait Enhancement",
      title: "Professional Headshot",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      fullImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face",
      prompts: [
        "Enhance the lighting and make the background more professional",
        "Add a subtle smile to the person's face",
        "Change the background to a modern office setting"
      ]
    },
    {
      id: 2,
      category: "Landscape Modification",
      title: "Nature Landscape",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
      fullImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      prompts: [
        "Add dramatic clouds to the sky",
        "Change the season to autumn with colorful leaves",
        "Add a rainbow after the storm"
      ]
    },
    {
      id: 3,
      category: "Object Manipulation",
      title: "Street Scene",
      thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
      fullImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=800&fit=crop",
      prompts: [
        "Remove the car from the street",
        "Add a cat sitting on the windowsill",
        "Change the wall color to warm beige"
      ]
    }
  ];

const SampleImages = ({ handleSampleSelect }) => {
  return (
    <motion.div
    className="mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Try Sample Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleImages.map((sample) => (
          <div
            key={sample.id}
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-purple-300 group relative"
            onClick={() => handleSampleSelect(sample)}
          >
            <div className="relative overflow-hidden rounded-md mb-3 aspect-square">
              <img
                src={sample.thumbnail}
                alt={sample.title}
                className="w-full h-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover overlay with sample prompts */}
              <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-3">
                <div className="text-white text-xs font-semibold mb-2">Sample Prompts:</div>
                <div className="space-y-1">
                  {sample.prompts.map((prompt, index) => (
                    <div key={index} className="text-white text-xs leading-relaxed">
                      • {prompt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-xs font-medium text-purple-600 mb-1">{sample.category}</div>
            <div className="text-sm font-medium text-gray-800 mb-2">{sample.title}</div>
            <div className="text-xs text-gray-500">Click to try this sample</div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
  )
}

export default SampleImages