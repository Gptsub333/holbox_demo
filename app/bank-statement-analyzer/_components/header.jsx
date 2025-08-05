import { Landmark } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center gap-4">
        <Landmark className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bank Statement Analyzer</h1>
          <p className="text-sm text-gray-500">
            Upload your bank statement to instantly identify and list all merchants.
          </p>
        </div>
      </div>
    </header>
  )
}
