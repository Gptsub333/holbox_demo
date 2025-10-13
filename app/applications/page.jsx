'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  ChevronDown,
  Grid3x3,
  List,
  Shield,
  Building2,
  TrendingUp,
  LineChart,
  Mail,
  FileText,
  Clock,
  Layers,
  Code,
  Target,
  Stethoscope,
  Database,
  UserX,
  FileDigit,
  Activity,
  ScanFace,
  Clipboard,
  Users,
  FileSearch,
  Landmark,
  Shirt,
  FileX,
  Wand2,
  Video,
  BrainCircuit,
  Image,
  Mic,
  Car,
  CalendarClock,
  Mic2,
  FileType,
  Camera,
  DollarSign,
  Sparkles,
  Film,
  BarChart3,
  UserCircle2,
  ShieldCheck,
  Eye,
  AudioLines,
} from 'lucide-react';

import Link from 'next/link';

// Hub categories
const hubs = [
  { id: 'hr', name: 'HR Hub', icon: Shield, count: 3 },
  { id: 'banking', name: 'Banking & Insurance Hub', icon: Building2, count: 7 },
  { id: 'sales', name: 'Sales Hub', icon: TrendingUp, count: 3 },
  { id: 'research', name: 'Research & Analysis Hub', icon: LineChart, count: 2 },
  { id: 'marketing', name: 'Marketing Hub', icon: Mail, count: 2 },
];

// Applications grouped by category
const applications = [
  {
    id: 1,
    name: 'Health Scribe',
    description: 'This agent is powered by AI and can transcribe medical audio and get answers',
    category: 'Healthcare',
    tags: ['Healthcare', 'Productivity'],
    icon: AudioLines,
    likes: 32,
    author: 'Holbox Team',
    href: '/health-scribe',
  },
  {
    id: 2,
    name: 'NL2SQL',
    description: 'Transform natural language queries into SQL commands for instant database results',
    category: 'Data',
    tags: ['Data', 'Technology'],
    icon: Database,
    likes: 28,
    author: 'Holbox Team',
    href: '/nl2sql',
  },
  {
    id: 3,
    name: 'Face Detection By Video',
    description: 'Real-time face detection and identification from video streams',
    category: 'AI',
    tags: ['AI', 'Technology'],
    icon: Video,
    likes: 45,
    author: 'Holbox Team',
    href: '/face-recognition',
  },
  {
    id: 4,
    name: 'DDx Assistant',
    description: 'AI-powered differential diagnosis assistant for medical professionals',
    category: 'Healthcare',
    tags: ['Healthcare', 'AI'],
    icon: Stethoscope,
    likes: 24,
    author: 'Holbox Team',
    href: '/ddx-assistant',
  },
  {
    id: 5,
    name: 'PII Extractor',
    description: 'Detect and extract personal information from documents securely',
    category: 'Security',
    tags: ['Security', 'Data'],
    icon: ShieldCheck,
    likes: 19,
    author: 'Holbox Team',
    href: '/pii-extractor',
  },
  {
    id: 6,
    name: 'Summarizer',
    description: 'Automatically summarize long documents and content with AI',
    category: 'Productivity',
    tags: ['Productivity', 'AI'],
    icon: FileText,
    likes: 36,
    author: 'Holbox Team',
    href: '/summarizer',
  },
  {
    id: 7,
    name: 'Calories Counter',
    description: 'Upload food images to get calorie counts and nutritional information',
    category: 'Healthcare',
    tags: ['Healthcare', 'AI'],
    icon: Activity,
    likes: 29,
    author: 'Holbox Team',
    href: '/calories-counter',
  },
  {
    id: 8,
    name: 'Face Detection By Image',
    description: 'Detect and recognize faces from static images with high accuracy',
    category: 'AI',
    tags: ['AI', 'Technology'],
    icon: ScanFace,
    likes: 31,
    author: 'Holbox Team',
    href: '/face-detection',
  },
  {
    id: 9,
    name: 'File System Manager Agent',
    description: 'Ask questions about your S3, analyze data and know more about your storage',
    category: 'Data',
    tags: ['Data', 'Technology'],
    icon: FileSearch,
    likes: 18,
    author: 'Holbox Team',
    href: '/file-system-manager',
  },
  {
    id: 10,
    name: 'Bank Statement Analyzer',
    description: 'Upload your bank statement to instantly identify and list all merchants',
    category: 'Finance',
    tags: ['Finance', 'Technology'],
    icon: DollarSign,
    likes: 27,
    author: 'Holbox Team',
    href: '/bank-statement-analyzer',
  },
  {
    id: 11,
    name: 'Virtual Try-On',
    description: 'Try garments on models using AI-powered image processing',
    category: 'Fashion',
    tags: ['Fashion', 'AI'],
    icon: Shirt,
    likes: 22,
    author: 'Holbox Team',
    href: '/virtual-try-on',
  },
  {
    id: 12,
    name: 'PII Masker',
    description: 'Remove personally identifiable information from input text securely',
    category: 'Security',
    tags: ['Security', 'Privacy'],
    icon: Eye,
    likes: 25,
    author: 'Holbox Team',
    href: '/pii-redactor',
  },
  {
    id: 13,
    name: 'Text to Image',
    description: 'Generate stunning images from text descriptions using AI',
    category: 'AI',
    tags: ['AI', 'Creative'],
    icon: Sparkles,
    likes: 52,
    author: 'Holbox Team',
    href: '/text-to-image',
  },
  {
    id: 14,
    name: 'Text to Video',
    description: 'Generate engaging videos from text descriptions',
    category: 'AI',
    tags: ['AI', 'Video'],
    icon: Film,
    likes: 48,
    author: 'Holbox Team',
    href: '/text-to-video',
  },
  {
    id: 15,
    name: 'EDA',
    description: 'Exploratory Data Analysis of your CSV files with automated insights',
    category: 'Data',
    tags: ['Data', 'Analytics'],
    icon: BarChart3,
    likes: 33,
    author: 'Holbox Team',
    href: '/eda',
  },
  {
    id: 16,
    name: 'Professional Headshot',
    description: 'Generate polished, professional-looking headshots instantly with AI',
    category: 'AI',
    tags: ['AI', 'Photography'],
    icon: Camera,
    likes: 41,
    author: 'Holbox Team',
    href: '/ai-professional-headshot',
  },
];

