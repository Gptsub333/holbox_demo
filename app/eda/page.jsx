"use client";

import { useState } from "react";
import { toast } from "sonner";
import DatasetSelector from "./_components/dataset-selector";
import Query from "./_components/query";
import Visualize from "./_components/visualize";
import Header from "./_components/header";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export default function EdaPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vizLoading, setVizLoading] = useState(null);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [visualizations, setVisualizations] = useState({});
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null); // Store sessionId
  

  // ---- Query ----
  const handleQuery = async () => {
    if (!query || !selectedFile) {
      toast.error("Pick a CSV and enter a question.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQueryResult(null);

    const formData = new FormData();
    formData.append("question", query);
    formData.append("session_id", sessionId); // Include sessionId

    try {
      const res = await fetch(`${BACKEND_URL}/eda/qa`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.error || "Query failed");
      setQueryResult(data);
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Visualize ----
  const handleVisualize = async (type, column) => {
    if (!selectedFile) {
      setError("No file selected.");
      toast.error("No file selected.");
      return;
    }

    if ((type === "dist" || type === "time" || type === "cat") && !column) {
      toast.error("Column is required for this chart.");
      return;
    }

    const endpoints = {
      dist: "/distribution",
      time: "/time",
      corr: "/correlation",
      cat: "/categorical",
    };

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (column) formData.append("column", column);
    formData.append("session_id", sessionId); // Include sessionId

    setVizLoading(type);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/eda${endpoints[type]}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.error || `Failed to get ${type} graph`);

      const graphs = Array.isArray(data.graphs) ? data.graphs : [data.graphs];
      setVisualizations((prev) => ({ ...prev, [type]: graphs }));
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setVizLoading(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="py-10 container mx-auto px-4 md:px-8">
        <Header />

        <DatasetSelector
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          isLoading={isLoading}
          setIsFileSelected={setIsFileSelected}
          setSessionId={setSessionId} // Pass the setSessionId function
          setIsLoading={setIsLoading}
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
  );
}
