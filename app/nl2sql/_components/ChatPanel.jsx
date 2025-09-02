"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, MessageSquare, Loader2, CornerDownLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const exampleQueries = [
  "Show me the product table ",
  "Display the joint table of product and sales.",
  "Average of total sales.",
  "Count the number of orders placed last month.",
]

export default function ChatPanel({ 
  onQuerySubmit, 
  isLoading, 
  summaryResponse, 
  compact = false 
}) {
  const [inputQuery, setInputQuery] = useState("")
  const [currentConversation, setCurrentConversation] = useState({ userQuery: null, aiResponse: null })
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  // }

  // useEffect(scrollToBottom, [currentConversation])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [inputQuery])

  useEffect(() => {
    if (!isLoading && summaryResponse) {
      setCurrentConversation(prev => ({
        ...prev,
        aiResponse: (
          <div className="space-y-2">
            <p className={`text-gray-700 ${compact ? 'text-xs' : 'text-sm'} leading-relaxed`}>
              {summaryResponse}
            </p>
          </div>
        )
      }))
    }
  }, [isLoading, summaryResponse, compact])

  const handleSubmit = () => {
    if (inputQuery.trim() && !isLoading) {
      // Set current conversation with user query
      setCurrentConversation({
        userQuery: inputQuery,
        aiResponse: null
      })
      onQuerySubmit(inputQuery)
      setInputQuery("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleExampleQueryClick = (query) => {
    setInputQuery(query)
    textareaRef.current?.focus()
  }

  if (compact) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full max-w-screen-4xl max-h-[600px]"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
            Query Assistant
          </h3>
        </div>

        {/* Compact Example Queries */}
        <div className="p-3 border-b rounded-lg  border-gray-200">
          <p className="text-xs text-gray-500 mb-2 flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-yellow-500" />
            Quick examples:
          </p>
          <div className="space-y-1">
            {exampleQueries.slice(0, 2).map((exQuery, index) => (
              <motion.button
                key={index}
                onClick={() => handleExampleQueryClick(exQuery)}
                className="w-full text-left text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {exQuery.length > 40 ? exQuery.substring(0, 37) + '...' : exQuery}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Current Conversation Messages */}
        <div className="flex-grow overflow-y-auto p-3 space-y-2 min-h-0 bg-slate-50">
          <AnimatePresence initial={false}>
            {/* User Query */}
            {currentConversation.userQuery && (
              <motion.div
                key="user-message"
                className="flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                layout
              >
                <div className="max-w-[90%] px-2 py-1.5 rounded-lg shadow-sm text-xs bg-blue-600 text-white rounded-br-sm">
                  <p className="whitespace-pre-wrap">{currentConversation.userQuery}</p>
                </div>
              </motion.div>
            )}

            {/* AI Response */}
            {currentConversation.aiResponse && (
              <motion.div
                key="ai-message"
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                layout
              >
                <div className="max-w-[90%] px-2 py-1.5 rounded-lg shadow-sm text-xs bg-gray-200 text-gray-800 rounded-bl-sm">
                  {currentConversation.aiResponse}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isLoading && currentConversation.userQuery && (
            <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
              <div className="bg-gray-200 text-gray-800 px-2 py-1.5 rounded-lg rounded-bl-sm shadow-sm flex items-center space-x-1">
                <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                <span className="text-xs">Processing...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />

          {/* Empty State */}
          {!currentConversation.userQuery && !isLoading && (
            <div className="text-center text-gray-400 text-xs py-4">Your conversation will appear here.</div>
          )}
        </div>

        {/* Compact Textarea Input */}
        <div className="p-3 border-t rounded-lg border-gray-200 bg-white">
          <div className="flex justify-center items-center items-end space-x-2 bg-slate-100 rounded-lg p-1 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <textarea
              ref={textareaRef}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-grow bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none px-2 py-1 text-xs resize-none min-h-[24px] max-h-20 overflow-y-auto"
              disabled={isLoading}
              rows={1}
            />
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading || !inputQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex-shrink-0 flex items-center justify-center"
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              aria-label="Send query"
            >
              <Send className="w-3 h-3" />
            </motion.button>
          </div>
          <p className="text-xs pt-3 text-gray-400 mt-1 text-center">
            Press{' '}
            <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded">
              Enter
            </kbd>{' '}
            to send,{' '}
            <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded">
              Shift+Enter
            </kbd>{' '}
            for new line
          </p>
        </div>
      </motion.div>
    );
  }

  // Original full-size layout
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden h-full max-w-screen-xl" // Updated max-width here
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <MessageSquare className="w-6 h-6 mr-3 text-blue-600" />
          Query Assistant
        </h2>
      </div>

      <div className="p-5 border-b border-gray-200">
        <p className="text-xs text-gray-500 mb-3 flex items-center">
          <Sparkles className="w-4 h-4 mr-1.5 text-yellow-500" />
          Try an example query or type your own below:
        </p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((exQuery, index) => (
            <motion.button
              key={index}
              onClick={() => handleExampleQueryClick(exQuery)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {exQuery}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-5 space-y-4 min-h-[200px] bg-slate-50">
        <AnimatePresence initial={false}>
          {/* User Query */}
          {currentConversation.userQuery && (
            <motion.div
              key="user-message"
              className="flex justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              layout
            >
              <div className="max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm bg-blue-600 text-white rounded-br-lg">
                <p className="text-sm whitespace-pre-wrap">{currentConversation.userQuery}</p>
              </div>
            </motion.div>
          )}

          {/* AI Response */}
          {currentConversation.aiResponse && (
            <motion.div
              key="ai-message"
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              layout
            >
              <div className="max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm bg-gray-200 text-gray-800 rounded-bl-lg">
                {currentConversation.aiResponse}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && currentConversation.userQuery && (
          <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
            <div className="bg-gray-200 text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-lg shadow-sm flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm">Processing...</span>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
        
        {/* Empty State */}
        {!currentConversation.userQuery && !isLoading && (
          <div className="text-center text-gray-400 text-sm py-8">Your conversation will appear here.</div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white mt-auto">
        <div className="flex items-end space-x-3 bg-slate-100 rounded-2xl p-1.5 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
          <textarea
            ref={textareaRef}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your natural language query..."
            className="flex-grow bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none px-4 py-2 text-sm resize-none min-h-[40px] max-h-32 overflow-y-auto"
            disabled={isLoading}
            rows={1}
          />
          <motion.button
            onClick={handleSubmit}
            disabled={isLoading || !inputQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex-shrink-0"
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            aria-label="Send query"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press{" "}
          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-md">
            Enter
          </kbd>{" "}
          to send, <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-md">Shift+Enter</kbd> for new line, or click the <CornerDownLeft className="inline w-3 h-3 mx-0.5" /> button.
        </p>
      </div>
    </motion.div>
  )
}
