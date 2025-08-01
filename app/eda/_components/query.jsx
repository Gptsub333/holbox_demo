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
        {queryResult && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-2">Query Result</p>
            <p className="text-gray-700">{queryResult.result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
