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
      
    },
    {
      id: 2,
      category: "Landscape Modification",
      title: "Nature Landscape",
      thumbnail: "https://images.unsplash.com/photo-1602603884354-22631a727d07?w=80&h=300&fit=crop",
      fullImage: "https://images.unsplash.com/photo-1602603884354-22631a727d07?w=300&h=300&fit=crop",

    },
    {
      id: 3,
      category: "Object Manipulation",
      title: "Street Scene",
      thumbnail: "https://images.unsplash.com/photo-1599135577069-376c0afbe38f?w=300&h=300&fit=crop",
      fullImage: "https://images.unsplash.com/photo-1599135577069-376c0afbe38f?w=300&h=300&fit=crop",
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
                className="w-full max-h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover overlay with sample prompts */}
              
            </div>
            
            <div className="text-xs text-gray-500">Click to try this sample</div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
  )
}

export default SampleImages