"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, User } from "lucide-react";
import SampleTextSelector from "./_components/SampleTextSelector";
import ChatbotPanel from "./_components/chatbot-panel"; // Import the chatbot panel component


export default function FileSystemManager() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your ConciergeAI, here to help you with any questions about our business. How can I assist you today?"
    }
  ]);
  const [text, setText] = useState("");  // Text field for user input
  const [selectedSampleId, setSelectedSampleId] = useState(null);



  // Handle when a sample is selected
  const handleSelectText = (sampleText, id) => {
    setText(sampleText);                // Set the selected sample text in the input field
    setSelectedSampleId(id);            // Update the selected sample ID
  };

  
  return (
    <div className="min-h-screen bg-white py-4 sm:py-6">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact Header */}
        <motion.div
          className="flex items-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <User className="h-5 w-5" style={{ color: "#2564eb" }} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Concierge AI Agent
            </h1>
            <p className="text-xs text-gray-600">
              AI agent assistant for business inquiries.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sample Text Selector */}
          <motion.div
            className="order-1 lg:col-span-1 flex-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <SampleTextSelector
                onSelectText={handleSelectText} // Pass select function to SampleTextSelector
                selectedId={selectedSampleId}
              />
            </div>
          </motion.div>

          {/* Chatbot Panel */}
          <motion.div
            className="order-2 lg:col-span-2 flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col">
              <ChatbotPanel
                messages={messages}  // Pass messages to ChatbotPanel
                setMessages={setMessages}
                input={text}
                setInput={setText}   // Pass setInput to update text
              />
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
