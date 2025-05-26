"use client"

import { motion } from "framer-motion"
import { Brain, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Clinical case samples with more detailed information information
const clinicalSamples = [
  {
    id: 1,
    title: "Pulmonary Fibrosis Case",
    content:
      "A 54-year-old male with progressive dyspnea and dry cough over several months has imaging showing honeycombing and lower lobe fibrosis. The prognosis is generally poor, with an average survival of around 3 to 5 years, although early intervention may slightly slow progression. Supportive care and possible consideration for transplant are part of long-term management.",
  },
  {
    id: 2,
    title: "Neurological Emergency",
    content:
      "A 28-year-old woman presents with sudden-onset severe headache, neck stiffness, and brief loss of consciousness. Prognosis heavily depends on how quickly the underlying cause is identified and treated. Without immediate intervention, mortality is high; however, timely neurosurgical or endovascular treatment can significantly improve survival, though there's still a risk of long-term neurological deficits.",
  },
  {
    id: 3,
    title: "Acute Abdominal Case",
    content:
      "A 55-year-old man  presents with severe right lower quadrant pain, fever, and nausea that began near the umbilicus and migrated. He reports loss of appetite and has a white blood cell count of 14,000. The condition typically resolves with appropriate intervention, though complications can occur if treatment is delayed.",
  },
]

export default function ClinicalSamples({ activeSample, onSampleClick }) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className="text-lg font-medium text-gray-700 mb-3">Clinical Case Samples</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clinicalSamples.map((sample, index) => (
          <motion.div
            key={sample.id}
            className={cn(
              "bg-white rounded-xl border p-4 sm:p-5 shadow-sm transition-all duration-300 cursor-pointer",
              "hover:shadow-md hover:translate-y-[-4px]", // Enhanced hover effect
              activeSample === sample.id
                ? "border-teal-400 shadow-md ring-2 ring-teal-200"
                : "border-gray-200 hover:border-teal-300",
            )}
            whileHover={{ y: -4 }}
            onClick={() => onSampleClick(sample)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                <Brain className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="font-medium text-teal-800">{sample.title}</h3>
            </div>
            <p className="text-sm text-gray-600 line-clamp-4">{sample.content}</p>
            <div className="mt-3 flex justify-end">
              <button
                className="text-xs flex items-center text-teal-600 hover:text-teal-800 font-medium bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onSampleClick(sample)
                }}
              >
                Use this case <ArrowRight className="ml-1 w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export { clinicalSamples }
