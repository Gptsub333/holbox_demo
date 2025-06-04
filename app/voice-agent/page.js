"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { WavRecorder, WavStreamPlayer } from "/lib/wavtools/index.js";
import React from "react";
import EnvironmentNotification from "./_components/EnvironmentNotification";
import Header from "./_components/Header";
import VisualizationPanel from "./_components/VisualizationPanel";
import MainConversationPanel from "./_components/MainConversationPanel";
import MemoryPanel from "./_components/MemoryPanel";

export default function VoiceAgent() {
  /**
   * Instantiate:
   * - WavRecorder (speech input)
   * - WavStreamPlayer (speech output)
   * - RealtimeClient (API client)
   */
  const wavRecorderRef = useRef(new WavRecorder({ sampleRate: 16000 }));
  const wavStreamPlayerRef = useRef(new WavStreamPlayer({ sampleRate: 16000 }));
  // const clientRef = useRef(null);
  const wsRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  /**
   * References for
   * - Rendering audio visualization (canvas)
   * - Autoscrolling event logs
   * - Timing delta for event log displays
   */
  const clientCanvasRef = useRef(null);
  const serverCanvasRef = useRef(null);
  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef(null);
  const isInitialLoad = useRef(true);

  /**
   * All of our variables for displaying application state
   * - items are all conversation items (dialog)
   * - realtimeEvents are event logs, which can be expanded
   * - memoryKv is for set_memory() function
   * - coords, marker are for get_weather() function
   */
  const [items, setItems] = useState([]);
  const [memoryKv, setMemoryKv] = useState({});
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [realtimeEvents, setRealtimeEvents] = useState([]);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationMode, setConversationMode] = useState("push-to-talk");
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [conversationState, setConversationState] = useState("disconnected");
  const [audioContext, setAudioContext] = useState(null);
  const [audioProcessor, setAudioProcessor] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [userScrolled, setUserScrolled] = useState(false);

  // Initialize audio context and processor
  useEffect(() => {
    const initAudioProcessing = async () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const processor = ctx.createScriptProcessor(1024, 1, 1);
        setAudioContext(ctx);
        setAudioProcessor(processor);
      } catch (error) {
        console.error("Error initializing audio processor:", error);
      }
    };

    initAudioProcessing();

    return () => {
      if (audioProcessor) {
        audioProcessor.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);
  useEffect(() => {
    if (!navigator?.mediaDevices?.getUserMedia) return;

    // Store original function
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices
    );

    // Audio constraints
    const audioConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
        channelCount: 1,
        sampleRate: 16000,
        sampleSize: 16,
      },
    };

    // Override getUserMedia
    navigator.mediaDevices.getUserMedia = async (constraints = {}) => {
      return await originalGetUserMedia({
        ...audioConstraints,
        ...constraints,
      });
    };

    // Cleanup function
    return () => {
      try {
        // Need to pass audio constraints when getting stream
        originalGetUserMedia(audioConstraints)
          .then((stream) => {
            stream.getTracks().forEach((track) => track.stop());
          })
          .catch((e) => {});
      } catch (e) {}
    };
  }, []);
  useEffect(() => {
    return () => {
      // Stop any playing audio when component unmounts
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 11000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);
  useEffect(() => {
    return () => {
      // Cleanup audio URLs when component unmounts
      items.forEach((item) => {
        if (item.formatted?.file?.url) {
          URL.revokeObjectURL(item.formatted.file.url);
        }
      });
    };
  }, [items]);
  useEffect(() => {
    // Cleanup function
    return () => {
      const recorder = wavRecorderRef.current;
      const player = wavStreamPlayerRef.current;

      // Stop recording if active
      try {
        if (recorder.getStatus() === "recording") {
          recorder.pause();
          recorder.end();
        }
      } catch (e) {}

      // Stop playback if active
      try {
        player.interrupt();
      } catch (e) {}

      // Clean up WebSocket
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);
  // Auto-scroll to bottom when new messages come in, but only if user hasn't manually scrolled up
  useEffect(() => {
    if (isInitialLoad.current || !items.length) {
      isInitialLoad.current = false;
      return;
    }
    if (messagesEndRef.current && !userScrolled) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [items, userScrolled]);

  // Handle scroll events to detect manual scrolling
  const handleScroll = useCallback((e) => {
    const element = e.target;
    const isAtBottom =
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      ) < 50;
    setUserScrolled(!isAtBottom);
  }, []);

  // Function to scroll to bottom manually
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUserScrolled(false);
    }
  }, []);

  /**
   * Disconnect and reset conversation state
   */

  const disconnectConversation = useCallback(async () => {
    try {
      // Stop any playing assistant audio first
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
        setIsAssistantSpeaking(false);
      }

      // Stop recording if active
      const recorder = wavRecorderRef.current;
      if (recorder.getStatus() === "recording") {
        await recorder.pause();
        await recorder.end();
      }

      // Close WebSocket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      // Reset all states
      setIsRecording(false);
      setIsConnected(false);
      setItems([]);
      setConversationState("disconnected");
    } catch (error) {
      console.error("Error during disconnect:", error);
    }
  }, [currentAudio]);
  // Start real-time recording
  const startRealtimeRecording = useCallback(async () => {
    // Stop any playing assistant audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsAssistantSpeaking(false);
    }

    const recorder = wavRecorderRef.current;

    try {
      // First check if there's an existing recording session
      const currentStatus = recorder.getStatus();
      if (currentStatus === "recording") {
        await recorder.pause();
      }

      // End any existing session before starting new one
      try {
        await recorder.end();
      } catch (e) {}

      // Initialize new recording session
      await recorder.begin();

      await recorder.record((data) => {
        if (
          wsRef.current?.readyState === WebSocket.OPEN &&
          !isAssistantSpeaking
        ) {
          try {
            const audioData =
              data.mono instanceof ArrayBuffer
                ? new Int16Array(data.mono)
                : new Int16Array(data.mono.buffer);
            console.log("Sending audio chunk:", audioData);
            wsRef.current.send(audioData.buffer);
          } catch (error) {
            console.error("Error sending audio chunk:", error);
          }
        }
      });

      setIsRecording(true);
    } catch (error) {
      console.error("Real-time recording error:", error);
      setIsRecording(false);

      // Cleanup on error
      try {
        await recorder.end();
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    }
  }, [isAssistantSpeaking]);

  // Stop real-time recording
  const stopRealtimeRecording = useCallback(async () => {
    setIsRealtimeActive(false);
    const recorder = wavRecorderRef.current;
    if (recorder.getStatus() === "recording") {
      await recorder.pause();
    }
  }, []);

  const playAssistantAudio = useCallback(
    async (audioBuffer) => {
      try {
        if (conversationMode === "real-time") {
          await stopRealtimeRecording();
        }

        setIsAssistantSpeaking(true);

        const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio();

        // Store the audio element reference
        setCurrentAudio(audio);

        audio.addEventListener("error", (e) => {
          console.error("Audio error:", e);
          setIsAssistantSpeaking(false);
          setCurrentAudio(null);
        });

        audio.addEventListener("ended", async () => {
          setIsAssistantSpeaking(false);
          setCurrentAudio(null);
          if (conversationMode === "real-time") {
            await startRealtimeRecording();
          }
        });

        try {
          const player = wavStreamPlayerRef.current;
          if (!player.audioContext) {
            const AudioContext =
              window.AudioContext || window.webkitAudioContext;
            player.audioContext = new AudioContext();
            player.analyser = player.audioContext.createAnalyser();
            player.analyser.fftSize = 2048;
          }

          audio.src = url;
          await new Promise((resolve) => {
            audio.addEventListener("loadedmetadata", resolve, { once: true });
          });

          const source = player.audioContext.createMediaElementSource(audio);
          source.connect(player.analyser);
          player.analyser.connect(player.audioContext.destination);

          await audio.play();

          setItems((prev) => {
            const lastItem = prev[prev.length - 1];
            if (lastItem?.role === "assistant") {
              return prev.map((item, index) => {
                if (index === prev.length - 1) {
                  return {
                    ...item,
                    formatted: {
                      ...item.formatted,
                      file: { url },
                    },
                  };
                }
                return item;
              });
            }
            return prev;
          });
        } catch (audioError) {
          console.error("Audio context error:", audioError);
          await audio.play().catch(console.error);
        }
      } catch (error) {
        console.error("Error in playAssistantAudio:", error);
        setIsAssistantSpeaking(false);
        setCurrentAudio(null);
      }
    },
    [conversationMode, startRealtimeRecording, stopRealtimeRecording]
  );

  const connectConversation = useCallback(async () => {
    isInitialLoad.current = true;
    setUserScrolled(false);
    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket(
      `wss://${process.env.NEXT_PUBLIC_BACKEND_URL}/voice_agent/voice`
    );
    ws.binaryType = "arraybuffer";
    ws.onopen = async () => {
      setIsConnected(true);
      try {
        await wavRecorderRef.current.begin();
        await wavStreamPlayerRef.current.connect();

        // Send initial message
        const initialMessage = {
          event: "initial_message",
          text: "Hello",
          mode: conversationMode, // Send conversation mode to backend
        };

        ws.send(JSON.stringify(initialMessage));

        // Start real-time recording if in real-time mode
        if (conversationMode === "real-time") {
          startRealtimeRecording();
        }
      } catch (error) {
        console.error("Error during connection setup:", error);
      }
    };
    ws.onmessage = async (event) => {
      try {
        if (typeof event.data === "string") {
          const msg = JSON.parse(event.data);
          if (msg.type === "ping") {
            ws.send(JSON.stringify({ type: "pong" }));
            return;
          }
          // Handle start_speaking event
          if (msg.type === "start_speaking") {
            setConversationState("speaking");
            setIsAssistantSpeaking(true);
            return;
          }

          // Handle different message types
          switch (msg.type) {
            // Switch to push-to-talk mode if background noise is much
            case "chat_noise":
              setConversationMode("push-to-talk");

              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                  JSON.stringify({
                    event: "set_mode",
                    mode: "push-to-talk",
                  })
                );
              }
              // Stop real-time recording if active
              if (isRecording) {
                await stopRealtimeRecording();
              }
              // Add message to conversation
              setItems((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  role: "assistant",
                  formatted: { text: msg.content },
                },
              ]);
              break;

            case "chat_response":
              if (msg.transcript) {
                setItems((prev) => [
                  ...prev,
                  {
                    id: Date.now() - 1,
                    role: "user",
                    formatted: { text: msg.transcript },
                  },
                ]);
              }

              if (msg.content) {
                //Assistant response
                setItems((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    role: "assistant",
                    formatted: { text: msg.content },
                  },
                ]);
              }
              break;

            case "tool_call":
              // Handle tool call results
              const toolData = msg.data;
              if (toolData.name === "set_memory") {
                // Update memory state
                const { key, value } = toolData.arguments;
                setMemoryKv((prev) => ({ ...prev, [key]: value }));

                // Add to conversation
                setItems((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    role: "tool",
                    type: "memory",
                    formatted: {
                      text: `Saved information: ${key} = ${value}`,
                    },
                  },
                ]);
              } else if (toolData.name === "submit_booking") {
                // Show booking success
                setShowBookingSuccess(true);

                // Add to conversation
                setItems((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    role: "tool",
                    type: "booking",
                    formatted: {
                      text: `Booking submitted: ${JSON.stringify(
                        toolData.arguments
                      )}`,
                    },
                  },
                ]);
              }
              break;

            case "error":
              console.error("Server error:", msg.content);
              break;
          }
        } else if (event.data instanceof ArrayBuffer) {
          if (conversationMode === "real-time" && isRecording) {
            await stopRealtimeRecording();
          }
          try {
            // Play the audio and handle visualization
            await playAssistantAudio(event.data);
          } catch (error) {
            console.error("Error handling audio response:", error);
          } finally {
            // When audio playback completes, transition back to listening
            if (conversationMode === "real-time") {
              setConversationState("listening");
              startRealtimeRecording();
            }
          }
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setConversationState("disconnected");
    };
    ws.onerror = (err) => console.error("WebSocket error:", err);

    wsRef.current = ws;
  }, [
    conversationMode,
    isRecording,
    playAssistantAudio,
    startRealtimeRecording,
    stopRealtimeRecording,
  ]);

  /**
   * In push-to-talk mode, start recording
   * .appendInputAudio() for each sample
   */

  const startRecording = useCallback(async () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsAssistantSpeaking(false);
    }

    try {
      const recorder = wavRecorderRef.current;
      const currentStatus = recorder.getStatus();

      // Clean up existing session
      try {
        if (currentStatus === "recording") {
          await recorder.pause();
        }
        await recorder.end();
      } catch (e) {}

      // Initialize new recording session
      await recorder.begin();
      setIsRecording(true);

      await recorder.record((data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          try {
            // Send raw audio data without processing
            const audioData =
              data.mono instanceof ArrayBuffer
                ? new Int16Array(data.mono)
                : new Int16Array(data.mono.buffer);

            wsRef.current.send(audioData.buffer);
          } catch (error) {
            console.error("Error processing audio chunk:", error);
          }
        }
      });
    } catch (error) {
      console.error("Recording error:", error);
      setIsRecording(false);
    }
  }, []);

  /**
   * In push-to-talk mode, stop recording
   */
  const stopRecording = useCallback(async () => {
    if (!isConnected) return;

    try {
      const recorder = wavRecorderRef.current;
      const ws = wsRef.current;
      const currentStatus = recorder.getStatus();

      if (currentStatus === "recording") {
        // First pause recording

        await recorder.pause();

        // Send end of turn signal
        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: "end_of_turn", final: true }));
        }

        // End recording session

        await recorder.end();
      }

      // Reset state
      setIsRecording(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
      setIsRecording(false);

      // Force cleanup on error
      try {
        await wavRecorderRef.current.end();
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    }
  }, [isConnected]);

  /**
   * Toggle conversation mode between push-to-talk and real-time
   */
  const toggleConversationMode = useCallback(async () => {
    if (!isConnected) return;

    const newMode =
      conversationMode === "push-to-talk" ? "real-time" : "push-to-talk";

    // First stop any ongoing recording
    if (isRecording) {
      await stopRecording();
      setIsRecording(false);
    }

    // Stop real-time recording if active
    if (conversationMode === "real-time") {
      await stopRealtimeRecording();
    }

    // Set the new mode
    setConversationMode(newMode);

    // Notify backend about mode change
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event: "set_mode",
          mode: newMode,
        })
      );
    }

    // Start real-time recording only if switching to real-time mode
    if (newMode === "real-time") {
      await startRealtimeRecording();
    }
  }, [
    isConnected,
    conversationMode,
    isRecording,
    stopRecording,
    stopRealtimeRecording,
    startRealtimeRecording,
  ]);
  /**
   * Auto-scroll the event logs
   */
  useEffect(() => {
    if (eventsScrollRef.current) {
      const el = eventsScrollRef.current;
      const scrollHeight = el.scrollHeight;
      if (scrollHeight !== eventsScrollHeightRef.current) {
        el.scrollTop = scrollHeight;
        eventsScrollHeightRef.current = scrollHeight;
      }
    }
  }, [realtimeEvents]);

  /**
   * Auto-scroll the conversation logs
   */
  useEffect(() => {
    requestAnimationFrame(() => {
      const els = document.querySelectorAll("[data-conversation-content]");
      els.forEach((el) => {
        const scrollable =
          el.querySelector("[data-radix-scroll-area-viewport]") || el;
        if (scrollable) scrollable.scrollTop = scrollable.scrollHeight;
      });
    });
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <EnvironmentNotification
        showNotification={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <Header isConnected={isConnected} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          <VisualizationPanel
            clientCanvasRef={clientCanvasRef}
            serverCanvasRef={serverCanvasRef}
            isRecording={isRecording}
            isAssistantSpeaking={isAssistantSpeaking}
            isConnected={isConnected}
            conversationMode={conversationMode}
            toggleConversationMode={toggleConversationMode}
            disconnectConversation={disconnectConversation}
            connectConversation={connectConversation}
            startRecording={startRecording}
            stopRecording={stopRecording}
            startRealtimeRecording={startRealtimeRecording}
            stopRealtimeRecording={stopRealtimeRecording}
          />

          <div className="lg:col-span-3">
            <MainConversationPanel
              items={items}
              showBookingSuccess={showBookingSuccess}
              memoryKv={memoryKv}
              userScrolled={userScrolled}
              scrollToBottom={scrollToBottom}
              handleScroll={handleScroll}
              messagesEndRef={messagesEndRef}
              scrollAreaRef={scrollAreaRef}
            />
          </div>
        </div>

        <MemoryPanel memoryKv={memoryKv} />
      </div>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-none {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

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

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
