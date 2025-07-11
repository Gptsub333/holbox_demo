// This header is now sticky and has a modern backdrop-blur effect.
export default function Header() {
  return (
    <header className="bg-white/80 top-0 z-30 border-b border-gray-200">
      {/* The container ensures the content is centered and padded. */}
      <div className="container mx-auto px-6 sm:px-8">
        <div className="py-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Agents to Connect </h1>
        </div>
      </div>
    </header>
  )
}
