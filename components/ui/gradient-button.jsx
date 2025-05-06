import { cn } from "@/lib/utils"

export function GradientButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "rounded-md bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium",
        "text-xs px-3 py-1.5", // Reduced size
        "hover:opacity-90 transition-opacity focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
