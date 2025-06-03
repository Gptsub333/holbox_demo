import { Video } from "lucide-react"
import { motion } from "framer-motion"

export function Header() {
    return (
        // <div className="mb-6">
        //   <div className="flex items-center gap-4 mb-1">
        //     <div className="bg-purple-100 p-3 rounded-lg">
        //       <Video className="h-8 w-8 text-purple-500" />
        //     </div>
        //     <h1 className="text-3xl font-bold text-gray-800">Text to Video</h1>
        //   </div>
        //   <p className="text-gray-500 text-lg ml-[64px]">Generate videos from text descriptions using AI</p>
        // </div>

        <motion.div
            className="flex items-center space-x-3 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-purple-100 p-3 rounded-lg">
                <Video className="w-5 h-5 text-blue-600" />
            </div>
            <div>
                <h1 className="text-xl font-semibold text-gray-800">Text to Video</h1>
                <p className="text-xs text-gray-500">Generate videos from text descriptions using AI</p>
            </div>
        </motion.div>
    )
}
