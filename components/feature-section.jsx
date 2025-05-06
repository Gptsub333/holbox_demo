import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { GradientHeading } from "@/components/ui/gradient-heading"

export function FeatureSection({ title, description, benefits, ctaLink }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <GradientHeading className="text-base font-semibold mb-2">{title}</GradientHeading>

      <p className="mt-1.5 text-sm text-gray-600 para-font">{description}</p>

      <div className="mt-3">
        <h3 className="text-xs font-medium text-gray-700 mb-1.5 subheading-font">Benefits:</h3>
        <ul className="space-y-0.5">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-1.5 mt-1 h-1 w-1 rounded-full bg-gradient-to-r from-blue-600 to-teal-600" />
              <span className="text-xs text-gray-600 para-font">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <Link
          href={ctaLink}
          className={cn(
            "inline-flex items-center text-xs font-medium",
            "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600",
            "hover:from-blue-700 hover:to-teal-700",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
          )}
        >
          Try Now <ArrowRight className="ml-1 w-3 h-3 text-teal-600" />
        </Link>
      </div>
    </div>
  )
}
