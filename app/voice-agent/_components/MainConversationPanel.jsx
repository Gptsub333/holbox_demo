import {
  ChevronDown,
  Settings,
  User,
  Activity,
  MessageSquare,
} from "lucide-react";
import { useRef, useCallback } from "react";
import { Card, CardContent } from "./Card";
import { Avatar, AvatarFallback } from "./Avatar";
import BookingSuccess from "./BookingSuccess";

export default function MainConversationPanel({
  items,
  showBookingSuccess,
  memoryKv,
  userScrolled,
  scrollToBottom,
  handleScroll,
  messagesEndRef,
  scrollAreaRef,
}) {
  const renderBookingSuccess = () => (
    <BookingSuccess showBookingSuccess={showBookingSuccess} />
  );

  return (
    <Card className="h-[600px] lg:h-[calc(100vh-8rem)] flex flex-col overflow-hidden relative">
      <div
        className="flex-1 overflow-y-auto scrollbar-none"
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        <div className="p-4 space-y-4">
          {items && items.length > 0 ? (
            items.map((item) => {
              if (item.role === "tool") {
                return (
                  <div key={item.id} className="flex gap-3 animate-fade-in">
                    <Avatar className="w-8 h-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <AvatarFallback>
                        <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          System
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 transform transition-all duration-300 hover:scale-[1.02]">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {item.formatted?.text || "System update"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className={`flex gap-3 animate-fade-in ${
                    item.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar
                    className={`w-8 h-8 flex-shrink-0 ${
                      item.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <AvatarFallback>
                      {item.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`flex-1 min-w-0 ${
                      item.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {item.role === "user" ? "You" : "AI Assistant"}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-lg max-w-[85%] transform transition-all duration-300 hover:scale-[1.02] ${
                        item.role === "user" ? "ml-auto" : "mr-auto"
                      } ${
                        item.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      }`}
                    >
                      <div className="text-sm">
                        {item.formatted?.text || "No text available"}
                      </div>
                    </div>

                    {item.formatted?.file?.url && (
                      <div
                        className={`mt-2 ${
                          item.role === "user" ? "text-right" : ""
                        }`}
                      >
                        <audio
                          src={item.formatted.file.url}
                          controls
                          className="h-8 rounded-md"
                        />
                      </div>
                    )}

                    {showBookingSuccess && renderBookingSuccess()}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center mb-4 shadow-md">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Ready to Help
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md text-sm">
                Click the Connect button to begin your conversation with the AI
                Health Assistant.
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {userScrolled && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 animate-fade-in z-10"
          title="Scroll to bottom"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </Card>
  );
}
