"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, ArrowRight, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const exampleQuestions = [
  "How would I use this product for a SaaS application?",
  "Can users sign in with just an email link?",
  "How do I enable users to send invites to other users?",
]

export function ModernChatbot({ isOpen, onClose, title = "AI Assistant" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm an AI assistant trained on documentation, help articles, and other content. Ask me anything about ${title}.`,
      animated: false,
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  const handleSendMessage = (e) => {
    e?.preventDefault()

    if (!input.trim() && !e?.currentTarget?.dataset?.question) return

    const question = e?.currentTarget?.dataset?.question || input

    // Add user message with animation
    setMessages((prev) => [...prev, { role: "user", content: question, animated: false }])
    setInput("")
    setIsTyping(true)

    // Mark user message as animated after a delay
    setTimeout(() => {
      setMessages((prev) => prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, animated: true } : msg)))
    }, 1000)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Thank you for your question. I'm here to help! This is a simulated response for demonstration purposes. In a real implementation, this would connect to an AI service to provide helpful answers based on your documentation and help articles.",
          animated: false,
        },
      ])

      // Mark AI message as animated after a delay
      setTimeout(() => {
        setMessages((prev) => prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, animated: true } : msg)))
      }, 1500)
    }, 1500)
  }

  const handleExampleClick = (question) => {
    setInput(question)
    handleSendMessage({ preventDefault: () => {}, currentTarget: { dataset: { question } } })
  }

  const markMessageAsAnimated = (index) => {
    setMessages((prev) => prev.map((msg, i) => (i === index ? { ...msg, animated: true } : msg)))
  }

  if (!isOpen) return null

  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 right-0 left-0 sm:bottom-4 sm:right-4 sm:left-auto z-50 flex flex-col w-full sm:w-auto max-w-full sm:max-w-sm shadow-xl rounded-t-xl sm:rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 20, x: 20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mr-2">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-medium text-white heading-font">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 bg-white overflow-y-auto max-h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={cn("flex items-start gap-2", message.role === "user" ? "flex-row-reverse" : "flex-row")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: message.animated ? 0 : 0.3,
                }}
              >
                {/* Logo/Avatar - Outside the bubble */}
                <div className="flex-shrink-0">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center",
                      message.role === "user" ? "bg-blue-600" : "bg-blue-100",
                      !message.animated && "animate-pulse",
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-blue-600" />
                    )}
                  </div>
                </div>

                {/* Message Bubble */}
                <motion.div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2",
                    message.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-800",
                  )}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: message.animated ? 0 : 0.5,
                  }}
                >
                  {message.role === "assistant" && index === 0 ? (
                    <div>
                      <p className={`text-sm para-font ${!message.animated ? "animate-pulse" : ""}`}>
                        {message.content}
                      </p>
                      <div className="mt-4 grid grid-cols-1 gap-2">
                        {exampleQuestions.map((question, qIndex) => (
                          <button
                            key={qIndex}
                            onClick={() => handleExampleClick(question)}
                            className="text-left text-xs bg-gray-50 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className={`text-sm para-font ${!message.animated ? "animate-pulse" : ""}`}>{message.content}</p>
                  )}
                </motion.div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[85%]">
                  <div className="flex space-x-1">
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="bg-gray-50 border-t border-gray-200 p-3">
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="flex-1 text-sm border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 para-font"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className={cn(
                "ml-2 rounded-full p-2 transition-colors",
                input.trim() ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400",
              )}
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </button>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-blue-600 flex items-center transition-colors"
            >
              Get help <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}
