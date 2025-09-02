import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FoodAnalysisResult({ foodAnalysis, onClose }) {
  if (!foodAnalysis || foodAnalysis.items.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed border-slate-300 rounded-xl shadow-xl max-w-lg mx-auto">
        <h3 className="text-lg font-medium text-slate-900 mb-2">No food items detected</h3>
        <p className="text-slate-500">Please upload a valid image to analyze.</p>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white p-8 rounded-xl max-w-lg w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Food Analysis Results</h3>

        <div className="space-y-4 overflow-y-auto max-h-96">
          {/* Loop through the food items and display details */}
          {foodAnalysis.items.map((item, index) => (
            <div key={index} className="border-b py-4">
              <h4 className="text-lg font-semibold text-slate-900">{item.name}</h4>
              <p className="text-sm text-slate-600">{item.description}</p>
              <div className="text-sm text-slate-600">Portion: {item.portion_text}</div>
              <div className="text-sm text-slate-600">Estimated Calories: {item.estimated_calories} kcal</div>
              <div className="text-sm text-slate-600">Confidence: {Math.round(item.confidence * 100)}%</div>
            </div>
          ))}

          <div className="mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Total Estimated Calories: {foodAnalysis.total_calories_estimate} kcal
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full text-slate-600 hover:text-slate-900 border-slate-300 hover:bg-blue-50 py-3 rounded-lg"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
