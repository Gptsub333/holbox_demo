"use client"

import { useRouter } from "next/navigation"
import { Database, Stethoscope, User, Video, FileText, Shirt, Car, Mic, Clipboard, UserX, FileX } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { FeatureIcon } from "@/components/feature-icons"

const features = [
  { name: "NL2SQL", href: "/nl2sql", icon: Database, description: "SQL queries using AI with instant results" },
  {
    name: "Health Scribe",
    href: "/health-scribe",
    icon: Stethoscope,
    description: "Transcribe medical audio and get answers",
  },
  {
    name: "Face Recognition",
    href: "/face-recognition",
    icon: User,
    description: "Real-time detection and identification",
  },
  {
    name: "Video Compliance",
    href: "/video-compliance",
    icon: Video,
    description: "Analyze videos for safety and compliance",
  },
  { name: "PDF Extractor", href: "/pdf-extractor", icon: FileText, description: "Upload PDFs and chat for insights" },
  { name: "Text to Image", href: "/text-to-image", icon: Wand2, description: "Generate images from text descriptions" },
  { name: "Virtual Try-On", href: "/virtual-try-on", icon: Shirt, description: "Try garments on models using images" },
  { name: "Traffic Chatbot", href: "/traffic-chatbot", icon: Car, description: "AI assistant for traffic conditions" },
  { name: "Voice-Agent", href: "/voice-agent", icon: Mic, description: "Voice-enabled booking and health assistant" },
  {
    name: "DDx Assistant",
    href: "/ddx-assistant",
    icon: Clipboard,
    description: "Differential diagnosis from symptoms",
  },
  {
    name: "PII Extractor",
    href: "/pii-extractor",
    icon: UserX,
    description: "Detect and extract personal information",
  },
  { name: "PII Redactor", href: "/pii-redactor", icon: FileX, description: "Remove PII from input text securely" },
  
]

export function FeatureGrid() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {features.map((feature) => (
        <Card
          key={feature.href}
          className="cursor-pointer transition-all hover:shadow-md hover:scale-102 border border-gray-200 bg-gray-50"
          onClick={() => router.push(feature.href)}
        >
          <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4 text-center">
            <FeatureIcon icon={feature.icon} size="md" gradient="random" className="mb-2 sm:mb-3" />
            <h3 className="mb-0.5 sm:mb-1 text-sm sm:text-base font-medium heading-font">{feature.name}</h3>
            <p className="text-xs text-muted-foreground para-font">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
