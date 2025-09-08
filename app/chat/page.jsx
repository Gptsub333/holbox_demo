"use client";

import React, { useState, useEffect, useRef } from "react";
import { HeroPrompt } from "./components/hero-prompt";

const Chat = () => {
  console.log("Index component rendering..."); // Debug log

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const attachMenuRef = useRef(null);

  // Close attach menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target)) {
        setShowAttachMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const startChat = (firstMessage) => {
    console.log("Starting chat with:", firstMessage);
    if (!firstMessage.trim()) return;

    setChatOpen(true);

    const newMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: firstMessage.trim(),
      timestamp: new Date(),
    };
    setMessages([newMessage]);
    setIsMessageSent(true); // Trigger full screen mode immediately
    setIsTyping(true);

    // Add AI response after delay
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  const handleSend = (nextMessage) => {
    console.log("Sending message:", nextMessage);
    if (!nextMessage.trim()) return;

    const newMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: nextMessage.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    // Add AI response after delay
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That's a great question! Let me help you with that.",
        "I understand what you're looking for. Here's my response:",
        "Thanks for asking! I'd be happy to help you with this.",
        "Interesting! Let me provide you with some insights on this topic.",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      const aiMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1200);
  };

  const handleFileAttach = () => {
    setShowAttachMenu(!showAttachMenu);
  };

  const handleFileSelect = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    switch(type) {
      case 'image':
        input.accept = 'image/*';
        break;
      case 'document':
        input.accept = '.pdf,.doc,.docx,.txt';
        break;
      case 'video':
        input.accept = 'video/*';
        break;
      case 'audio':
        input.accept = 'audio/*';
        break;
      default:
        input.accept = '*';
    }
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setShowAttachMenu(false);
        console.log(`Selected ${type}:`, file);
        // Here you would typically upload the file or prepare it for sending
      }
    };
    
    input.click();
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="h-full bg-gray-50">
      {!chatOpen ? (
        // Hero Section
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-6">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="mb-8">
              <img
                src="./holboxai.svg"
                alt="ChatAI Logo"
                className="w-24 h-24 mx-auto"
              />
            </div>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Agentic AI Interface
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Start a conversation and get instant, intelligent responses to
                all your questions
              </p>
            </div>

              <div className="w-full max-w-3xl">
                <div className="relative">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.currentTarget.querySelector("input");
                      if (input.value.trim()) {
                        startChat(input.value);
                      }
                    }}
                    className="flex items-center gap-3 bg-white border border-gray-200 p-2 rounded-xl  shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all"
                  >
                    {/* Attach Button */}
                    <button
                      type="button"
                      onClick={() => console.log("Attach file")}
                      className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Input Field */}
                    <input
                      type="text"
                      placeholder="Start a conversation..."
                      className="flex-1 ppx-3 py-2 bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-500"
                    />

                    {/* Send Button */}
                    <button
                      type="submit"
                      className="flex-shrink-0 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
          </div>
        </div>
      ) : (
        // Chat Interface - Constrained Height
        <div className="h-full flex flex-col">
          {/* Header - Only show if no message sent */}
          <div 
            className={`transition-all duration-700 ease-in-out overflow-hidden ${
              isMessageSent 
                ? 'max-h-0 opacity-0 transform -translate-y-4' 
                : 'max-h-32 opacity-100 transform translate-y-0'
            }`}
          >
            <div className="text-center py-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Chat Assistant
              </h2>
              <p className="text-gray-600">
                Your intelligent conversation partner
              </p>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto pb-4 min-h-0 px-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex animate-fade-in ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-sm relative ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md mr-4"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-md ml-4"
                      }`}
                    >
                      <div className="text-sm leading-relaxed">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.role === "user" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-white text-gray-900 border border-gray-200 px-5 py-3 rounded-2xl rounded-bl-md shadow-sm ml-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-gray-500">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area - Sticky at Bottom */}
            <div 
              className={`mt-auto transition-all duration-500 ease-in-out bg-gray-50 ${
                isMessageSent ? 'animate-slide-up' : ''
              }`}
              ref={attachMenuRef}
            >
              <div className="max-w-4xl mx-auto p-4">
                {/* Selected File Preview */}
                {selectedFile && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        {selectedFile.type.startsWith('image/') ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={removeSelectedFile}
                      className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                )}

                {/* Attach Menu Dropdown */}
                {showAttachMenu && (
                  <div className="mb-3 bg-white border border-gray-200 rounded-xl shadow-lg p-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleFileSelect('image')}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Photos</p>
                          <p className="text-xs text-gray-500">Upload images</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleFileSelect('document')}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Documents</p>
                          <p className="text-xs text-gray-500">PDF, DOC, TXT</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleFileSelect('video')}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2"/>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Videos</p>
                          <p className="text-xs text-gray-500">MP4, MOV, AVI</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleFileSelect('audio')}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Audio</p>
                          <p className="text-xs text-gray-500">MP3, WAV, M4A</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputValue.trim() || selectedFile) {
                      if (selectedFile) {
                        // Handle file send
                        console.log('Sending file:', selectedFile);
                      }
                      if (inputValue.trim()) {
                        handleSend(inputValue);
                      }
                      setInputValue("");
                      setSelectedFile(null);
                    }
                  }}
                  className="flex items-center gap-3 bg-white border border-gray-600 rounded-2xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all"
                >
                  {/* Attach Button */}
                  <button
                    type="button"
                    onClick={handleFileAttach}
                    className={`flex-shrink-0 p-2 rounded-xl transition-all duration-200 ${
                      showAttachMenu 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Input Field */}
                  <textarea
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      // Auto-resize textarea
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (inputValue.trim() || selectedFile) {
                          if (selectedFile) {
                            console.log('Sending file:', selectedFile);
                          }
                          if (inputValue.trim()) {
                            handleSend(inputValue);
                          }
                          setInputValue("");
                          setSelectedFile(null);
                          e.target.style.height = 'auto';
                        }
                      }
                    }}
                    placeholder="Type your message..."
                    rows={1}
                    className="flex-1 px-4 py-2 bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-500 resize-none overflow-hidden"
                    style={{
                      minHeight: '40px',
                      maxHeight: '120px',
                    }}
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputValue.trim() && !selectedFile}
                    className={`flex-shrink-0 p-2 rounded-xl transition-all duration-200 ${
                      (inputValue.trim() || selectedFile)
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Chat;