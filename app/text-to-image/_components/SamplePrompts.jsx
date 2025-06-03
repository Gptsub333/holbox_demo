"use client"

import { motion } from "framer-motion"

const samplePrompts = [
  {
    category: "Landscape",
    prompt:
      "A breathtaking mountain range at sunset with golden light casting long shadows across a valley with a winding river",
    color: "bg-blue-100 text-blue-800",
  },
  {
    category: "Portrait",
    prompt:
      "A detailed portrait of a wise elderly person with weathered skin and kind eyes, soft lighting from the side",
    color: "bg-purple-100 text-purple-800",
  },
  {
    category: "Fantasy",
    prompt:
      "A magical floating island with waterfalls cascading off the edges, lush gardens, and a crystal castle at its center",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    category: "Sci-Fi",
    prompt:
      "A futuristic cityscape with neon lights, flying vehicles, and towering skyscrapers under a night sky with multiple moons",
    color: "bg-cyan-100 text-cyan-800",
  },
  {
    category: "Abstract",
    prompt:
      "An abstract representation of human emotions using vibrant colors, flowing shapes, and dynamic composition",
    color: "bg-amber-100 text-amber-800",
  },
  {
    category: "Wildlife",
    prompt:
      "A majestic tiger walking through a misty bamboo forest at dawn with rays of sunlight filtering through the trees",
    color: "bg-rose-100 text-rose-800",
  },
]

export function SamplePrompts({ onSelect }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 subheading-font">Sample Prompts</h2>
      <p className="text-gray-600 mb-5 para-font">Click on any prompt to use it as a starting point</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {samplePrompts.map((item, index) => (
          <motion.div
            key={index}
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => onSelect(item.prompt)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-2 ${item.color}`}>
              {item.category}
            </div>
            <p className="text-sm text-gray-700 line-clamp-3 para-font">{item.prompt}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
