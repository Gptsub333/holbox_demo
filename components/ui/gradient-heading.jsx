import { cn } from "@/lib/utils"

export function GradientHeading({ children, className }) {
  return (
    <h2
      className={cn(
        "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 heading-font font-semibold",
        className,
      )}
    >
      {children}
    </h2>
  )
}
