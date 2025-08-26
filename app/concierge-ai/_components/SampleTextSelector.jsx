"use client"

import { motion } from "framer-motion"
import { ShoppingCart, Calendar, CreditCard, Tag } from "lucide-react"

const sampleTexts = [
  {
    id: 1,
    title: "ConciergeAI Service Inquiry",
    icon: ShoppingCart,
    preview: "Tools used by ConciergeAI",
    text: "What services does ConciergeAI offer for customer inquiries? Can you tell me about the available features?",
  },
  {
    id: 2,
    title: "Business Hours Inquiry",
    icon: Calendar,
    preview: "Store Hours",
    text: "What are the business hours for your store this week? Do you have any special hours for holidays?",
  },
  {
    id: 3,
    title: "Promotions Inquiry",
    icon: Tag,
    preview: "Current Promotions",
    text: "Are there any current promotions or discounts available for your products? I'd love to know how I can save.",
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