// Upcoming features
const upcomingApps = [
  {
    id: 'u1',
    name: 'ConciergeAI',
    description: 'AI assistant for business inquiries and customer service',
    category: 'AI',
    tags: ['AI', 'Customer Service'],
    icon: UserCircle2,
  },
  {
    id: 'u2',
    name: 'PDF Extractor',
    description: 'Extract and process information from PDF documents',
    category: 'Productivity',
    tags: ['Productivity', 'Document'],
    icon: FileType,
  },
  {
    id: 'u3',
    name: 'Voice Agent',
    description: 'Voice-enabled booking and health assistant',
    category: 'AI',
    tags: ['AI', 'Voice'],
    icon: Mic2,
  },
  {
    id: 'u4',
    name: 'Traffic Chatbot',
    description: 'AI assistant for real-time traffic conditions and route planning',
    category: 'AI',
    tags: ['AI', 'Transportation'],
    icon: Car,
  },
];

export default function AgentMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [flippedCards, setFlippedCards] = useState({});

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? app.category.toLowerCase().includes(selectedCategory.toLowerCase())
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredUpcoming = useMemo(() => {
    return upcomingApps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const toggleFlip = (cardId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Marketplace</h1>
              <p className="text-gray-600 mt-1">
                Discover and explore a collection of Agents built by Holbox and the community. Find the perfect agent to
                enhance your workflow.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
            {/* Search Box */}
            <div className="flex gap-1 w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {/* Refresh Button */}
              <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Filters */}
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value={'AI'}>AI</option>
              <option value={'Healthcare'}>Healthcare</option>
              <option value={'Data'}>Data</option>
              <option value={'Security'}>Security</option>
            </select>

            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            >
              <option>Select Industry</option>
            </select>

            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            >
              <option>Select Function</option>
            </select>

            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Agents</option>
              <option>Holbox Agents</option>
              <option>Community Agents</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Holbox Agents Hubs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Holbox Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {hubs.map((hub) => {
              const IconComponent = hub.icon;
              return (
                <div
                  key={hub.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <IconComponent className="w-6 h-6 text-gray-700" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{hub.name}</h3>
                    <p className="text-sm text-gray-600">{hub.count} apps</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Community Agents */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredApplications.map((app) => {
              const IconComponent = app.icon;
              const isFlipped = flippedCards[app.id];

              return (
                <div key={app.id} className="relative h-80" style={{ perspective: '1000px' }}>
                  <div
                    className={`relative w-full h-full transition-transform duration-500 transform-gpu`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* Front of Card */}
                    <div
                      className="absolute w-full h-full bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      <div className="p-6 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-purple-600" />
                          </div>
                          <button
                            onClick={() => toggleFlip(app.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </div>

                        <Link href={app.href}>
                          <h3 className="font-semibold text-gray-900 mb-2">{app.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {app.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-600">By {app.author}</span>
                            {/* <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-700">{app.likes}</span>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div
                      className="absolute w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 border border-gray-200 rounded-lg shadow-lg"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="p-6 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">{app.name}</h3>
                          <button
                            onClick={() => toggleFlip(app.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4">{app.description}</p>

                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Category</h4>
                          <span className="inline-block px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full mb-4">
                            {app.category}
                          </span>

                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {app.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-white text-gray-700 rounded border border-gray-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <a
                          href={app.href}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-center block"
                        >
                          Launch Application
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Upcoming Features */}
        {filteredUpcoming.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredUpcoming.map((app) => {
                const IconComponent = app.icon;
                return (
                  <div key={app.id} className="bg-white border border-dashed border-gray-300 rounded-lg opacity-60">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Coming Soon
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-700 mb-2">{app.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{app.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {app.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredApplications.length === 0 && filteredUpcoming.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 text-center max-w-md">
              We couldn't find any agents matching "{searchQuery}". Try adjusting your search terms.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
