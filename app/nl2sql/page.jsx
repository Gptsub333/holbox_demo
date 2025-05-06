import { Database } from "lucide-react"
import { GradientHeading } from "@/components/ui/gradient-heading"
import { GradientIcon } from "@/components/ui/gradient-icon"

export default function NL2SQLPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <GradientIcon icon={Database} size="md" className="mr-4" />
          <GradientHeading className="text-3xl font-bold">NL2SQL</GradientHeading>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4 heading-font">Natural Language to SQL</h2>
          <p className="text-gray-600 mb-6 para-font">
            Convert natural language queries into SQL statements using advanced AI. Get instant results and
            visualizations from your database without writing complex SQL code.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2 subheading-font">Example:</h3>
            <p className="text-sm text-gray-600 font-mono mono-font">
              "Show me the top 5 customers by total purchase amount in the last quarter"
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-black mb-4 heading-font">Try It Out</h2>
          <div className="space-y-4">
            <textarea
              className="w-full min-h-[150px] rounded-lg border border-gray-200 bg-gray-50 p-3 text-black focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent para-font"
              placeholder="Enter your query in natural language..."
            />
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity">
              Generate SQL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
