"use client"

import { Card } from "@/components/ui/card"

const sampleFoods = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    image: "/placeholder.svg?height=120&width=120",
    calories: 285,
    protein: "32g",
    carbs: "12g",
    fat: "8g",
  },
  {
    id: 2,
    name: "Avocado Toast",
    image: "/placeholder.svg?height=120&width=120",
    calories: 320,
    protein: "12g",
    carbs: "28g",
    fat: "18g",
  },
  {
    id: 3,
    name: "Berry Smoothie Bowl",
    image: "/placeholder.svg?height=120&width=120",
    calories: 245,
    protein: "8g",
    carbs: "42g",
    fat: "6g",
  },
]

export default function SampleFoods({ selectedFood, onFoodSelect }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Sample Foods</h2>
        <p className="text-slate-600 mb-6">Click on any food item to analyze its nutritional content</p>
      </div>

      <div className="space-y-4">
        {sampleFoods.map((food) => (
          <Card
            key={food.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
              selectedFood?.id === food.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => onFoodSelect(food)}
          >
            <div className="flex items-center space-x-4">
              <img
                src={food.image || "/placeholder.svg"}
                alt={food.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-slate-900">{food.name}</h3>
                <p className="text-sm text-slate-500">Click to analyze</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
