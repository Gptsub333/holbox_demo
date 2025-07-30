"use client"

import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UploadArea({ selectedImage, onFileUpload, onClearSelection }) {
  return (
    <section className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center min-h-[236px] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        {selectedImage ? (
          <div className="relative">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Selected for conversion"
              width={500}
              height={250}
              className="rounded-lg max-h-56 w-auto object-contain border border-gray-200"
            />
            <button
              onClick={onClearSelection}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-gray-500">
              <Upload className="h-12 w-12 mb-2" />
              <p className="font-semibold">Upload your own image</p>
              <p className="text-sm">or select a sample above</p>
            </div>
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Choose File
                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={onFileUpload} />
              </label>
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
