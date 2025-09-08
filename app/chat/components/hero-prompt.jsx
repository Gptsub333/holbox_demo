"use client";

import React, { useState } from "react";
import { Send, Paperclip } from "lucide-react";

export const HeroPrompt = ({ onSubmit }) => {
  console.log("HeroPrompt rendering..."); // Debug log
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    if (onSubmit) onSubmit(trimmedValue);
    setValue("");
  };

  const handleAttachFile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = "*/*";
    fileInput.onchange = (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        console.log(
          "Files selected:",
          Array.from(files).map((f) => f.name)
        );
        // Handle file upload logic here
      }
    };
    fileInput.click();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`relative flex items-center bg-chat-surface border-2 rounded-2xl transition-all duration-300 ${
          isFocused
            ? "border-chat-input-border-focus shadow-chat-glow"
            : "border-chat-input-border hover:border-chat-input-border-focus/50"
        }`}
      >
        <button
          type="button"
          onClick={handleAttachFile}
          className="ml-3 p-2 rounded-xl bg-secondary hover:bg-accent transition-colors"
        >
          <Paperclip className="w-4 h-4 text-chat-text-muted" />
        </button>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask me anything..."
          className="flex-1 bg-transparent px-4 py-3 text-sm text-chat-ai-text placeholder:text-chat-text-muted focus:outline-none"
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={!value.trim()}
          className={`mr-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
            value.trim()
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </form>
  );
};
