"use client"

import { Button } from "@/components/ui/button"
import { Loader2, User, ScanFaceIcon } from "lucide-react" // Assuming ScanFace is available

// If ScanFace is not directly available, use a placeholder or alternative like UserSearch
// const ScanFaceIcon = ScanFace || UserSearch;

export function ActionButtons({ onAddFace, onRecognizeFace, isLoading, isImageUploaded, isNameEntered }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Button
        onClick={onAddFace}
        disabled={isLoading || !isImageUploaded || !isNameEntered}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm py-3 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <User className="mr-2 h-4 w-4" />}
        Add Face
      </Button>
      <Button
        onClick={onRecognizeFace}
        disabled={isLoading || !isImageUploaded}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm py-3 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanFaceIcon className="mr-2 h-4 w-4" />}
        Recognize Face
      </Button>
    </div>
  )
}
