"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NL2SQLHeader from "./_components/NL2SQLHeader";
import ResultsTable from "./_components/ResultsTable";
import ResultsChart from "./_components/ResultsChart";
import ChatPanel from "./_components/ChatPanel";
import GeneratedQueryDisplay from "./_components/GeneratedQueryDisplay";
import {
  Loader2,
  AlertTriangle,
  DatabaseZap,
  Table,
  BarChart3,
  History,
  Code2,
  Copy,
  Check,
} from "lucide-react";
import { useAuthContext } from "../../context/AuthContext"; // Import the context

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Copy to Clipboard Hook
const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return { isCopied, copyToClipboard };
};

const GeneratedQueryDisplayWithCopy = ({ sqlQuery }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center">
          <Code2 className="w-4 h-4 mr-2" />
          Generated SQL Query
        </h3>
        <button
          onClick={() => copyToClipboard(sqlQuery)}
          className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
            isCopied
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
          }`}
          title="Copy to clipboard"
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="p-4">
        <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
          {sqlQuery}
        </pre>
      </div>
    </div>
  );
};

const JSONView = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center">
          <Code2 className="w-4 h-4 mr-2" />
          JSON Response Data
        </h3>
      </div>
      <div className="p-4 max-h-96 overflow-auto">
        <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default function NL2SQLPage() {
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("table");
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);
  const [currentQuery, setCurrentQuery] = useState(null);

  const { sessionToken } = useAuthContext();
  const token = "Bearer " + sessionToken;

  const handleQuerySubmit = async (query) => {
    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    setCurrentQuery(query);

    const historyItem = {
      id: Date.now(),
      query: query,
      timestamp: new Date().toLocaleString(),
      response: null,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/nl2sql/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Add the Bearer token here
        },
        body: JSON.stringify({ question: query }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      setApiResponse(data);
      historyItem.response = data;
      setQueryHistory((prev) => [historyItem, ...prev]);
    } catch (err) {
      setError(err.message || "Unknown error occurred");
      historyItem.error = err.message;
      setQueryHistory((prev) => [historyItem, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = (historyItem) => {
    if (historyItem.response) {
      setApiResponse(historyItem.response);
      setCurrentQuery(historyItem.query);
      setError(null);
    } else if (historyItem.error) {
      setError(historyItem.error);
      setApiResponse(null);
      setCurrentQuery(historyItem.query);
    }
    setShowChatHistory(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 150, damping: 25 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <NL2SQLHeader />

      {/* <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      > */}
      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Content Grid */}
        {/* <div
          className="
              flex flex-col-reverse
              lg:grid lg:grid-cols-6 lg:gap-6
              h-[calc(100vh-200px)]
            "
        > */}
        <div
          className="
      flex flex-col-reverse
      gap-6
      lg:grid lg:grid-cols-6 lg:gap-6
    "
        >
          {/* Left Side - Results Area */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            {isLoading && (
              // <motion.div
              //   className="flex flex-col items-center justify-center text-gray-500 bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex-1"
              //   variants={itemVariants}
              // >
              <motion.div
                className="flex flex-wrap gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200 w-full"
                variants={itemVariants}
              >
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                <p className="text-md font-medium">Processing your query...</p>
                <p className="text-xs">Please wait a moment.</p>
              </motion.div>
            )}

            {/* Error State */}
            <AnimatePresence>
              {error && !isLoading && (
                <motion.div
                  className="bg-red-50 p-5 rounded-xl shadow-lg border border-red-200 text-red-700 flex items-start space-x-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  variants={itemVariants}
                >
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold">Error</h3>
                    <p className="text-xs">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Section */}
            <AnimatePresence>
              {apiResponse && !isLoading && !error && (
                <motion.div
                  className="flex-1 flex flex-col space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  exit={{ opacity: 0 }}
                >
                  {/* Toggle Buttons */}
                  <motion.div
                    className="flex space-x-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200 w-fit"
                    variants={itemVariants}
                  >
                    <button
                      onClick={() => setActiveView("table")}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeView === "table"
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Table className="w-4 h-4 mr-2" />
                      Table View
                    </button>
                    <button
                      onClick={() => setActiveView("chart")}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeView === "chart"
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Chart View
                    </button>
                    <button
                      onClick={() => setActiveView("json")}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeView === "json"
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Code2 className="w-4 h-4 mr-2" />
                      JSON View
                    </button>
                  </motion.div>

                  {/* Data Display Area */}
                  <motion.div
                    className="flex-1 min-h-0"
                    variants={itemVariants}
                  >
                    <AnimatePresence mode="wait">
                      {activeView === "table" ? (
                        <motion.div
                          key="table"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="h-full"
                        >
                          {/* SCROLLABLE, BORDERED TABLE AREA */}
                          {/* <div className="h-[400px] w-full border border-gray-200 rounded-xl bg-white overflow-x-auto overflow-y-auto p-4"> */}
                          <div className="w-full max-h-[60vh] md:max-h-[400px] border border-gray-200 rounded-xl bg-white overflow-auto p-4">
                            {/* Center horizontally with mx-auto if the table is small */}
                            <div className="h-full overflow-x-auto overflow-y-auto items-center justify-center">
                              <ResultsTable
                                data={apiResponse.answer.data}
                                id="results-table"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ) : activeView === "chart" ? (
                        <motion.div
                          key="chart"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="h-full"
                        >
                          <ResultsChart
                            chartType={apiResponse.answer.best_chart}
                            data={apiResponse.answer.data}
                            xAxisKey={
                              apiResponse.answer.selected_columns.x_axis
                            }
                            yAxisKey={
                              apiResponse.answer.selected_columns.y_axis
                            }
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="json"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="h-full"
                        >
                          <JSONView data={apiResponse.answer.data} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Welcome State */}
            {!isLoading && !apiResponse && !error && (
              <motion.div
                className="text-center text-gray-400 py-12 bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex-1 flex flex-col justify-center items-center"
                variants={itemVariants}
              >
                <DatabaseZap size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-md font-medium">
                  Welcome to the NL2SQL Converter
                </p>
                <p className="text-xs">
                  Enter a natural language query to get started.
                </p>
              </motion.div>
            )}

            {/* Generated Query Display Only - Summary removed */}
            <AnimatePresence>
              {apiResponse && !isLoading && !error && (
                <motion.div
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={itemVariants} className="relative">
                    <GeneratedQueryDisplayWithCopy
                      sqlQuery={apiResponse.answer.generated_sql}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side - Chat Panel */}
          {/* <div className="lg:col-span-2 flex flex-col space-y-4 max-w-md"> */}
          <div className="lg:col-span-2 flex flex-col space-y-4 max-w-md w-full">
            <motion.button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <History className="w-4 h-4 mr-2" />
              Chat History ({queryHistory.length})
            </motion.button>

            {/* Chat History Panel */}
            <AnimatePresence>
              {showChatHistory && (
                <motion.div
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-h-60 overflow-y-auto"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Previous Queries
                  </h3>
                  {queryHistory.length === 0 ? (
                    <p className="text-xs text-gray-500">No previous queries</p>
                  ) : (
                    <div className="space-y-2">
                      {queryHistory.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleHistoryItemClick(item)}
                          className="p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <p className="text-xs font-medium text-gray-800 truncate">
                            {item.query}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.timestamp}
                          </p>
                          {item.error && (
                            <p className="text-xs text-red-500">
                              Error occurred
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Panel - Compact Version with Summary Response */}
            <motion.div className="flex-1" variants={itemVariants}>
              <ChatPanel
                onQuerySubmit={handleQuerySubmit}
                isLoading={isLoading}
                summaryResponse={apiResponse?.answer?.summary}
                compact={true}
              />
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
