"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Array of predefined gradients
const gradients = {
  blue: "from-blue-500 via-sky-500 to-teal-500",
  teal: "from-teal-500 via-cyan-500 to-blue-500",
  green: "from-green-500 via-teal-500 to-cyan-500",
  orange: "from-orange-500 via-amber-500 to-yellow-500",
  red: "from-red-500 via-rose-500 to-pink-500",
  gray: "from-gray-600 via-gray-500 to-gray-400",
}

// Function to get a random gradient
const getRandomGradient = () => {
  const gradientKeys = Object.keys(gradients)
  const randomKey = gradientKeys[Math.floor(Math.random() * gradientKeys.length)]
  return gradients[randomKey]
}

export function FeatureIcon({ icon: Icon, size = "md", gradient = "random", className }) {
  const gradientClass = gradient === "random" ? getRandomGradient() : gradients[gradient]

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2.5",
    lg: "p-3.5",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <motion.div
      className={cn(
        "rounded-full bg-gradient-to-br shadow-md flex items-center justify-center transition-all duration-300",
        gradientClass,
        sizeClasses[size],
        className,
      )}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Icon className={cn("text-white group-hover:text-blue-400", iconSizes[size])} />
    </motion.div>
  )
}
