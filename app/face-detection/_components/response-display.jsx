"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function ResponseDisplay({ apiResponse, error, imagePreview }) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          key="error"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="mt-6"
        >
          <Card className="bg-red-50 border-red-500 rounded-xl shadow-lg">
            <CardContent className="p-4 flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-red-700 text-sm para-font">{error}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {apiResponse && (
        <motion.div
          key="response"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="mt-8"
        >
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader
              className={cn(
                "pb-4",
                apiResponse.message?.includes("successfully")
                  ? "bg-green-50"
                  : apiResponse.recognized === true
                    ? "bg-blue-50"
                    : "bg-yellow-50",
              )}
            >
              <CardTitle className="flex items-center text-lg heading-font">
                {apiResponse.message?.includes("successfully") ? (
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                ) : apiResponse.recognized === true ? (
                  <CheckCircle className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-700 mr-2 flex-shrink-0" />
                )}
                {apiResponse.message || "Response"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {apiResponse.face_id && (
                <p className="text-sm text-gray-700 para-font">
                  <strong>Face ID:</strong> {apiResponse.face_id}
                </p>
              )}
              {apiResponse.external_image_id && (
                <p className="text-sm text-gray-700 para-font">
                  <strong>External Image ID (Name):</strong>{" "}
                  <span className="font-semibold">{apiResponse.external_image_id}</span>
                </p>
              )}
              {apiResponse.recognized && apiResponse.name && (
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  {imagePreview && (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Recognized face"
                      className="w-24 h-24 rounded-md object-cover border-2 border-blue-300 shadow-sm flex-shrink-0"
                    />
                  )}
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-700 para-font">
                      Recognized as:{" "}
                      <strong className="text-xl text-blue-700 heading-font">{apiResponse.name}</strong>
                    </p>
                    <p className="text-sm text-gray-700 para-font mt-1">
                      Confidence:{" "}
                      <strong className="text-lg text-blue-600 numbers-font">
                        {apiResponse.confidence?.toFixed(1)}%
                      </strong>
                    </p>
                  </div>
                </div>
              )}
              {apiResponse.recognized === false && (
                <p className="text-sm text-yellow-800 para-font p-4 border border-yellow-300 rounded-lg bg-yellow-100">
                  The system could not recognize a known face in the uploaded image. You can try adding this face if
                  it's new.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
