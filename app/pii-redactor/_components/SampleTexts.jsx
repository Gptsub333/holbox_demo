"use client"

import { motion } from "framer-motion"
import { FileText, Check } from "lucide-react"

const sampleTexts = [
  {
    id: 1,
    title: "Customer Support Inquiry",
    preview: "Hi, my name is Rebecca Johnson, and I live at 482 Elm Street...",
    fullText:
      "Hi, my name is Rebecca Johnson, and I live at 482 Elm Street, Springfield, IL 62704. You can reach me on my personal cell at (217) 555-0198 or email me at rebecca.johnson@gmail.com. I recently ordered a product from your store, and I need help tracking it.",
  },
  {
    id: 2,
    title: "Medical Appointment",
    preview: "This is to confirm the appointment for Dr. Michael Turner...",
    fullText:
      "This is to confirm the appointment for Dr. Michael Turner with patient Jonathan Blake, date of birth March 22, 1985, scheduled on April 20, 2025, at 3:00 PM. The meeting will be held at 245 Wellness Blvd, Suite 301, New York, NY. If you have any questions, call us at 212-555-0345.",
  },
  {
    id: 3,
    title: "Credit Application",
    preview: "My name is Sanjay Patel, and my social security number is...",
    fullText:
      "My name is Sanjay Patel, and my social security number is 123-45-6789. I recently applied for a credit card using my home address: 56 Riverbend Drive, Austin, TX 78701. Please notify me at sanjay.patel@outlook.com if there are any updates. You can also text me at (512) 555-0284.",
  },
]

export default function SampleTexts({ selectedSample, onSampleSelect }) {
  return (
    <motion.div
      className="space-y-2 p-3 bg-gray-50 border border-gray-200 rounded-lg h-full flex flex-col"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3 className="text-xs font-semibold text-gray-900 mb-3">Sample Texts</h3>

      <div className="space-y-2 flex-grow">
        {sampleTexts.map((sample, index) => (
          <motion.div
            key={sample.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
              selectedSample?.id === sample.id
                ? "border-blue-500 bg-white shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => onSampleSelect(sample)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                <h4 className="text-xs font-medium text-gray-900">{sample.title}</h4>
              </div>
              {selectedSample?.id === sample.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                </motion.div>
              )}
            </div>
            <p className="text-[10px] text-gray-600 leading-relaxed pl-5">{sample.preview}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
