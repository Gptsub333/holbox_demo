"use client"

export function TextInput({ value, onChange }) {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Describe the image you want to generate... (e.g., 'A serene mountain landscape with a lake at sunset, photorealistic style')"
        className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none shadow-sm text-gray-800 placeholder:text-gray-400 para-font"
      />
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-gray-500">{value.length} / 500 characters</div>
        <div className="text-xs text-gray-500">Be specific for better results</div>
      </div>
    </div>
  )
}
