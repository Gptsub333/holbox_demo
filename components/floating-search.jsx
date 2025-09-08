"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import {
  X,
  Search,
  Database,
  Stethoscope,
  User,
  Video,
  FileText,
  Shirt,
  Car,
  Mic,
  Clipboard,
  UserX,
  FileX,
  FileDigit,
  Layers,
  BookOpen,
  FileSearch,
  Eye,
  StethoscopeIcon,
  CalendarClock,
  Wand2,
  ScanFace,
  Activity,
  BrainCircuit,
  Landmark,,
  ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Feature data with icons
const features = [
  {
    name: 'Health Scribe',
    href: '/health-scribe',
    icon: Stethoscope,
    description: 'Transcribe medical audio and get answers',
  },

  {
    name: 'Face Detection By Video',
    href: '/face-recognition',
    icon: User,
    description: 'Real-time detection and identification',
  },


  {
    name: 'Face Detection By Image', // New Feature
    href: '/face-detection',
    icon: ScanFace || User, // Use ScanFace, fallback to User
    description: 'Detect and recognize faces from images',
  },


  // { name: "PDF Extractor", href: "/pdf-extractor", icon: FileText, description: "Upload PDFs and chat for insights" },
  {
    name: 'DDx Assistant',
    href: '/ddx-assistant',
    icon: Clipboard,
    description: 'Differential diagnosis from symptoms',
  },
  {
    name: 'PII Extractor',
    href: '/pii-extractor',
    icon: UserX,
    description: 'Detect and extract personal information',
  },

  {
    name: "NL2SQL",
    href: "/nl2sql",
    icon: Database,
    description: "SQL queries using AI with instant results",
  },
  {
    name: "Summarizer",
    href: "/summarizer",
    icon: FileDigit,
    description: "Automatically summarize long documents and content",
  },

  {
    name: "calories-counter",
    href: "/calories-counter",
    icon: Activity,
    description:
      "Upload food images to get calorie counts and nutritional information",
  },
  {
    name: "x-ray-analysis",
    href: "/x-ray-analysis",
    icon: Stethoscope,
    description: "Analyze and report on X-ray images",
  },
  {
    name: "Handwritten to Digital Text",
    href: "handtext2text",
    icon: FileText,
    description:
      "Easily convert images of handwritten notes into editable, digital text.",
  },
  {
    name: "File System Manager Agent",
    href: "/file-system-manager",
    icon: FileSearch,
    description:
      " Ask questions about your S3, analyze S3 and know more about your data.",
  },
  {
    name: "Image Search",
    href: "/image-search",
    icon: FileSearch,
    description: "Search images using text or other images",
  },
  {
    name: "Bank Statement Analyzer",
    href: "/bank-statement-analyzer",
    icon: Landmark,
    description:
      " Upload your bank statement to instantly identify and list all merchants.",
  },
  {
    name: "Virtual Try-On",
    href: "/virtual-try-on",
    icon: Shirt,
    description: "Try garments on models using images",
  },
  {
    name: "PII Masker",
    href: "/pii-redactor",
    icon: FileX,
    description: "Remove PII from input text securely",
  },
  {
    name: "Text to Image",
    href: "/text-to-image",
    icon: Wand2,
    description: "Generate images from text descriptions",
  },
  {
    name: "Text to Video",
    href: "/text-to-video",
    icon: Video,
    description: "Generate video from text descriptions",
  },
  {
    name: "EDA",
    href: "/eda",
    icon: BrainCircuit,
    description: "Exploratory Data Analysis of data your .csv",
  },
  {
    name: "ICD Coding",
    href: "/icd-coding",
    icon: BookOpen,
    description: "Automated medical coding for healthcare documentation",
  },
];

