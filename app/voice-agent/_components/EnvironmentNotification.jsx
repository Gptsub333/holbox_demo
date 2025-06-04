import { Activity, X } from "lucide-react";

export default function EnvironmentNotification({ showNotification, onClose }) {
  return (
    <div
      className={`
        fixed top-6 right-6 max-w-sm w-[90%] sm:w-full transform transition-all duration-500 ease-in-out z-50
        ${
          showNotification
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-full opacity-0 scale-95"
        }
      `}
    >
      <div className="relative backdrop-blur-xl bg-white/10 dark:bg-white/5 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent" />
        <div className="absolute inset-0 rounded-2xl shadow-inner shadow-white/20" />

        <div className="relative p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/30 to-blue-500/30 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
                    Optimize Your Experience
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    For optimal voice interaction, we recommend a quiet
                    environment with minimal background noise.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-blue-500/80 to-blue-600/80 hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] backdrop-blur-sm border border-blue-400/20"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-[11000ms] shadow-sm"
            style={{ width: showNotification ? "100%" : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
