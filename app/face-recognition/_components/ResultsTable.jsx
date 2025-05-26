"use client"

import { motion, AnimatePresence } from "framer-motion"
import { User, Clock, CheckCircle } from "lucide-react"

export default function ResultsTable({ results, isVisible }) {
  if (!results || !isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <h3 className="text-base font-medium text-gray-900">Recognition Results</h3>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Found {results.detected_faces?.length || 0} face(s) in {results.video}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Name
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Timestamp
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.detected_faces?.map((face, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-[#2564eb] rounded-full flex items-center justify-center mr-2">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {face.external_image_id || `Person ${index + 1}`}
                          </div>
                          <div className="text-xs text-gray-500">Recognized</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {face.timestamp?.toFixed(2)}s
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!results.detected_faces || results.detected_faces.length === 0) && (
            <div className="px-4 py-6 text-center">
              <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">No faces detected</h3>
              <p className="text-xs text-gray-500">No recognizable faces were found at the analyzed timestamp.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
