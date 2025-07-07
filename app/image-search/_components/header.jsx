import { Aperture } from "lucide-react"

export default function Header() {
  return (
    <header className="flex items-center space-x-3">
      <Aperture className="h-8 w-8 text-blue-600" />
      <div>
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Visual Search</h1>
        <p className="mt-1 text-sm text-gray-600 max-w-2xl">
          Discover visually similar images by uploading a file or describing what you're looking for.
        </p>
      </div>
    </header>
  )
}
