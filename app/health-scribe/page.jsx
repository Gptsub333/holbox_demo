"use client"

import { Stethoscope } from "lucide-react"
import { FeatureIcon } from "@/components/feature-icons"

export default function HealthScribePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center">
        <FeatureIcon icon={Stethoscope} size="lg" gradient="green" className="mr-4" />
        <h1 className="text-3xl font-bold heading-font">Health Scribe</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border bg-gray-50 p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold heading-font">Medical Audio Transcription</h2>
          <p className="mb-4 text-muted-foreground para-font">
            Transcribe medical audio recordings and get instant answers to medical queries. Perfect for healthcare
            professionals looking to save time on documentation.
          </p>

          <div className="rounded-md bg-muted p-4">
            <p className="text-sm para-font">
              Upload audio files or record directly for instant transcription with medical terminology recognition.
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-gray-50 p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold heading-font">Upload Audio</h2>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-muted-foreground para-font">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground para-font">MP3, WAV, or M4A (MAX. 20MB)</p>
              </div>
              <input type="file" className="hidden" />
            </label>
          </div>
          <button className="w-full mt-4 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 transition-colors">
            Start Transcription
          </button>
        </div>
      </div>
    </div>
  )
}
