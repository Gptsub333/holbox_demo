"use client"

import { useState } from "react"
import { motion } from "framer-motion" // Import motion
import Header from "./_components/header"
import SearchToggle from "./_components/search-toggle"
import ImageSearch from "./_components/image-search"
import TextSearch from "./_components/text-search"
import ResultsGrid from "./_components/results-grid"

export default function HomePage() {
  const [mode, setMode] = useState("image")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (query) => {
    setLoading(true)
    setError(null)
    setResults([])

    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      const queryText = typeof query === "string" ? query : query.name || "uploaded-image"
      const dummyResults = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        url: `/placeholder.svg?width=400&height=400&query=${encodeURIComponent(queryText + "-" + i)}`,
        alt: `Search result for ${queryText} ${i + 1}`,
      }))
      setResults(dummyResults)
    } catch (err) {
      setError("Failed to fetch results. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
