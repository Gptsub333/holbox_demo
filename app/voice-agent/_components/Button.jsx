
export default function Button({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  disabled = false,
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const variants = {
    default:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md",
    destructive:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md",
    outline:
      "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-gray-500 shadow-sm hover:shadow-md",
    ghost:
      "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200",
    compact:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow text-sm",
    recording: "bg-red-600 text-white shadow-lg shadow-red-500/25",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm h-9",
    default: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
    compact: "px-4 py-2 text-sm h-10",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
