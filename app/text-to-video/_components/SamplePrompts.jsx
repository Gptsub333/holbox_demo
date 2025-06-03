"use client"

const samplePrompts = [
  {
    category: "Nature",
    prompt: "A cinematic drone shot flying over a lush forest with a river winding through it, golden hour lighting",
    color: "bg-green-100 text-green-800",
  },
  {
    category: "Urban",
    prompt: "A timelapse of a busy city intersection at night with cars leaving light trails and neon signs glowing",
    color: "bg-blue-100 text-blue-800",
  },
  {
    category: "Abstract",
    prompt: "Colorful paint swirling and mixing in water, creating mesmerizing patterns in slow motion",
    color: "bg-purple-100 text-purple-800",
  },
  {
    category: "Character",
    prompt: "A 3D animated character walking through a fantasy village with magical elements floating around",
    color: "bg-amber-100 text-amber-800",
  },
  {
    category: "Science",
    prompt: "A molecular animation showing DNA replication process with detailed cellular structures",
    color: "bg-cyan-100 text-cyan-800",
  },
  {
    category: "Space",
    prompt: "A realistic journey through a nebula with stars being born and cosmic dust illuminated by distant suns",
    color: "bg-indigo-100 text-indigo-800",
  },
]

export function SamplePrompts({ onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {samplePrompts.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => onSelect && onSelect(item.prompt)}
        >
          <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-2 ${item.color}`}>
            {item.category}
          </div>
          <p className="text-sm text-gray-700 line-clamp-3 para-font">{item.prompt}</p>
        </div>
      ))}
    </div>
  )
}
