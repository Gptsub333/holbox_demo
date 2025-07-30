
"use client"
import { useState } from "react";
import { Copy, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResultModal({
  isOpen,
  onOpenChange,
  convertedText,
  onCopyToClipboard,
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(convertedText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Converted Text</h2>
        <div className="my-4">
          <p
            className="text-gray-600 bg-gray-100 p-4 rounded-md max-h-60 overflow-y-auto whitespace-pre-line"
            style={{ fontFamily: "inherit" }}
          >
            {convertedText}
          </p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
    onClick={handleCopy}
    className="flex-1 flex items-center justify-center gap-2"
    disabled={copied}
  >
    <Copy className="h-4 w-4" />
    {copied ? "Copied!" : "Copy to Clipboard"}
  </Button>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
