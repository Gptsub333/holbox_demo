import {
  Mic,
  MicOff,
  Activity,
  Volume2,
  ChevronUp,
  ChevronDown,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import Button from "./Button";
import AudioVisualization from "./AudioVisualization";
import { Card, CardContent, ScrollArea } from "./Card";
import { Avatar, AvatarFallback } from "./Avatar";

export default function VisualizationPanel({
  clientCanvasRef,
  serverCanvasRef,
  isRecording,
  isAssistantSpeaking,
  isConnected,
  conversationMode,
  toggleConversationMode,
  disconnectConversation,
  connectConversation,
  startRecording,
  stopRecording,
  startRealtimeRecording,
  stopRealtimeRecording,
}) {
  const [isVisualizationExpanded, setIsVisualizationExpanded] = useState(true);

  return (
    <Card className="min-h-[400px] lg:h-[calc(100vh-8rem)] overflow-y-auto scrollbar-none">
      <CardContent className="p-0 h-full flex flex-col justify-between">
        <div className="lg:hidden">
          <button
            onClick={() => setIsVisualizationExpanded(!isVisualizationExpanded)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-t-lg"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Audio Controls
            </span>
            {isVisualizationExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        <div
          className={`flex-1 flex flex-col ${
            isVisualizationExpanded ? "block" : "hidden lg:flex"
          }`}
        >
          <ScrollArea className="flex-1 p-4">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Activity className="w-5 h-5 text-blue-600" />
              Audio Visualization
            </h3>

            <div className="space-y-3">
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Voice
                  </span>
                </div>
                <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                  <AudioVisualization
                    canvasRef={clientCanvasRef}
                    isActive={isRecording}
                    color="blue"
                  />
                  {isRecording && (
                    <div className="absolute top-2 right-2 animate-fade-in">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-red-600 font-medium">
                          REC
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI Response
                  </span>
                </div>
                <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                  <AudioVisualization
                    canvasRef={serverCanvasRef}
                    isActive={isAssistantSpeaking}
                    color="blue"
                  />
                </div>
              </div>
            </div>

            {isConnected && (
              <div className="mt-4 p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Conversation Mode
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      if (conversationMode !== "push-to-talk")
                        toggleConversationMode();
                    }}
                    variant={
                      conversationMode === "push-to-talk"
                        ? "compact"
                        : "outline"
                    }
                    size="compact"
                    className="w-full justify-start"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Push-to-Talk
                  </Button>
{/*                   <Button
                    onClick={() => {
                      if (conversationMode !== "real-time")
                        toggleConversationMode();
                    }}
                    variant={
                      conversationMode === "real-time" ? "compact" : "outline"
                    }
                    size="compact"
                    className="w-full justify-start"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Real-Time
                  </Button> */}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {conversationMode === "push-to-talk"
                    ? "Hold to speak, release to send"
                    : "Speaking is detected automatically"}
                </p>
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="space-y-2">
              <Button
                onClick={
                  isConnected ? disconnectConversation : connectConversation
                }
                variant={isConnected ? "destructive" : "default"}
                size="compact"
                className="w-full"
              >
                {isConnected ? (
                  <>
                    <X className="w-4 h-4 mr-2" /> Disconnect
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" /> Connect
                  </>
                )}
              </Button>

              {isConnected && conversationMode === "push-to-talk" && (
                <Button
                  variant={isRecording ? "recording" : "outline"}
                  size="compact"
                  className={`w-full transition-all duration-300 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" /> Release to Send
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" /> Push to Talk
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
