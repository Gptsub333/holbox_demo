"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function ChatbotPanel({ chatbotType, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I'm the ${chatbotType.name}. How can I assist you today?`,
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      switch (chatbotType.id) {
        case "traffic":
          response = "Based on current traffic data, I recommend taking the alternate route via Highway 101."
          break
        case "health":
          response =
            "I understand your symptoms. Based on the information provided, you might want to consult with a healthcare professional."
          break
        default:
          response = "I understand your question. Let me provide you with the information you need."
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    }, 1000)

    setInput("")
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30" onClick={onClose} />
      <div className={cn("fixed inset-y-0 z-40 border-l bg-white shadow-lg", "w-full sm:max-w-md right-0")}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-blue-900 text-white">
            <h2 className="text-lg font-medium heading-font">{chatbotType.name}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-blue-800"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex max-w-[80%] items-start gap-2 rounded-lg px-3 py-2 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.role === "assistant" && <Bot className="mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />}
                    <div className="text-sm para-font">{message.content}</div>
                    {message.role === "user" && <User className="mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 sm:p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 mono-font text-sm"
              />
              <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
