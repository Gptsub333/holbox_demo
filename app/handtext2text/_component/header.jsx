import { FileText } from "lucide-react"

export default function Header() {
  return (
    <header className="text-left mb-8">
      <div className="flex items-center gap-3 mb-2">
        <FileText className="h-7 w-7 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800">Handwritten to Digital Converter</h1>
      </div>
      <p className="text-sm text-gray-500">Easily convert images of handwritten notes into editable, digital text.</p>
    </header>
  )
}
