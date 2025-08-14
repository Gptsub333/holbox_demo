"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Lock } from "lucide-react";
import SampleTextSelector from "./_components/SampleTextSelector";
import { useAuthContext } from "../../context/AuthContext"; // Import the context
import ChatbotPanel from "./_components/chatbot-panel"; // Import the chatbot panel component

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/agentcore/invoke";


export default function FileSystemManager() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your File System Manager assistant. How can I assist you today?",
    },
  ]);
  const [text, setText] = useState("");  // Text field for user input
  const [selectedSampleId, setSelectedSampleId] = useState(null);

  // Handle when a sample is selected
  const handleSelectText = (sampleText, id) => {
    setText(sampleText);                // Set the selected sample text in the input field
    setSelectedSampleId(id);            // Update the selected sample ID
  };

  // Handle sending the message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;  // Prevent sending empty message

    // Add the user's message to the chat
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);

    // Send the user's message to the backend API
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,  // Send the user input as the message to the backend
        }),
      });

      const data = await response.json(); // Parse the JSON response

      if (data?.body?.result?.content) {
        // Assuming the response from the backend contains the tools description in `content`
        const assistantMessage = data.body.result.content[0].text;

        // Add the AI's response to the chat
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantMessage },
        ]);
      }
    } catch (error) {
      console.error("Error sending message to backend:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process your request. Please try again." },
      ]);
    }

    setText("");  // Clear the text input field after sending
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
            <Shield className="h-5 w-5" style={{ color: "#2564eb" }} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              File System Manager Agent
            </h1>
            <p className="text-xs text-gray-600">
              Ask questions about your S3, analyze S3 and know more about your data.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full">
              <SampleTextSelector
                onSelectText={handleSelectText} // Pass select function to SampleTextSelector
                selectedId={selectedSampleId}
              />
            </div>
          </motion.div>

          <motion.div
            className="order-2"
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

        {/* Gray/White Theme Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-gray-200 rounded-md">
                <Shield className="h-3 w-3 text-gray-700" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">
                Smart Detection
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              AI algorithms identify names, addresses, phones, emails, and
              sensitive data.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-gray-200 rounded-md">
                <Lock className="h-3 w-3 text-gray-700" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">
                Secure Processing
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              Privacy-focused analysis with enterprise-grade security measures.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-gray-200 rounded-md">
                <Shield className="h-3 w-3 text-gray-700" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">
                Compliance Ready
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              Built with GDPR, HIPAA, and CCPA compliance in mind.
            </p>
          </div>
        </motion.div>

        {/* Gray/White Theme Notice */}
        <motion.div
          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-gray-200 rounded-md flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-gray-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Privacy Notice
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                This tool is for demonstration purposes. Always ensure proper
                authorization before analyzing personal information and handle
                extracted PII according to applicable privacy regulations.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>


    </div>
  );
}
