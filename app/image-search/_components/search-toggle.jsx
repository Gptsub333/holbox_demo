"use client"
import { ImageIcon, TypeIcon } from "lucide-react"

export default function SearchToggle({ mode, setMode }) {
  const commonClasses =
    "flex items-center justify-center w-full px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
  const activeClasses = "bg-blue-600 text-white border-blue-600 shadow-sm"
  const inactiveClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"

  return (
    <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg max-w-xs">
      <button
        onClick={() => setMode("image")}
        className={`${commonClasses} ${mode === "image" ? activeClasses : inactiveClasses}`}
        aria-pressed={mode === "image"}
      >
        <ImageIcon className="w-4 h-4 mr-2" />
        Image
      </button>
      <button
        onClick={() => setMode("text")}
        className={`${commonClasses} ${mode === "text" ? activeClasses : inactiveClasses}`}
        aria-pressed={mode === "text"}
      >
        <TypeIcon className="w-4 h-4 mr-2" />
        Text
      </button>
    </div>
  )
}
