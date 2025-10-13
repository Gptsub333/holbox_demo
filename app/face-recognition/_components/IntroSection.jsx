// "use client"

// import { motion } from "framer-motion"
// import { Eye } from "lucide-react"
// import { FeatureIcon } from "@/components/feature-icons";

// export default function IntroSection() {
//   return (
//     <motion.div
//       className="mb-6"
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="flex items-center mb-3">
//         <div className="w-8 h-8 bg-[#2564eb] rounded-lg flex items-center justify-center mr-3">
//           <Eye className="h-4 w-4 text-white" />
//         </div>
//         <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Face Recognition</h1>
//       </div>
//       <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
//         Advanced AI-powered system for detecting and identifying faces in video content with high accuracy and real-time
//         analysis.
//       </p>
//     </motion.div>
//   )
// }

"use client";

import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureIcon } from "@/components/feature-icons";

export default function IntroSection() {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };
  return (
    <motion.div className="mt-[35px] sm:mt-0 mb-8 flex items-center" variants={itemVariants}>
      <FeatureIcon icon={Eye} size="lg" gradient="blue" className="mr-4" />
      <div>
        <h1 className="text-3xl font-bold heading-font">Face Recognition</h1>
        <p className="text-muted-foreground mt-1">
          Advanced AI-powered system for detecting and identifying faces in
          video content with high accuracy and real-time analysis.
        </p>
      </div>
    </motion.div>
  );
}
