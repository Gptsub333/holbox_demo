"use client"

export function TextInput({ value = "", onChange }) {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Describe the video you want to generate... (e.g., 'A drone shot flying over a mountain range with a sunset in the background')"
        className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none shadow-sm text-gray-800 placeholder:text-gray-400 para-font"
      />
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-gray-500">{value ? value.length : 0} / 500 characters</div>
        <div className="text-xs text-gray-500">Be specific about motion, scenes, and transitions</div>
      </div>
    </div>
  )
}
