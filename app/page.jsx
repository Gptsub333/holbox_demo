'use client';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Paperclip, Upload, Send, CheckCircle, Search, ChevronUp, ArrowRight, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';


const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
const API_PATH = '/company-chatbot/ask';
const STORAGE_KEY = 'omni_agent_messages_v1';
const USER_ID_KEY = 'omni_agent_user_id_v1';

function getOrCreateUserId() {
  try {
    const existing = localStorage.getItem(USER_ID_KEY);
    if (existing) return existing;
    // quick-n-dirty UUID v4
    const newId = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
    localStorage.setItem(USER_ID_KEY, newId);
    return newId;
  } catch {
    // fallback if localStorage/crypto unavailable
    return `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}

const OmniLogo = () => (
  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
    <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
  </div>
);

const TooltipLabel = ({ text, show }) => (
  <div
    className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-md text-lg whitespace-nowrap z-[9999] transition-all duration-300 ease-out pointer-events-none ${show ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95'
      }`}
    style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
  >
    {text}
    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
  </div>
);

const templateChats = [
  { title: 'Can you summarize long documents?', icon: Paperclip },
  { title: 'Can your system book appointments by voice?', icon: Upload },
  { title: 'Do have a feature to generate image based on the text', icon: CheckCircle },
];

export default function OmniAgent() {
  const [inputValue, setInputValue] = useState('');
  const [activeView, setActiveView] = useState('welcome');
  const [messages, setMessages] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const fileInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);


  // Load persisted state
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const storedConvo = localStorage.getItem(STORAGE_CONVO_KEY);
      if (Array.isArray(stored) && stored.length) {
        setMessages(stored.map((m) => ({ ...m, timestamp: m.timestamp ? new Date(m.timestamp) : new Date() })));
        setActiveView('chat');
      }
      if (storedConvo) setConversationId(storedConvo);
    } catch { }
  }, []);

  // Persist messages and conversationId
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch { }
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      try {
        localStorage.setItem(STORAGE_CONVO_KEY, conversationId);
      } catch { }
    }
  }, [conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const buildHistory = useMemo(() => {
    // Compact history for backend if needed
    return messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
      timestamp: m.timestamp ? new Date(m.timestamp).toISOString() : undefined,
    }));
  }, [messages]);

  async function callBackend({ text }) {
    const url = `${BACKEND_URL}${API_PATH}`;
    const user_id = getOrCreateUserId();

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: text || '',
        user_id,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Request failed');
      throw new Error(errText || `HTTP ${res.status}`);
    }

    // Try common fields; adjust if your backend returns a different key.
    const data = await res.json();
    const reply = data.reply ?? data.answer ?? data.response ?? data.text ?? '';

    return { reply };
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsSending(true);

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      attachedFiles: [], // backend doesn't accept files in this endpoint
    };

    setMessages((prev) => [...prev, userMessage]);
    setActiveView('chat');

    const textToSend = inputValue;
    setInputValue('');
    setIsSending(false);
    setIsLoading(true);

    try {
      const { reply } = await callBackend({ text: textToSend });
      const aiMessage = {
        id: Date.now() + 1,
        text: reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const aiMessage = {
        id: Date.now() + 1,
        text: `Sorry—something went wrong.\n\nDetails: ${String(err?.message || err)}`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachFile = () => fileInputRef.current?.click();
  const handleUploadMedia = () => mediaInputRef.current?.click();

  const handleFileSelect = (event, type) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const removeAttachedFile = (indexToRemove) => {
    setAttachedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWorldIconClick = () => {

  }

  const handleMobileMessage = (message) => {
    setInputValue(message);
    handleSendMessage();
  };
  const handleWorldIconClick = () => {

  }


  return (
    <div className="h-screen bg-gray-50">
      <div className="flex flex-col h-full  ml-0">
        {activeView === 'welcome' ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
              <section className="flex flex-col justify-center mt-[150px]">
                <div className="text-center mb-5 md:mb-8">
                  <div className="mb-6 flex justify-center">
                    <OmniLogo />
                  </div>
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">

                    Welcome To {companyName},<br />
                    Your AI Agent Awaits.

                  </h1>
                  <p className="text-gray-600 text-base md:text-base text-balance">
                    Discover smarter conversations, automated insights, and limitless creativity — all in one dashboard.
                    Let's set you up in just a few steps.
                  </p>
                </div>

                <div className="mb-8 md:mb-12 mt-4">
                  <div className="relative max-w-2xl mx-auto">

                    <div className="bg-gray-100 rounded-xl border border-gray-200 p-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ">
                      <div className="flex items-center gap-3 mb-3">
                        <Search className="w-5 h-5 ml-[10px] text-gray-400 flex-shrink-0" />


                        <textarea
                          placeholder="Ask anything OmniAI..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="border-0 focus:ring-0 bg-transparent flex-1 px-1 py-1 text-base resize-none outline-none placeholder-gray-400 min-h-[24px] max-h-32 overflow-y-auto"
                          rows={1}
                          style={{ height: 'auto' }}
                          onInput={(e) => {

                            const target = e.target;
                            target.style.height = "auto";
                            target.style.height = Math.min(target.scrollHeight, 128) + "px";

                          }}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"

                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-0 text-[16px] py-1 h-auto flex-shrink-0"

                          onClick={handleAttachFile}
                          disabled={isLoading}
                        >
                          <Paperclip className="w-4 h-4 md:mr-0" />
                          <span className="hidden md:inline">Attach</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"

                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-[16px] px-2 py-2 h-auto flex-shrink-0"
                          onClick={handleWorldIconClick} // Update function name as required
                          disabled={isLoading}
                        >
                          <Globe className="w-4 h-4 md:mr-0" />
                          <span className="hidden lg:inline">Search</span>
                        </Button>

                        {/* Right-aligning the Send button */}
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 px-2 py-2 h-auto  rounded-full flex-shrink-0 ml-auto"
                          onClick={handleSendMessage}
                          disabled={isLoading}
                        >

                          {isLoading ? (
                            <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Send className="w-4 h-4 rounded-full" />
                          )}
                        </Button>
                      </div>

                      {attachedFiles.length > 0 && (
                        <div className="mt-2">
                          <div
                            className={`flex gap-2 ${attachedFiles.length > 4 ? 'overflow-x-auto pb-2' : 'flex-wrap'}`}
                          >
                            {attachedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-lg flex items-center gap-2 flex-shrink-0"
                              >
                                <span className="truncate max-w-[120px]">{file.name}</span>
                                <button
                                  onClick={() => removeAttachedFile(index)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold"

                                />
                                <span className="truncate max-w-[120px]">{file.name}</span>
                                <button
                                  onClick={() => removeAttachedFile(index)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
                  >
                    <span>Explore use cases</span>
                    <ChevronUp
                      className={`w-4 h-4 transition-transform duration-200 ${showTemplates ? '' : 'rotate-180'}`}
                    />
                  </Button>
                </div>
              </section>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${showTemplates ? 'max-h-[2000px] opacity-100 mb-8 md:mb-12' : 'max-h-0 opacity-0 mb-0'
                  }`}
              >
                <div className="mt-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
                    Find Your Template Chats AI
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templateChats.map((template, index) => (
                      <Card
                        onClick={() => {
                          setInputValue(template.title);
                          handleSendMessage();
                        }}
                        key={index}
                        className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300 hover:-translate-y-1 bg-white"
                      >
                        <CardContent className="p-6 h-full flex flex-col">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                              <template.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 text-lg leading-relaxed font-medium">{template.title}</p>
                            </div>
                          </div>
                          <div className="mt-auto flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full w-10 h-10 p-0 group-hover:bg-blue-100 transition-all duration-300"
                              onClick={() => {
                                setInputValue(template.title);
                                handleSendMessage();
                              }}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-gray-500 text-lg mb-4">Or try these popular templates:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        'Create a project timeline',
                        'Write meeting notes',
                        'Plan a marketing campaign',
                        'Generate code documentation',
                      ].map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs text-gray-600 border-gray-300 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 bg-transparent"
                          onClick={() => {
                            setInputValue(suggestion);
                            handleSendMessage();
                          }}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 pb-28 md:pb-36">
              <div className="max-w-3xl mx-auto">
                <div className="text-center text-xs text-gray-400 mb-6">TODAY</div>

                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div key={message.id} className="animate-in fade-in-0 duration-300">
                      {message.sender === 'user' ? (
                        <div className="flex justify-end">
                          <div className="max-w-xs lg:max-md">
                            <div className="bg-blue-600 text-white rounded-2xl px-4 py-2">
                              <p className="text-lg break-words">{message.text}</p>
                            </div>
                            {message.attachedFiles && message.attachedFiles.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachedFiles.map((file, fileIndex) => (
                                  <div
                                    key={fileIndex}
                                    className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                                  >
                                    <Paperclip className="w-3 h-3" />
                                    <span className="truncate">{file.name}</span>
                                    <span className="text-blue-600 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start gap-3 mb-2">
                            <OmniLogo />
                            <span className="text-lg font-medium text-gray-900">Omni Agent</span>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm max-w-full">
                            <div className="prose prose-sm max-w-none text-gray-700">
                              <ReactMarkdown>{message.text}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="animate-in fade-in-0 duration-300">
                      <div className="flex items-start gap-3 mb-2">
                        <OmniLogo />
                        <span className="text-lg font-medium text-gray-900">Omni Agent</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl p-4 ml-11 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] bg-blue-400"></div>
                            <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] bg-blue-400"></div>
                            <div className="w-2 h-2 rounded-full animate-bounce bg-blue-400"></div>
                          </div>
                          <span className="text-lg text-gray-500">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            <div
              className={`sticky bottom-0 z-30 bg-gray-50/90 supports-[backdrop-filter]:backdrop-blur px-4 md:px-6 pb-2 md:pb-3 transition-all duration-300 ${isSending ? 'animate-pulse' : ''
                }`}
            >
              <div className="mx-auto w-full max-w-3xl">
                <div className="bg-gray-100 rounded-xl p-2 md:p-3">
                  {attachedFiles.length > 0 && (
                    <div className="mb-3">
                      <div className={`flex gap-2 ${attachedFiles.length > 4 ? 'overflow-x-auto pb-2' : 'flex-wrap'}`}>
                        {attachedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-lg flex items-center gap-2 flex-shrink-0"
                          >
                            <span className="truncate max-w-[120px]">{file.name}</span>
                            <button
                              onClick={() => removeAttachedFile(index)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-2 md:mb-3">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <textarea
                      placeholder="Ask anything OmniAI..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="border-0 focus:ring-0 bg-transparent flex-1 text-lg resize-none outline-none placeholder-gray-400 min-h-[20px] max-h-16 overflow-y-auto disabled:opacity-50"
                      rows={1}
                      style={{ height: 'auto' }}
                      onInput={(e) => {
                        const target = e.target;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 64) + 'px';
                      }}
                    />
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 px-2 py-2 h-auto  rounded-full flex-shrink-0 ml-auto"
                      onClick={handleSendMessage}
                      disabled={isLoading}
                    >

                      {isLoading ? (
                        <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4 rounded-full" />
                      )}
                    </Button>
                  </div>


                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 h-6 px-2 text-[16px] rounded-md disabled:opacity-50 flex-shrink-0"
                      onClick={handleAttachFile}
                      disabled={isLoading}
                    >
                      <Paperclip className="w-3 h-3 md:mr-0" />
                      <span className="hidden  md:inline ">Attach</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 h-6 px-2 text-[16px] rounded-md disabled:opacity-50 flex-shrink-0"
                      onClick={handleUploadMedia}
                      disabled={isLoading}
                    >
                      <Globe className="w-4 h-4 md:mr-0" />
                      <span className="hidden  md:inline">Search</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'file')}
            />
            <input
              ref={mediaInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'media')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
