"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ConvertButton({ isLoading, isImageSelected, onConvert }) {
  return (
    <Button
      onClick={onConvert}
      disabled={isLoading || !isImageSelected}
      size="lg"
      className="bg-blue-600 hover:bg-blue-700 px-6 py-3"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Converting...
        </>
      ) : (
        "Convert to Text"
      )}
    </Button>
  )
}
