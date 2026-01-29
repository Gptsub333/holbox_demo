"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { WavRecorder, WavStreamPlayer } from "../../lib/wavtools/index";
import React from "react";
import EnvironmentNotification from "./_components/EnvironmentNotification";
import Header from "./_components/Header";
import VisualizationPanel from "./_components/VisualizationPanel";
import MainConversationPanel from "./_components/MainConversationPanel";
import MemoryPanel from "./_components/MemoryPanel";
import { useAuthContext } from "../../context/AuthContext";  // Import the context

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

  const { sessionToken, isLoaded, isSignedIn } = useAuthContext(); // Get the session token from the context
  const token = "Bearer " + sessionToken;



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
          .catch((e) => { });
      } catch (e) { }
    };
  }, []);
  useEffect(() => {
    return () => {
      const player = wavStreamPlayerRef.current;
      if (player) {
        if (player.analyser) {
          player.analyser.disconnect();
          player.analyser = null;
        }
        if (player.audioContext) {
          player.audioContext.close();
          player.audioContext = null;
        }
      }
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
      } catch (e) { }

      // Stop playback if active
      try {
        player.interrupt();
      } catch (e) { }

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
  const getWebSocketState = (state) => {
    const states = {
      0: "CONNECTING",
      1: "OPEN",
      2: "CLOSING",
      3: "CLOSED",
    };
    return states[state] || "UNKNOWN";
  };
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

      // Clean up WavStreamPlayer audio context
      const player = wavStreamPlayerRef.current;
      if (player) {
        if (player.analyser) {
          player.analyser.disconnect();
          player.analyser = null;
        }
        if (player.audioContext) {
          await player.audioContext.close();
          player.audioContext = null;
        }
      }

      // Stop recording if active
      const recorder = wavRecorderRef.current;
      const currentStatus = recorder.getStatus();
      if (currentStatus === "recording") {
        await recorder.pause();
      }
      try {
        await recorder.end();
      } catch (e) {
        console.log("No active session to end");
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
      // Ensure recorder is cleaned up even on error
      try {
        await wavRecorderRef.current.end();
      } catch (e) { }
    }
  }, [currentAudio]);

  const startRealtimeRecording = useCallback(async () => {
    // Stop any playing assistant audio completely
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsAssistantSpeaking(false);

      // Clean up audio context
      const player = wavStreamPlayerRef.current;
      if (player) {
        if (player.analyser) {
          player.analyser.disconnect();
          player.analyser = null;
        }
        if (player.audioContext) {
          await player.audioContext.close();
          player.audioContext = null;
        }
      }
    }

    const recorder = wavRecorderRef.current;

    try {
      const currentStatus = recorder.getStatus();
      if (currentStatus === "recording") {
        await recorder.pause();
      }

      try {
        await recorder.end();
      } catch (e) { }

      // Initialize new recording session
      await recorder.begin();
      console.log("Started real-time recording");

      // Set recording state before starting to record
      setIsRecording(true);

      await recorder.record((data) => {
        // Remove isAssistantSpeaking check since we handle it by stopping assistant audio
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          try {
            const audioData =
              data.mono instanceof ArrayBuffer
                ? new Int16Array(data.mono)
                : new Int16Array(data.mono.buffer);
            wsRef.current.send(audioData.buffer);
            console.log("Sent audio chunk:", audioData.length);
          } catch (error) {
            console.error("Error sending audio:", error);
          }
        }
      });
    } catch (error) {
      console.error("Real-time recording error:", error);
      setIsRecording(false);

      try {
        await recorder.end();
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    }
  }, [currentAudio]);

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

        const player = wavStreamPlayerRef.current;

        // Always create a new audio context for each playback
        if (player.audioContext) {
          await player.audioContext.close();
          player.audioContext = null;
          player.analyser = null;
        }
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        player.audioContext = new AudioContext();
        player.analyser = player.audioContext.createAnalyser();
        player.analyser.fftSize = 2048;

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

  // const connectConversation = useCallback(async () => {
  //   try {
  //     // First ensure any existing recorder session is cleaned up
  //     const recorder = wavRecorderRef.current;
  //     const currentStatus = recorder.getStatus();

  //     if (currentStatus === "recording") {
  //       await recorder.pause();
  //     }

  //     try {
  //       await recorder.end();
  //     } catch (e) {
  //       console.log("No active session to end");
  //     }

  //     // Close existing WebSocket
  //     if (wsRef.current) {
  //       wsRef.current.close();
  //       wsRef.current = null;
  //     }

  //     isInitialLoad.current = true;
  //     setUserScrolled(false);

  //     // Create new WebSocket connection
  //    const ws = new WebSocket('wss://demo.holbox.ai/api/demo_backend_v2/voice_agent/voice', token);

  //     ws.binaryType = "arraybuffer";


  //       if (!token) {
  //         console.error("Token is missing or invalid");
  //         return;
  //       }

  //     ws.onopen = async () => {
  //       setIsConnected(true);
  //       try {
  //         // Now start new recording session
  //         await recorder.begin();
  //         await wavStreamPlayerRef.current.connect();

  //         // Send initial message
  //         const initialMessage = {
  //           event: "initial_message",
  //           text: "Hello",
  //           mode: conversationMode,
  //         };

  //         ws.send(JSON.stringify(initialMessage));

  //         if (conversationMode === "real-time") {
  //           await startRealtimeRecording();
  //         }
  //       } catch (error) {
  //         console.error("Error during connection setup:", error);
  //         // Cleanup on error
  //         try {
  //           await recorder.end();
  //         } catch (e) {}
  //       }
  //     };

  //     ws.onmessage = async (event) => {
  //       try {
  //         if (typeof event.data === "string") {
  //           const msg = JSON.parse(event.data);
  //           if (msg.type === "ping") {
  //             ws.send(JSON.stringify({ type: "pong" }));
  //             return;
  //           }
  //           // Handle start_speaking event
  //           if (msg.type === "start_speaking") {
  //             setConversationState("speaking");
  //             setIsAssistantSpeaking(true);
  //             return;
  //           }

  //           // Handle different message types
  //           switch (msg.type) {
  //             // Switch to push-to-talk mode if background noise is much
  //             case "chat_noise":
  //               setConversationMode("push-to-talk");

  //               if (wsRef.current?.readyState === WebSocket.OPEN) {
  //                 wsRef.current.send(
  //                   JSON.stringify({
  //                     event: "set_mode",
  //                     mode: "push-to-talk",
  //                   })
  //                 );
  //               }
  //               // Stop real-time recording if active
  //               if (isRecording) {
  //                 await stopRealtimeRecording();
  //               }
  //               // Add message to conversation
  //               setItems((prev) => [
  //                 ...prev,
  //                 {
  //                   id: Date.now(),
  //                   role: "assistant",
  //                   formatted: { text: msg.content },
  //                 },
  //               ]);
  //               break;

  //             case "chat_response":
  //               if (msg.transcript) {
  //                 setItems((prev) => [
  //                   ...prev,
  //                   {
  //                     id: Date.now() - 1,
  //                     role: "user",
  //                     formatted: { text: msg.transcript },
  //                   },
  //                 ]);
  //               }

  //               if (msg.content) {
  //                 //Assistant response
  //                 setItems((prev) => [
  //                   ...prev,
  //                   {
  //                     id: Date.now(),
  //                     role: "assistant",
  //                     formatted: { text: msg.content },
  //                   },
  //                 ]);
  //               }
  //               break;

  //             case "tool_call":
  //               // Handle tool call results
  //               const toolData = msg.data;
  //               if (toolData.name === "set_memory") {
  //                 // Update memory state
  //                 const { key, value } = toolData.arguments;
  //                 setMemoryKv((prev) => ({ ...prev, [key]: value }));

  //                 // Add to conversation
  //                 setItems((prev) => [
  //                   ...prev,
  //                   {
  //                     id: Date.now(),
  //                     role: "tool",
  //                     type: "memory",
  //                     formatted: {
  //                       text: `Saved information: ${key} = ${value}`,
  //                     },
  //                   },
  //                 ]);
  //               } else if (toolData.name === "submit_booking") {
  //                 // Show booking success
  //                 setShowBookingSuccess(true);

  //                 // Add to conversation
  //                 setItems((prev) => [
  //                   ...prev,
  //                   {
  //                     id: Date.now(),
  //                     role: "tool",
  //                     type: "booking",
  //                     formatted: {
  //                       text: `Booking submitted: ${JSON.stringify(
  //                         toolData.arguments
  //                       )}`,
  //                     },
  //                   },
  //                 ]);
  //               }
  //               break;

  //             case "error":
  //               console.error("Server error:", msg.content);
  //               break;
  //           }
  //         } else if (event.data instanceof ArrayBuffer) {
  //           if (conversationMode === "real-time" && isRecording) {
  //             await stopRealtimeRecording();
  //           }
  //           try {
  //             // Play the audio and handle visualization
  //             await playAssistantAudio(event.data);
  //           } catch (error) {
  //             console.error("Error handling audio response:", error);
  //           } finally {
  //             // When audio playback completes, transition back to listening
  //             if (conversationMode === "real-time") {
  //               setConversationState("listening");
  //               startRealtimeRecording();
  //             }
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error handling WebSocket message:", error);
  //       }
  //     };

  //     ws.onclose = () => {
  //       setIsConnected(false);
  //       setConversationState("disconnected");
  //     };
  //     ws.onerror = (event) => {
  //       console.error("WebSocket error:", {
  //         code: ws.readyState,
  //         state: getWebSocketState(ws.readyState),
  //         url: ws.url,
  //         timestamp: new Date().toISOString(),
  //       });

  //       // Clean up resources on error
  //       setIsConnected(false);
  //       setConversationState("disconnected");

  //       // Attempt reconnection or show user feedback
  //       if (wsRef.current) {
  //         wsRef.current.close();
  //         wsRef.current = null;
  //       }
  //     };
  //     wsRef.current = ws;
  //   } catch (error) {
  //     console.error("Connection error:", error);
  //     // Ensure cleanup on any error
  //     try {
  //       await wavRecorderRef.current.end();
  //     } catch (e) {}
  //   }
  // }, [
  //   conversationMode,
  //   isRecording,
  //   playAssistantAudio,
  //   startRealtimeRecording,
  //   stopRealtimeRecording,
  // ]);

  const connectConversation = useCallback(async () => {
    try {
      // Step 1: Ensure any existing recorder session is cleaned up
      const recorder = wavRecorderRef.current;
      const currentStatus = recorder.getStatus();

      if (currentStatus === "recording") {
        await recorder.pause();
      }

      try {
        await recorder.end();
      } catch (e) {
        console.log("No active session to end");
      }

      // Step 2: Close existing WebSocket if there's an active connection
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      isInitialLoad.current = true;
      setUserScrolled(false);

      // Step 3: Ensure token is available and valid
      // const token = getToken(); // Replace with your method of obtaining the token

      if (!token) {
        console.error("Token is missing or invalid");
        return;
      }

      // Step 4: Create new WebSocket connection
      const ws = new WebSocket(`wss://demo.holbox.ai/api/demo_backend_v2/voice_agent/voice?token=${token}`);

      ws.binaryType = "arraybuffer";

      ws.onopen = async () => {
        setIsConnected(true);
        try {
          // Step 5: Send the authentication message after WebSocket is opened
          const authMessage = {
            type: "authenticate",
            token: token, // Send token in the first message to authenticate
          };
          ws.send(JSON.stringify(authMessage));

          // Step 6: Start a new recording session
          await recorder.begin();
          await wavStreamPlayerRef.current.connect();

          // Send initial message for conversation start
          const initialMessage = {
            event: "initial_message",
            text: "Hello",
            mode: conversationMode,
          };
          ws.send(JSON.stringify(initialMessage));

          if (conversationMode === "real-time") {
            await startRealtimeRecording();
          }
        } catch (error) {
          console.error("Error during connection setup:", error);
          // Cleanup on error
          try {
            await recorder.end();
          } catch (e) { }
        }
      };

      ws.onmessage = async (event) => {
        try {
          // Handle received messages from WebSocket
          if (typeof event.data === "string") {
            const msg = JSON.parse(event.data);
            if (msg.type === "ping") {
              ws.send(JSON.stringify({ type: "pong" }));
              return;
            }

            // Handle various event types like start_speaking, chat_response, etc.
            handleWebSocketMessages(msg, ws);
          } else if (event.data instanceof ArrayBuffer) {
            // Handle audio data
            await playAssistantAudio(event.data);
          }
        } catch (error) {
          console.error("Error handling WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setConversationState("disconnected");
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setIsConnected(false);
        setConversationState("disconnected");

        // Clean up resources on error
        if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
        }
      };

      wsRef.current = ws; // Store the WebSocket connection reference

    } catch (error) {
      console.error("Connection error:", error);
      try {
        await wavRecorderRef.current.end();
      } catch (e) {
        console.error("Error during cleanup:", e);
      }
    }
  }, [conversationMode, isRecording, playAssistantAudio, startRealtimeRecording, stopRealtimeRecording]);

  // Handle WebSocket messages
  const handleWebSocketMessages = (msg, ws) => {
    switch (msg.type) {
      case "chat_noise":
        setConversationMode("push-to-talk");
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: "set_mode", mode: "push-to-talk" }));
        }
        if (isRecording) {
          stopRealtimeRecording();
        }
        setItems((prev) => [...prev, { id: Date.now(), role: "assistant", formatted: { text: msg.content } }]);
        break;

      case "chat_response":
        if (msg.transcript) {
          setItems((prev) => [...prev, { id: Date.now() - 1, role: "user", formatted: { text: msg.transcript } }]);
        }
        if (msg.content) {
          setItems((prev) => [...prev, { id: Date.now(), role: "assistant", formatted: { text: msg.content } }]);
        }
        break;

      case "tool_call":
        // Handle tool call results like "set_memory" or "submit_booking"
        break;

      case "error":
        console.error("Server error:", msg.content);
        break;

      default:
        console.log("Unknown message type:", msg.type);
    }
  };


  /**
   * In push-to-talk mode, start recording
   * .appendInputAudio() for each sample
   */

  const startRecording = useCallback(async () => {
    // Stop any playing assistant audio completely
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsAssistantSpeaking(false);

      // Clean up audio context
      const player = wavStreamPlayerRef.current;
      if (player) {
        if (player.analyser) {
          player.analyser.disconnect();
          player.analyser = null;
        }
        if (player.audioContext) {
          await player.audioContext.close();
          player.audioContext = null;
        }
      }
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
      } catch (e) { }

      // Initialize new recording session
      await recorder.begin();
      setIsRecording(true);

      await recorder.record((data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          try {
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
  }, [currentAudio]);
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

    try {
      // Stop any ongoing recording and audio playback
      if (isRecording) {
        await stopRecording();
        setIsRecording(false);
      }

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
        setIsAssistantSpeaking(false);
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
    } catch (error) {
      console.error("Error toggling mode:", error);
    }
  }, [
    isConnected,
    conversationMode,
    isRecording,
    currentAudio,
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
