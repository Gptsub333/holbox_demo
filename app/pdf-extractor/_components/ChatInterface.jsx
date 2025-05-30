"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare, Sparkles } from "lucide-react";

const exampleQuestions = [
  "What is the main topic of this document?",
  "Summarize the key findings",
  "Extract all important dates mentioned",
  "What are the main conclusions?",
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ChatInterface = ({ isOpen, onClose, pdfId, messages, setMessages }) => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // If backend PDF ID not ready, show warning message in chat
    if (!pdfId) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "ai",
          content: "PDF is still uploading or not ready. Please wait a moment.",
        },
      ]);
      return;
    }

    // Add user message to chat
    const userMessage = { id: Date.now(), type: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch(`${BACKEND_URL}/pdf_data_extraction/ask_question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf_id: pdfId, question: message.trim() }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      // Add AI response to chat
      const aiMessage = { id: Date.now() + 1, type: "ai", content: data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: "ai", content: "Sorry, there was an error getting an answer." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Shortcut to send example question
  const handleQuestionClick = (question) => {
    handleSendMessage(question);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 w-full h-[100dvh] flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal Container */}
            <motion.div
              className="z-50 w-[90%] max-w-md max-h-[80vh] overflow-hidden rounded-lg bg-white shadow-xl"
              style={{ transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
            >
              <div className="flex flex-col h-full max-h-[80vh]">
                {/* Header */}
                <motion.div
                  className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </motion.div>
                    <h3 className="text-sm font-medium text-gray-800">Ask about this PDF</h3>
                  </div>

                  <motion.button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>

                {/* Chat Messages */}
                <div className="flex-grow overflow-y-auto p-3 bg-white">
                  {messages.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                      <p className="mb-4 text-center text-xs text-gray-500">
                        Ask questions about the PDF content
                      </p>
                      <div className="space-y-2">
                        {exampleQuestions.map((q, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => handleQuestionClick(q)}
                            className="w-full rounded-md bg-gray-50 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            aria-label={`Example question: ${q}`}
                          >
                            <MessageSquare className="inline mr-1.5 h-3 w-3 text-gray-400" />
                            {q}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence>
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-2 text-xs ${
                                msg.type === "user"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {isTyping && (
                        <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="rounded-lg bg-gray-100 p-2">
                            <motion.div className="flex space-x-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="h-1.5 w-1.5 rounded-full bg-gray-400"
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                  }}
                                />
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input Form */}
                <motion.div
                  className="border-t border-gray-200 p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <form
                    className="flex space-x-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }}
                  >
                    <input
                      type="text"
                      className="flex-grow rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Type your question..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      aria-label="Type your question"
                    />
                    <motion.button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="rounded-md bg-blue-600 p-1.5 text-white transition-colors disabled:bg-gray-300 hover:bg-blue-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Send question"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </motion.button>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatInterface;
