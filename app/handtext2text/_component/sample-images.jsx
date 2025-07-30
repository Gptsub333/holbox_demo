"use client"

import Image from "next/image"
import { FileText } from "lucide-react"

export default function SampleImages({ images, selectedImage, onImageSelect }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-left">Try with a Sample</h2>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedImage === image.src
                ? "border-blue-500 ring-2 ring-blue-500/50"
                : "border-gray-200 hover:border-blue-400"
            }`}
            onClick={() => onImageSelect(image.src)}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              width={200}
              height={100}
              className="object-cover w-full h-full"
            />
            {selectedImage === image.src && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
