import { Wifi, WifiOff } from "lucide-react";

export default function ConnectionStatus({ isConnected }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all duration-300 ${
          isConnected
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
        }`}
      >
        {isConnected ? (
          <Wifi className="w-4 h-4 animate-pulse" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="hidden sm:inline font-medium">
          {isConnected ? "Connected" : "Offline"}
        </span>
      </div>
    </div>
  );
}
