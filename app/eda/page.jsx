"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner" // Or use any toast lib you like (shadcn, react-hot-toast, etc.)
import DatasetSelector from "./_components/dataset-selector"
import Query from "./_components/query"
import Visualize from "./_components/visualize"
import Header from "./_components/header"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"

export default function EdaPage() {
  const [selectedFile, setSelectedFile] = useState("")
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessed, setIsProcessed] = useState(false)
  const [isLoading, setIsLoading] = useState({ upload: false, query: false, viz: null })
  const [query, setQuery] = useState("")
  const [queryResult, setQueryResult] = useState(null)
  const [visualizations, setVisualizations] = useState({})
  const [error, setError] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    async function createSession() {
      try {
        const res = await fetch(`${BACKEND_URL}/create-session`, { method: "POST" });
        const data = await res.json();
        const sessionId = data.session_id;
        setSessionId(sessionId)
      } catch (err) {
        toast.error("Failed to create session. Please reload the page.")
      }
    }
    createSession()
  }, [])



  // ---- CSV Upload and Process ----
  const handleProcessCsv = async () => {
    setIsLoading((prev) => ({ ...prev, upload: true }))
    setError(null)
    setQueryResult(null)
    setVisualizations({})
    setIsProcessed(false)

    try {
      let fileToUpload = null

      if (uploadedFile) {
        fileToUpload = uploadedFile // User-chosen file
      } else if (selectedFile) {
        // Fetch sample CSV from public folder, wrap as File
        const response = await fetch(`/${selectedFile}`)
        if (!response.ok) throw new Error(`Could not load sample file: ${selectedFile}`)
        const blob = await response.blob()
        fileToUpload = new File([blob], selectedFile, { type: "text/csv" })
      } else {
        throw new Error("Please select a sample file or upload your own.")
      }

      const formData = new FormData()
      formData.append("file", fileToUpload)
      formData.append("session_id", sessionId)

      const response = await fetch(`${BACKEND_URL}/upload-csv/`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (!response.ok || data.error) throw new Error(data.error || "Failed to process CSV.")
      setIsProcessed(true)
      toast.success("File uploaded and processed!")
    } catch (err) {
      setError(err.message)
      setIsProcessed(false)
      toast.error("Upload failed: " + err.message)
    } finally {
      setIsLoading((prev) => ({ ...prev, upload: false }))
    }
  }


  // ---- Query ----
  const handleQuery = async () => {
    if (!query) return
    setIsLoading((prev) => ({ ...prev, query: true }))
    setError(null)
    setQueryResult(null)
    const formData = new FormData()
    formData.append("session_id", sessionId)
    formData.append("query", query)
    try {

      const response = await fetch(`${BACKEND_URL}/ask-query`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (!response.ok || data.error) throw new Error(data.error || "Failed to get query result.")
      setQueryResult(data)
    console.log("Query result:", data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading((prev) => ({ ...prev, query: false }))
    }
  }

  // ---- Visualize ----
  const handleVisualize = async (type) => {
    if (!sessionId) {
      setError("Session not initialized. Please refresh the page.");
      return;
    }
    setIsLoading((prev) => ({ ...prev, viz: type }));
    setError(null);

    try {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      if (type !== "all") {
        formData.append("visualization_type", type);
      }

      const endpoint = type === "all" ? "/visualize-all" : "/visualize";
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`Failed to get ${type} visualization.`);
      const data = await response.json();
      if (type === "all") {
        setVisualizations(data);
      } else {
        setVisualizations((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, viz: null }));
    }
  };

  // ---- Main UI ----
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 md:p-8">
        <Header />
        <DatasetSelector
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          onProcess={handleProcessCsv}
          isLoading={isLoading.upload}
        />
        {isProcessed && (
          <div className="space-y-8">
            <Query
              query={query}
              setQuery={setQuery}
              onQuerySubmit={handleQuery}
              isLoading={isLoading.query}
              queryResult={queryResult}
            />
            {/* <Visualize
              onVisualize={handleVisualize}
              isLoading={isLoading.viz}
              visualizations={visualizations}
            /> */}
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p>
              <span className="font-bold">Error:</span> {error}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
