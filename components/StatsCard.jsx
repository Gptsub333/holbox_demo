import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";


export const StatsCard = ({ title, value, change, isIncrease, icon }) => {
  return (
    <Card className="bg-white border border-gray-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              {icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{title}</p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
                <div className={`flex items-center text-xs ${
                  isIncrease ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span className="ml-1">{change}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};