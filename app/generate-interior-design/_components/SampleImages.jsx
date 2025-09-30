import React from "react";
import { motion } from "framer-motion";

// Sample images with editing prompts
const sampleImages = [
  {
    id: 1,
    category: "Living Room",
    title: "Modern Living Room",
    thumbnail:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=600&q=80",
    fullImage:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=80",
    prompts: ["modern living room with minimal design and cozy furniture"],
  },
  {
    id: 2,
    category: "Bedroom",
    title: "Minimalist Bedroom",
    thumbnail:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    fullImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    prompts: ["minimalist bedroom with natural lighting and soft tones"],
  },
  {
    id: 3,
    category: "Kitchen",
    title: "Cozy Kitchen",
    thumbnail:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=600&q=80",
    fullImage:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1200&q=80",
    prompts: ["cozy kitchen with wooden cabinets and modern appliances"],
  },
  
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
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover overlay with sample prompts */}
              </div>

              <div className="text-xs text-gray-500">
                Click to try this sample
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SampleImages;
