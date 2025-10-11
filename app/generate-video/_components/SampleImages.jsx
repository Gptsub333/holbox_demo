"use client";
import { motion } from "framer-motion";

const sampleImages = [
  {
    id: 1,
    category: "Living Room",
    title: "Modern Living Room",
    thumbnail:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=600&q=80",
    fullImage:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=80",
    prompts: ["generate cinematic pan video of a modern living room"],
  },
  {
    id: 2,
    category: "Nature",
    title: "Forest Landscape",
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    fullImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    prompts: ["smooth camera flythrough of a green forest with river"],
  },
  {
    id: 3,
    category: "City",
    title: "Futuristic City",
    thumbnail:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    fullImage:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    prompts: ["timelapse video of futuristic neon-lit city skyline"],
  },
];

export default function SampleImages({ handleSampleSelect }) {
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
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white text-sm">
                  {sample.prompts?.[0]}
                </div>
              </div>

              <div className="text-sm font-medium text-gray-800">
                {sample.title}
              </div>
              {sample.category && (
                <div className="text-xs text-gray-500 mb-1">
                  {sample.category}
                </div>
              )}
              <div className="text-xs text-gray-500">
                Click to try this sample
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
