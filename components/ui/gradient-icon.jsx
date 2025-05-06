import { cn } from "@/lib/utils"

export function GradientIcon({ icon: Icon, className, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div
      className={cn("rounded-lg bg-blue-100 flex items-center justify-center shadow-sm", sizeClasses[size], className)}
    >
      <Icon className={cn("text-blue-600", iconSizes[size])} />
    </div>
  )
}
