"use client"

import { motion } from "framer-motion"
import { ShoppingCart, Calendar, CreditCard } from "lucide-react"

const sampleTexts = [
  {
    id: 1,
    title: "Customer Service Inquiry",
    icon: ShoppingCart,
    preview: "Product tracking with contact details",
    text: "Hi, my name is Rebecca Johnson, and I live at 482 Elm Street, Springfield, IL 62704. You can reach me on my personal cell at (217) 555-0198 or email me at rebecca.johnson@gmail.com. I recently ordered a product from your store, and I need help tracking it.",
  },
  {
    id: 2,
    title: "Medical Appointment",
    icon: Calendar,
    preview: "Appointment with patient information",
    text: "This is to confirm the appointment for Dr. Michael Turner with patient Jonathan Blake, date of birth March 22, 1985, scheduled on April 20, 2025, at 3:00 PM. The meeting will be held at 245 Wellness Blvd, Suite 301, New York, NY. If you have any questions, call us at 212-555-0345.",
  },
  {
    id: 3,
    title: "Credit Application",
    icon: CreditCard,
    preview: "Application with sensitive data",
    text: "My name is Sanjay Patel, and my social security number is 123-45-6789. I recently applied for a credit card using my home address: 56 Riverbend Drive, Austin, TX 78701. Please notify me at sanjay.patel@outlook.com if there are any updates. You can also text me at (512) 555-0284.",
  },
]

export default function SampleTextSelector({ onSelectText, selectedId }) {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#2564eb" }}></div>
        <h3 className="text-sm font-semibold text-gray-800">Sample Texts</h3>
      </div>

      <div className="space-y-2 flex-1">
        {sampleTexts.map((sample, index) => (
          <motion.button
            key={sample.id}
            onClick={() => onSelectText(sample.text, sample.id)}
            className={`w-full p-3 rounded-lg border text-left transition-all duration-200 group ${
              selectedId === sample.id
                ? "border-blue-300 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-md transition-all duration-200 ${
                  selectedId === sample.id ? "bg-blue-200" : "bg-gray-100 group-hover:bg-blue-100"
                }`}
              >
                <sample.icon
                  className={`h-3 w-3 transition-colors duration-200`}
                  style={{
                    color: selectedId === sample.id ? "#2564eb" : "#6b7280",
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-xs font-semibold mb-1 transition-colors duration-200 ${
                    selectedId === sample.id ? "text-blue-900" : "text-gray-900"
                  }`}
                >
                  {sample.title}
                </h4>
                <p className="text-xs text-gray-600">{sample.preview}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
