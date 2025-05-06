"use client"

import { CalendarClock } from "lucide-react"
import { GradientHeading } from "@/components/ui/gradient-heading"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { motion } from "framer-motion"

export default function UpcomingPage() {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="max-w-4xl mx-auto" variants={containerVariants}>
        <motion.div className="flex items-center mb-8" variants={itemVariants}>
          <GradientIcon icon={CalendarClock} size="md" className="mr-4" />
          <GradientHeading className="text-3xl font-bold">Up Coming Features</GradientHeading>
        </motion.div>

        <motion.div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8" variants={itemVariants}>
          <h2 className="text-xl font-semibold text-black mb-4 heading-font">Coming Soon</h2>
          <p className="text-gray-600 mb-6 para-font">
            We're constantly working on new AI features to enhance your experience. Here's a preview of what's coming in
            the next release.
          </p>

          <div className="space-y-6">
            <motion.div
              className="border-l-4 border-gradient-to-r from-blue-600 to-teal-600 pl-4 py-1"
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-medium text-black heading-font">Multi-modal AI Assistant</h3>
              <p className="text-gray-600 mt-1 para-font">
                An advanced AI assistant that can understand and process text, images, and audio inputs simultaneously.
              </p>
            </motion.div>

            <motion.div
              className="border-l-4 border-gradient-to-r from-blue-600 to-teal-600 pl-4 py-1"
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-medium text-black heading-font">Real-time Code Generation</h3>
              <p className="text-gray-600 mt-1 para-font">
                Generate production-ready code in multiple programming languages from natural language descriptions.
              </p>
            </motion.div>

            <motion.div
              className="border-l-4 border-gradient-to-r from-blue-600 to-teal-600 pl-4 py-1"
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-medium text-black heading-font">Advanced Data Visualization</h3>
              <p className="text-gray-600 mt-1 para-font">
                Create interactive, customizable data visualizations from your datasets with simple voice or text
                commands.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
          variants={itemVariants}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-black mb-4 heading-font">Release Schedule</h2>
          <div className="space-y-4">
            <motion.div
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-16 text-sm font-medium text-gray-500 para-font">Q2 2023</div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-black subheading-font">Multi-modal AI Assistant</h3>
                <p className="text-sm text-gray-600 mt-1 para-font">Initial release with basic functionality</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-16 text-sm font-medium text-gray-500 para-font">Q3 2023</div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-black subheading-font">Real-time Code Generation</h3>
                <p className="text-sm text-gray-600 mt-1 para-font">Beta release for selected programming languages</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="w-16 text-sm font-medium text-gray-500 para-font">Q4 2023</div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-black subheading-font">Advanced Data Visualization</h3>
                <p className="text-sm text-gray-600 mt-1 para-font">Full release with all planned features</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