// Upcoming features data
const upcomingFeatures = [
  {
    name: "ConciergeAI",
    href: "/concierge-ai",
    icon: User,
    description: "AI assistant for business inquiries",
  },
  {
    name: "PDF Extractor",
    href: "/pdf-extractor",
    icon: FileText,
    description: "Detect and extract personal information",
  },
  {
    name: "Voice-Agent",
    href: "/voice-agent",
    icon: Mic,
    description: "Voice-enabled booking and health assistant",
  },

  {
    name: "Video Compliance",
    href: "/video-compliance",
    icon: Video,
    description: "Analyze videos for safety and compliance",
  },

  {
    name: "Traffic Chatbot",
    href: "/traffic-chatbot",
    icon: Car,
    description: "AI assistant for traffic conditions",
  },

  {
    name: "Enterprise Search",
    icon: FileSearch,
    description: "Advanced search across all enterprise data",
  },
  {
    name: "Structured Extraction",
    icon: Layers,
    description: "Extract structured data from unstructured content",
  },
  {
    name: "AI Meeting Insights",
    icon: CalendarClock,
    description: "Get insights and summaries from meeting recordings",
  },

  // { name: "ICD Coding", icon: BookOpen, description: "Automated medical coding for healthcare documentation" },
  {
    name: "Medical Copilot",
    icon: StethoscopeIcon,
    description: "AI assistant for medical professionals",
  },
];

