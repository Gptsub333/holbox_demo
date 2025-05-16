import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Send } from "lucide-react";

export default function ChatModal({
  chatModalOpen,
  setChatModalOpen,
  chatMessages,
  currentQuestion,
  setCurrentQuestion,
  handleChatSubmit,
  isLoadingAnswer,
  formatResponseText,
}) {
  return (
    <AnimatePresence>
      {chatModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex  items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white  rounded-xl shadow-xl  w-[90%] max-w-[700px] "
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
          >
            <motion.div
              className="flex items-center justify-between p-6 border-b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold heading-font">Ask Questions</h2>
              <button
                onClick={() => setChatModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            <ChatMessagesArea
              chatMessages={chatMessages}
              isLoadingAnswer={isLoadingAnswer}
              formatResponseText={formatResponseText}
              setCurrentQuestion={setCurrentQuestion}
              handleChatSubmit={handleChatSubmit}
            />

            <ChatInputForm
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              handleChatSubmit={handleChatSubmit}
              isLoadingAnswer={isLoadingAnswer}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Chat messages display area with examples if no messages
function ChatMessagesArea({
  chatMessages,
  isLoadingAnswer,
  formatResponseText,
  setCurrentQuestion,
  handleChatSubmit,
}) {
  const chatContainerRef = React.useRef(null);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div ref={chatContainerRef} className="h-80  overflow-y-auto p-6">
      {chatMessages.length === 0 ? (
        <motion.div
          className="flex flex-col items-centerjustify-center h-full text-center text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MessageSquare className="w-10 h-10 mb-4 text-blue-500 opacity-70" />
          <p className="text-sm font-medium mb-1">Ask Questions About This Transcript</p>
          <p className="text-xs text-muted-foreground mb-6">
            Get insights and information from the transcribed content
          </p>
          <div className="grid grid-cols-1 gap-3 w-full">
            <ExampleQuestionButton
              question="What are the key points in this transcript?"
              setCurrentQuestion={setCurrentQuestion}
              handleChatSubmit={handleChatSubmit}
            />
            <ExampleQuestionButton
              question="Can you summarize this transcript?"
              setCurrentQuestion={setCurrentQuestion}
              handleChatSubmit={handleChatSubmit}
            />
            <ExampleQuestionButton
              question="What medical terms are mentioned?"
              setCurrentQuestion={setCurrentQuestion}
              handleChatSubmit={handleChatSubmit}
            />
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {chatMessages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 border border-gray-200"
                }`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <div className="text-sm">
                  {message.sender === "ai"
                    ? formatResponseText(message.text)
                    : message.text}
                </div>
              </motion.div>
            </motion.div>
          ))}

          {isLoadingAnswer && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center max-w-[80%]">
                <div className="flex items-center space-x-1 mr-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// Single example question button
function ExampleQuestionButton({ question, setCurrentQuestion, handleChatSubmit }) {
  return (
    <motion.button
      className="text-left text-sm bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
      whileHover={{ scale: 1.02, backgroundColor: "#dbeafe" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        setCurrentQuestion(question);
        handleChatSubmit({ preventDefault: () => {} });
      }}
    >
      {question}
    </motion.button>
  );
}

// Chat input form component
function ChatInputForm({ currentQuestion, setCurrentQuestion, handleChatSubmit, isLoadingAnswer }) {
  return (
    <form onSubmit={handleChatSubmit} className="p-6 border-t bg-white rounded-b-xl">
      <div className="flex items-center space-x-2">
        <motion.input
          type="text"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          placeholder="Ask a question about the transcript..."
          className="flex-1 rounded-full border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        <motion.button
          type="submit"
          disabled={isLoadingAnswer || !currentQuestion.trim()}
          className={`rounded-full p-3 text-white ${
            isLoadingAnswer || !currentQuestion.trim()
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </form>
  );
}
