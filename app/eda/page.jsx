"use client"

import { useState } from "react"
import { toast } from "sonner"
import DatasetSelector from "./_components/dataset-selector"
import Query from "./_components/query"
import Visualize from "./_components/visualize"
import Header from "./_components/header"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"

export default function EdaPage() {
  const [selectedFile, setSelectedFile] = useState(null)  // Store the actual file object
  const [uploadedFile, setUploadedFile] = useState(false) // Shows Query/Visualize
  const [isFileSelected, setIsFileSelected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)  // Query spinner
  const [vizLoading, setVizLoading] = useState(null) // Which viz is loading
  const [query, setQuery] = useState("") // User query input
  const [queryResult, setQueryResult] = useState(null) // Initialize queryResult state
  const [visualizations, setVisualizations] = useState({}) // Store visualizations
  const [error, setError] = useState(null)

  // ---- Query ----
  const handleQuery = async () => {
    if (!query || !selectedFile) {
      toast.error("Pick a CSV and enter a question.")
      return
    }

    setIsLoading(true)
    setError(null)
    setQueryResult(null)

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("question", query)

    try {
      const res = await fetch(`${BACKEND_URL}/qa`, { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || data?.error || "Query failed")
      setQueryResult(data)
    } catch (e) {
      setError(e.message)
      toast.error(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ---- Visualize (per-endpoint) ----
  const handleVisualize = async (type, column) => {
    if (!selectedFile) {
      setError("No file selected.")
      toast.error("No file selected.")
      return
    }

    // column required for dist/time/cat
    if ((type === "dist" || type === "time" || type === "cat") && !column) {
      toast.error("Column is required for this chart.")
      return
    }

    const endpoints = {
      dist: "/distribution",
      time: "/time",
      corr: "/correlation",
      cat: "/categorical",
    }

    const formData = new FormData()
    formData.append("file", selectedFile)
    if (column) formData.append("column", column)

    setVizLoading(type)
    setError(null)

    try {
      const res = await fetch(`${BACKEND_URL}${endpoints[type]}`, { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || data?.error || `Failed to get ${type} graph`)

      // Backend returns { graphs: string | string[] }
      const graphs = Array.isArray(data.graphs) ? data.graphs : [data.graphs]
      setVisualizations((prev) => ({ ...prev, [type]: graphs }))
    } catch (e) {
      setError(e.message)
      toast.error(e.message)
    } finally {
      setVizLoading(null)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 md:p-8">
        <Header />

        <DatasetSelector
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          isLoading={isLoading}
          setIsFileSelected={setIsFileSelected}
        />

        {isFileSelected && (
          <div className="space-y-8">
            <Query
              query={query}
              setQuery={setQuery}
              onQuerySubmit={handleQuery}
              isLoading={isLoading}
              queryResult={queryResult}
            />
            <Visualize
              onVisualize={handleVisualize}
              isLoading={vizLoading}
              visualizations={visualizations}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p><span className="font-bold">Error:</span> {error}</p>
          </div>
        )}
      </main>
    </div>
  )
}
