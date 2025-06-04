import { Activity } from "lucide-react";
import ConnectionStatus from "./ConnectionStatus";

export default function Header({ isConnected }) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Health Assistant
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Voice-enabled healthcare companion
              </p>
            </div>
          </div>
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </div>
    </header>
  );
}
