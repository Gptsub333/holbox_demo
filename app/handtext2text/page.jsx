"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import Header from "./_component/header"
import SampleImages from "./_component/sample-images"
import UploadArea from "./_component/upload-area"
import ConvertButton from "./_component/convert-button"
import ResultModal from "./_component/result-modal"

const sampleImageData = [
  { id: 1, src: "/handwrittentext/1.jpeg", alt: "Sample 1" },
  { id: 2, src: "/handwrittentext/2.png", alt: "Sample 2" },
  { id: 3, src: "/handwrittentext/3.webp", alt: "Sample 3" },
]
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function Home() {
  const [convertedText, setConvertedText] = useState("")
  const [selectedFile, setSelectedFile] = useState(null); // Track the File object directly
  const [selectedImage, setSelectedImage] = useState(null); // Track the preview (base64 for upload or /path for sample)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleImageSelect = async (src) => {
    // If src is a sample image path, fetch as blob
    if (src.startsWith('/')) {
      const response = await fetch(src)
      const blob = await response.blob()
      const fileName = src.split('/').pop()
      const file = new File([blob], fileName, { type: blob.type })
      setSelectedFile(file)
      setSelectedImage(src)
    }
  }


  const handleClearSelection = () => {
    setSelectedFile(null)
    setSelectedImage(null)
  }

  const handleFileUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setSelectedImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleOpenChange = (open) => {
    console.log("Modal open state:", open);
    setIsModalOpen(open);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select a sample image or upload your own.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch(`${BACKEND_URL}/extract-handwritten-text`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to convert handwriting')
      const data = await response.json()

      // Simple error pattern match
      if (data.extracted_text?.toLowerCase().includes('throttling')) {
        setConvertedText("Server busy. Too many requests. Please wait and try again.");
        setIsModalOpen(true);
        toast({
          title: "Server Busy",
          description: "Too many requests. Please wait a minute and try again.",
          variant: "destructive",
        });
        return;
      }



      setConvertedText(data.extracted_text)
      setIsModalOpen(true)
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(convertedText)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "The converted text has been copied.",
        })
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard.",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Header />
      <main>
        <SampleImages images={sampleImageData} selectedImage={selectedImage} onImageSelect={handleImageSelect} />
        <UploadArea
          selectedImage={selectedImage}
          onFileUpload={handleFileUpload}
          onClearSelection={handleClearSelection}
        />
        <div className="mt-8 text-center">
          <ConvertButton isLoading={isLoading} isImageSelected={!!selectedImage} onConvert={handleConvert} />
        </div>
      </main>
      <ResultModal
        isOpen={isModalOpen}
        onOpenChange={handleOpenChange}
        convertedText={convertedText}
        onCopyToClipboard={handleCopyToClipboard}
      />

    </div>
  )
}
