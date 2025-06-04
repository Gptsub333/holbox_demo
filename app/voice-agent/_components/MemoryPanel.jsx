
import { 
  User, 
  Phone, 
  Clock,
  Activity
} from "lucide-react";
import { Card, CardContent } from "./Card";

export default function MemoryPanel({ memoryKv }) {
  if (Object.keys(memoryKv).length === 0) return null;

  return (
    <div className="mt-6 animate-fade-in">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <User className="w-5 h-5 text-blue-600" />
            Patient Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(memoryKv).map(([key, value]) => (
              <div
                key={key}
                className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    {key.includes("name") ? (
                      <User className="w-4 h-4 text-white" />
                    ) : key.includes("phone") ? (
                      <Phone className="w-4 h-4 text-white" />
                    ) : key.includes("time") || key.includes("date") ? (
                      <Clock className="w-4 h-4 text-white" />
                    ) : (
                      <Activity className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
                      {key.replace(/_/g, " ")}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}