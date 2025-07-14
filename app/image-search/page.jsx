"use client"

import { useState } from "react"
import { motion } from "framer-motion" // Import motion
import Header from "./_components/header"
import SearchToggle from "./_components/search-toggle"
import ImageSearch from "./_components/image-search"
import TextSearch from "./_components/text-search"
import ResultsGrid from "./_components/results-grid"

const BACKEND_URL_IMAGE_SEARCH=process.env.NEXT_PUBLIC_BACKEND_URL_IMAGE_SEARCH

export default function HomePage() {
  const [mode, setMode] = useState("image")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)



const handleSearch = async (query) => {
  setLoading(true);
  setError(null);
  setResults([]);

  try {
    let response;

    if (mode === "text") {
      response = await fetch(`${BACKEND_URL_IMAGE_SEARCH}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, k: 5 }),
      });
    } else {
      const formData = new FormData();
      formData.append("file", query);
      formData.append("k", "5");

      response = await fetch(`${BACKEND_URL_IMAGE_SEARCH}/search_by_image`, {
        method: "POST",
        body: formData,
      });
    }

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    const formatted = data.map((item, idx) => ({
      id: idx,
      url: item.image_url,
      alt: `Match from ${item.folder}, distance: ${item.distance.toFixed(2)}`,
    }));

    setResults(formatted);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch results. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-16 md:pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Header />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 flex flex-col items-center"
      >
        <div className="w-full max-w-lg">
          <SearchToggle mode={mode} setMode={setMode} />
        </div>

        <div className="w-full max-w-lg mt-6">
          {mode === "image" ? (
            <ImageSearch onSearch={handleSearch} loading={loading} />
          ) : (
            <TextSearch onSearch={handleSearch} loading={loading} />
          )}
        </div>
      </motion.div>

      {error && <p className="mt-6 text-center text-red-500">{error}</p>}

      {loading && (
        <div className="mt-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="mt-2 text-gray-500">Searching for similar images...</p>
        </div>
      )}

      <div className="w-full mt-12">
        <ResultsGrid results={results} />
      </div>
    </main>
  )
}
