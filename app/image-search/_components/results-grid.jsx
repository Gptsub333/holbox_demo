"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function ResultsGrid({ results }) {
  if (!results || results.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {results.map((result) => (
          <motion.div
            key={result.id}
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            variants={itemVariants}
            layout
          >
            <Image
              src={result.url || "/placeholder.svg"}
              alt={result.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

