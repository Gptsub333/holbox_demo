import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2 } from "lucide-react"; // Import the loader icon
import ReactMarkdown from "react-markdown";  // Import react-markdown
import remarkGfm from "remark-gfm";  // Import remark-gfm for GitHub-flavored markdown
import { useUser } from "@clerk/nextjs";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/ai_concierge/ask"; // Your backend URL

export default function ChatbotPanel({ messages, setMessages, input, setInput }) {
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const [loading, setLoading] = useState(false); // State to track loading
  const { user, isLoaded } = useUser(); // Get user data from Clerk

  // Ensure the user is loaded before sending the API call
  if (!isLoaded || !user) {
    console.error("User data not loaded.");
    return;
  }

  // Scroll to the bottom of the messages when new messages are added
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom(); // Automatically scroll to the bottom whenever the messages change
  }, [messages]);

  // Handle sending messages and interacting with the backend
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;  // Don't send if input is empty

    // Add the user's message to the chat
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
    ]);

    // Set loading state to true while waiting for the response
    setLoading(true);

    // Send the user's message to the backend API
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,  // Pass the Clerk user ID
          question: input,   // Use `input` here for the user's question
        }),
      });

      const data = await response.json();  // Parse the JSON response

      if (data?.answer) {
        // Assuming the backend returns an "answer" property with the assistant's response
        const assistantMessage = data.answer;

        // Add the assistant's response to the chat
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
    } finally {
      setLoading(false);  // Set loading to false after response is received
    }

    setInput("");  // Clear the input field after sending
  };


  return (
    <div className="bg-card border rounded-lg h-[600px] flex flex-col">
      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[85%] items-start gap-2 rounded-lg px-3 py-2 ${message.role === "user"
                  ? "bg-blue-500 text-white" // Blue background for user
                  : "bg-gray-100 text-gray-800" // Gray background for assistant
                  }`}
              >
                {message.role === "assistant" && (
                  <Bot className="mt-1 h-4 w-4 shrink-0 text-primary" />
                )}
                {/* Render Markdown content here */}
                <div className="text-sm leading-relaxed">
                  <ReactMarkdown children={message.content} remarkPlugins={[remarkGfm]} />
                </div>
                {message.role === "user" && (
                  <User className="mt-1 h-4 w-4 shrink-0" />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center py-2">
          <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your files or data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-blue-600">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
