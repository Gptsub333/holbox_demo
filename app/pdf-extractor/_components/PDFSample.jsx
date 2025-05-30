"use client"
import { motion } from "framer-motion"
import { FileText, TrendingUp, Microscope, Scale } from "lucide-react"

const samplePDFs = [
  {
    id: 1,
    title: "Sample PDF 1",
    url: "/sample1.pdf",
    pages: 13,
    icon: FileText,
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    color: "text-blue-700",
    description: "Resume Sample PDF",
  },
  {
    id: 2,
    title: "Sample PDF 2",
    url: "/sample2.pdf",
    pages: 20,
    icon: TrendingUp,
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    color: "text-green-700",
    description: "Research Paper Sample PDF",
  },
  {
    id: 3,
    title: "Sample PDF 3",
    url: "/sample3.pdf",
    pages: 1,
    icon: Microscope,
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    color: "text-purple-700",
    description: "Invoice Sample PDF",
  },
]

const PDFSample = ({ onSelectPDF, selectedPDF }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  }


  return (
    <motion.div
      className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-sm font-medium text-gray-700 mb-3 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <FileText className="w-4 h-4 mr-1.5 text-gray-500" />
        Sample PDFs
      </motion.h2>
      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {samplePDFs.map((pdf) => {
          const Icon = pdf.icon
          const isSelected = selectedPDF?.id === pdf.id

          return (
            <motion.div
              key={pdf.id}
              className={`bg-white border-2 ${isSelected ? "border-blue-500 shadow-md" : "border-gray-200"
                } rounded-md p-3 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all`}
              onClick={() => onSelectPDF(pdf)}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                <motion.div
                  className={`flex-shrink-0 ${pdf.bgColor} ${pdf.borderColor} border rounded-lg p-3`}
                  animate={isSelected ? { rotate: [0, -5, 5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={`w-6 h-6 ${pdf.color}`} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-medium text-gray-800">{pdf.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{pdf.description}</p>
                  <div className="flex items-center mt-1.5 space-x-2">
                    <span className="text-xs text-gray-400">{pdf.pages} pages</span>
                    {isSelected && (
                      <motion.span
                        className="text-xs text-blue-600 font-medium"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        Selected
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

export default PDFSample
