"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, HelpCircle } from "lucide-react"

export default function Query({ query, setQuery, onQuerySubmit, isLoading, queryResult }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query) return
    onQuerySubmit()
  }

  // Function to render JSON in a more readable way
  const renderResult = (result) => {
    if (typeof result === "object") {
      return (
        <div className="space-y-2">
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">{key}:</span>
              <span className="text-gray-600">{JSON.stringify(value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return <p className="text-gray-600">{JSON.stringify(result)}</p>
  }

  return (
    <Card className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-gray-600" />
          2. Ask a Question
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What is the average value of column 'target'?"
            className="flex-grow"
          />
          <Button className="bg-blue-600 rounded-md text-white" type="submit" disabled={isLoading || !query}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Query
          </Button>
        </form>

        {/* Display query result if it's available */}
        {queryResult && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg overflow-auto max-h-[300px]">
            <p className="text-sm font-semibold text-blue-800 mb-2">Query Result</p>
            <div className="text-sm text-gray-700">{renderResult(queryResult.answer)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