export function FloatingSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [filteredFeatures, setFilteredFeatures] = useState(features);
  const [filteredUpcoming, setFilteredUpcoming] = useState(upcomingFeatures);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const pathname = usePathname(); // Use this line to get the current path

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the panel opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Reset search when opening
      setQuery("");
      setFilteredFeatures(features);
      setFilteredUpcoming(upcomingFeatures);
      setActiveTab("all");

      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    // Add escape key listener to close the panel
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    // Add click outside listener
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Filter features based on search query
  useEffect(() => {
    if (query) {
      const filtered = features.filter(
        (feature) =>
          feature.name.toLowerCase().includes(query.toLowerCase()) ||
          feature.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFeatures(filtered);

      const filteredUp = upcomingFeatures.filter(
        (feature) =>
          feature.name.toLowerCase().includes(query.toLowerCase()) ||
          feature.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUpcoming(filteredUp);
    } else {
      setFilteredFeatures(features);
      setFilteredUpcoming(upcomingFeatures);
    }
  }, [query]);

  const handleFeatureClick = (href) => {
    router.push(href);
    onClose();
  };

  const handleUpcomingClick = (name) => {
    router.push("/upcoming");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={panelRef}
            className={cn(
              "w-[95%] sm:w-full max-w-4xl bg-[#0f0f11] rounded-xl border border-gray-800 shadow-xl",
              "overflow-hidden",
              "mx-auto" // Centered horizontally
            )}
            style={{ maxHeight: "90vh" }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3,
            }}
          >
            <div className="p-3 sm:p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-100 heading-font">
                  Applications
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-gray-800 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-3.5 h-3.5 text-gray-300" />
                </button>
              </div>

              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-3 w-3 text-gray-400" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search applications..."
                  className={cn(
                    "w-full pl-8 pr-4 py-1.5 rounded-lg text-xs",
                    "bg-gray-900 border border-gray-700",
                    "text-gray-100 placeholder-gray-400 mono-font",
                    "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  )}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  className={cn(
                    "px-2.5 py-0.5 text-[10px] rounded-md",
                    activeTab === "all"
                      ? "bg-blue-900 text-blue-100 font-medium"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  )}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </button>
                <button
                  className={cn(
                    "px-2.5 py-0.5 text-[10px] rounded-md",
                    activeTab === "features"
                      ? "bg-blue-900 text-blue-100 font-medium"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  )}
                  onClick={() => setActiveTab("features")}
                >
                  Features
                </button>
                <button
                  className={cn(
                    "px-2.5 py-0.5 text-[10px] rounded-md",
                    activeTab === "upcoming"
                      ? "bg-blue-900 text-blue-100 font-medium"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  )}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming
                </button>
              </div>
            </div>

            <div
              ref={contentRef}
              className="p-4 sm:p-5 overflow-y-auto custom-scrollbar"
              style={{
                maxHeight: "calc(90vh - 100px)",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {/* Current Features Section */}
              {(activeTab === "all" || activeTab === "features") &&
                filteredFeatures.length > 0 && (
                  <div className="mb-8">
                    {activeTab === "all" && (
                      <h3 className="text-xs font-medium text-gray-200 mb-3 subheading-font">
                        Available Features
                      </h3>
                    )}
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {filteredFeatures.map((feature, index) => (
                        <motion.button
                          key={feature.href}
                          onClick={() => handleFeatureClick(feature.href)}
                          className={cn(
                            "group",
                            pathname === feature.href
                              ? "bg-gray-900 border-blue-900 text-blue-600"
                              : "bg-gray-900 text-gray-200"
                          )}
                          initial={{
                            opacity: pathname === feature.href ? 1 : 0,
                            y: pathname === feature.href ? 0 : 20,
                          }} // Apply initial animation based on active state
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            ease: [0.25, 0.1, 0.25, 1.0],
                          }}
                        >
                          <div
                            className={cn(
                              "flex flex-col items-center p-3 sm:p-4 rounded-md",
                              "transition-all duration-300",
                              pathname === feature.href
                                ? "border-blue-500 shadow-md scale-105"
                                : "border-gray-700 group-hover:border-blue-500 group-hover:shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                            )}
                          >
                            <div className="flex items-center justify-center w-full mb-2.5">
                              <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 transform group-hover:-translate-y-3">
                                <div className="absolute inset-0 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:border-blue-500 group-hover:shadow-[0_0_12px_rgba(37,99,235,0.5)] transition-all duration-300">
                                  <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
                                </div>
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-200 text-center subheading-font group-hover:text-white transition-colors duration-300 w-full mt-2">
                              {feature.name}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-400 text-center mt-1.5 para-font group-hover:text-gray-300 transition-colors duration-300 w-full">
                              {feature.description}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Upcoming Features Section */}
              {(activeTab === "all" || activeTab === "upcoming") &&
                filteredUpcoming.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs font-medium text-gray-200 mb-3 subheading-font">
                      Upcoming Features
                    </h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {filteredUpcoming.map((feature, index) => (
                        <motion.button
                          key={index}
                          className="group"
                          onClick={() => handleUpcomingClick(feature.name)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05 + 0.2,
                            ease: [0.25, 0.1, 0.25, 1.0],
                          }}
                          whileHover={{
                            scale: 1.03,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <div
                            className={cn(
                              "flex flex-col items-center p-3 sm:p-4 rounded-md",
                              "bg-gray-900 border border-gray-700 border-dashed",
                              "transition-all duration-300",
                              "group-hover:border-blue-500 group-hover:shadow-md group-hover:shadow-blue-900/20",
                              "h-auto min-h-[100px] sm:min-h-[110px]", // Increased height
                              "w-full" // Full width
                            )}
                          >
                            <div className="flex items-center justify-center w-full mb-2.5">
                              <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 transform group-hover:-translate-y-3">
                                <div className="absolute inset-0 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:border-blue-500 group-hover:shadow-[0_0_12px_rgba(37,99,235,0.5)] transition-all duration-300">
                                  <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                                </div>
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-1 rounded-full bg-transparent group-hover:bg-blue-500/30 transition-all duration-300 blur-sm"></div>
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-200 text-center subheading-font group-hover:text-white transition-colors duration-300 w-full mt-2">
                              {feature.name}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-500 text-center mt-1.5 para-font group-hover:text-gray-400 transition-colors duration-300 w-full">
                              {feature.description}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-blue-400 mt-1.5 font-medium group-hover:text-blue-300 mono-font">
                              Coming Soon
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

              {/* No Results State */}
              {((activeTab === "features" && filteredFeatures.length === 0) ||
                (activeTab === "upcoming" && filteredUpcoming.length === 0) ||
                (activeTab === "all" &&
                  filteredFeatures.length === 0 &&
                  filteredUpcoming.length === 0)) && (
                <motion.div
                  className="flex flex-col items-center justify-center py-8 sm:py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3 sm:mb-4">
                    <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-200 mb-2 subheading-font">
                    No results found
                  </h3>
                  <p className="text-gray-400 text-center text-xs para-font">
                    We couldn't find any applications matching "{query}"
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
