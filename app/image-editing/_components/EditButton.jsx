"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Loader2, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function EditButton({ onClick, isEditing, disabled }) {
  const MotionButton = motion(Button)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MotionButton
        onClick={onClick}
        disabled={disabled || isEditing}
        className={cn(
          "w-full py-3 px-6 rounded-lg font-medium transition-all duration-200",
          "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
          "text-white shadow-lg hover:shadow-xl",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center space-x-2"
        )}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        {isEditing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Editing Image...</span>
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            <span>Edit Image</span>
          </>
        )}
      </MotionButton>
      
      {disabled && !isEditing && (
        <p className="text-xs text-gray-500 mt-2 text-center para-font">
          Please upload an image and enter a description to continue
        </p>
      )}
    </motion.div>
  )
}
