"use client"

import { motion } from "framer-motion"
import Image from "next/image"

// A selection of icons to display in the animation.
const icons = [
  { src: "https://images.seeklogo.com/logo-png/33/1/confluence-logo-png_seeklogo-338595.png", alt: "Google" },
  { src: "https://cdn.brandfetch.io/idJ_HhtG0Z/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1745381282564", alt: "Slack" },
  { src: "https://cdn.brandfetch.io/idR3duQxYl/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1749527355219", alt: "GitHub" },
  { src: "https://pbs.twimg.com/media/DMJRKEIUEAAwPQA.png", alt: "Notion" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEUnP3lusf9D3mZl15YDm2lUImJiH82Pi_-w&s", alt: "Stripe" },
  { src: "https://cdn.brandfetch.io/id5o3EIREg/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1750127197312", alt: "Discord" },
  { src: "https://play-lh.googleusercontent.com/_AZCbg39DTuk8k3DiPRASr9EwyW058pOfzvAu1DsfN9ygtbOlbuucmXaHJi5ooYbokQX", alt: "Jira" },
  { src: "https://cdn.brandfetch.io/idY3kwH_Nx/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1691075441479", alt: "OpenAI" },
]

export default function HeroAnimation() {
  const radius = 140 // The radius of the circle on which icons will rotate.
  const iconContainerSize = 60 // Size of the white circle around each icon

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Faint circular path for the icons */}
      <div
        className="absolute w-[280px] h-[280px] border border-blue-300/60 rounded-full z-0 blur-[2px]"
        style={{ width: radius * 2, height: radius * 2 }}
      />

      {/* The main animated container for the icons */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {icons.map((icon, index) => {
          // Calculate the position of each icon on the circle using trigonometry.
          const angle = (index / icons.length) * 2 * Math.PI
          const x = radius * Math.cos(angle)
          const y = radius * Math.sin(angle)

          return (
            <motion.div
              key={index}
              className="absolute flex items-center justify-center"
              style={{
                width: iconContainerSize,
                height: iconContainerSize,
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              {/* This inner div rotates in the opposite direction to keep icons upright. */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="bg-white p-3 rounded-full shadow-md"
              >
                <Image
                  src={icon.src || "/placeholder.svg"}
                  alt={icon.alt}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Central "Agents" hub with smooth gradient */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="w-40 h-40 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/50">
          <span className="text-white text-3xl font-bold tracking-tight">Agents</span>
        </div>
      </div>
    </div>
  )
}
