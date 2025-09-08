"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const ChatWindow = ({ messages, onSend, isTyping, className }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = input.trim();
    if (!trimmedMessage) return;
    onSend(trimmedMessage);
    setInput("");
  };

  return (
    <div
      className={cn(
        "flex flex-col h-[600px] bg-chat-surface rounded-2xl border border-chat-border shadow-lg",
        className
      )}
    >
      {/* Messages */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-4xl",
                  message.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={cn(
                    "flex-1 p-4 rounded-2xl max-w-[80%]",
                    message.role === "user"
                      ? "bg-message-user text-message-user-foreground ml-4"
                      : "bg-message-assistant text-message-assistant-foreground border border-chat-border mr-4"
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-2 opacity-70",
                      message.role === "user"
                        ? "text-message-user-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-4xl">
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 p-4 rounded-2xl max-w-[80%] bg-message-assistant border border-chat-border mr-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      AI is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-chat-border">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-input-field-background border border-input-field-border rounded-xl focus:outline-none focus:border-input-field-focus transition-colors text-sm"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={cn(
              "px-4 py-3 rounded-xl flex items-center justify-center transition-all duration-200",
              input.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
