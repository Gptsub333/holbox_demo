'use client';

import React, { useState, useMemo } from 'react';
import Header from './_components/Header';
import Grid from './_components/Grid';
import Upcoming from './_components/Upcoming';
import {
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
  FileSearch,
  CalendarClock,
  Wand2,
  ScanFace,
  Activity,
  BrainCircuit,
  Landmark,
  ImageIcon,
} from 'lucide-react';

const features = [
  {
    name: 'Health Scribe',
    href: '/health-scribe',
    icon: Stethoscope,
    description: 'Transcribe medical audio and get answers',
    rating: 4.8,
    reviews: 2913,
    tasks: '25.2K',
    status: 'active',
    category: 'healthcare',
  },
  {
    name: 'Face Detection By Video',
    href: '/face-recognition',
    icon: User,
    description: 'Real-time detection and identification',
    rating: 4.9,
    reviews: 1847,
    tasks: '18.5K',
    status: 'active',
    category: 'ai',
  },
  {
    name: 'Face Detection By Image',
    href: '/face-detection',
    icon: ScanFace,
    description: 'Detect and recognize faces from images',
    rating: 4.7,
    reviews: 1256,
    tasks: '12.3K',
    status: 'active',
    category: 'ai',
  },
  {
    name: 'DDx Assistant',
    href: '/ddx-assistant',
    icon: Clipboard,
    description: 'Differential diagnosis from symptoms',
    rating: 4.6,
    reviews: 892,
    tasks: '8.9K',
    status: 'active',
    category: 'healthcare',
  },
  {
    name: 'PII Extractor',
    href: '/pii-extractor',
    icon: UserX,
    description: 'Detect and extract personal information',
    rating: 4.5,
    reviews: 634,
    tasks: '6.2K',
    status: 'active',
    category: 'security',
  },
  {
    name: 'NL2SQL',
    href: '/nl2sql',
    icon: Database,
    description: 'SQL queries using AI with instant results',
    rating: 4.8,
    reviews: 2156,
    tasks: '15.7K',
    status: 'active',
    category: 'data',
  },
  {
    name: 'Summarizer',
    href: '/summarizer',
    icon: FileDigit,
    description: 'Automatically summarize long documents and content',
    rating: 4.7,
    reviews: 1789,
    tasks: '14.2K',
    status: 'active',
    category: 'productivity',
  },
  {
    name: 'Calories Counter',
    href: '/calories-counter',
    icon: Activity,
    description: 'Upload food images to get calorie counts and nutritional information',
    rating: 4.6,
    reviews: 1423,
    tasks: '11.8K',
    status: 'active',
    category: 'health',
  },
  {
    name: 'X-ray Analysis',
    href: '/x-ray-analysis',
    icon: Stethoscope,
    description: 'Analyze and report on X-ray images',
    rating: 4.9,
    reviews: 756,
    tasks: '5.4K',
    status: 'active',
    category: 'healthcare',
  },
  {
    name: 'Handwritten to Digital Text',
    href: '/handtext2text',
    icon: FileText,
    description: 'Easily convert images of handwritten notes into editable, digital text.',
    rating: 4.5,
    reviews: 1089,
    tasks: '9.3K',
    status: 'active',
    category: 'productivity',
  },
  {
    name: 'File System Manager Agent',
    href: '/file-system-manager',
    icon: FileSearch,
    description: 'Ask questions about your S3, analyze S3 and know more about your data.',
    rating: 4.4,
    reviews: 567,
    tasks: '4.2K',
    status: 'active',
    category: 'data',
  },
  {
    name: 'Image Search',
    href: '/image-search',
    icon: FileSearch,
    description: 'Search images using text or other images',
    rating: 4.6,
    reviews: 892,
    tasks: '7.1K',
    status: 'active',
    category: 'search',
  },
  {
    name: 'Bank Statement Analyzer',
    href: '/bank-statement-analyzer',
    icon: Landmark,
    description: 'Upload your bank statement to instantly identify and list all merchants.',
    rating: 4.7,
    reviews: 1234,
    tasks: '8.7K',
    status: 'active',
    category: 'finance',
  },
  {
    name: 'Virtual Try-On',
    href: '/virtual-try-on',
    icon: Shirt,
    description: 'Try garments on models using images',
    rating: 4.3,
    reviews: 445,
    tasks: '3.8K',
    status: 'active',
    category: 'fashion',
  },
  {
    name: 'PII Masker',
    href: '/pii-redactor',
    icon: FileX,
    description: 'Remove PII from input text securely',
    rating: 4.5,
    reviews: 623,
    tasks: '5.9K',
    status: 'active',
    category: 'security',
  },
  {
    name: 'Text to Image',
    href: '/text-to-image',
    icon: Wand2,
    description: 'Generate images from text descriptions',
    rating: 4.8,
    reviews: 3456,
    tasks: '28.9K',
    status: 'active',
    category: 'ai',
  },
  {
    name: 'Text to Video',
    href: '/text-to-video',
    icon: Video,
    description: 'Generate video from text descriptions',
    rating: 4.9,
    reviews: 2913,
    tasks: '25.2K',
    status: 'active',
    category: 'ai',
  },
  {
    name: 'EDA',
    href: '/eda',
    icon: BrainCircuit,
    description: 'Exploratory Data Analysis of data your .csv',
    rating: 4.2,
    reviews: 1567,
    tasks: '12.4K',
    status: 'active',
    category: 'data',
  },
  {
    name: 'Image Editing',
    href: '/image-editing',
    icon: Wand2,
    description: 'Edit images with AI using text queries',
    rating: 4.6,
    reviews: 2189,
    tasks: '19.3K',
    status: 'active',
    category: 'editing',
  },
  {
    name: 'Professional Headshot',
    href: '/ai-professional-headshot',
    icon: ImageIcon,
    description: 'Generate polished, professional-looking headshots instantly with AI.',
    rating: 5.0,
    reviews: 1089,
    tasks: '9.8K',
    status: 'active',
    category: 'ai',
  },
  {
    name: 'AI Image Editor',
    href: '/ai-image-editor',
    icon: Wand2,
    description: 'Edit images with AI using text queries',
    rating: 4.1,
    reviews: 654,
    tasks: '5.2K',
    status: 'active',
    category: 'editing',
  },
  {
    name: 'Medical Code Extractor',
    href: '/medical-code-extractor',
    icon: Stethoscope,
    description: 'Extract medical codes from healthcare documents',
    rating: 4.3,
    reviews: 432,
    tasks: '3.1K',
    status: 'active',
    category: 'healthcare',
  },
];

// Upcoming features data
const upcomingFeatures = [
  {
    name: 'ConciergeAI',
    href: '/concierge-ai',
    icon: User,
    description: 'AI assistant for business inquiries',
    status: 'coming-soon',
    category: 'ai',
  },
  {
    name: 'PDF Extractor',
    href: '/pdf-extractor',
    icon: FileText,
    description: 'Detect and extract personal information',
    status: 'coming-soon',
    category: 'productivity',
  },
  {
    name: 'Voice Agent',
    href: '/voice-agent',
    icon: Mic,
    description: 'Voice-enabled booking and health assistant',
    status: 'coming-soon',
    category: 'ai',
  },
  {
    name: 'Video Compliance',
    href: '/video-compliance',
    icon: Video,
    description: 'Analyze videos for safety and compliance',
    status: 'coming-soon',
    category: 'security',
  },
  {
    name: 'Traffic Chatbot',
    href: '/traffic-chatbot',
    icon: Car,
    description: 'AI assistant for traffic conditions',
    status: 'coming-soon',
    category: 'ai',
  },
  {
    name: 'Enterprise Search',
    href: '/enterprise-search',
    icon: FileSearch,
    description: 'Advanced search across all enterprise data',
    status: 'coming-soon',
    category: 'search',
  },
  {
    name: 'Structured Extraction',
    href: '/structured-extraction',
    icon: Layers,
    description: 'Extract structured data from unstructured content',
    status: 'coming-soon',
    category: 'data',
  },
  {
    name: 'AI Meeting Insights',
    href: '/ai-meeting-insights',
    icon: CalendarClock,
    description: 'Get insights and summaries from meeting recordings',
    status: 'coming-soon',
    category: 'productivity',
  },
];

export default function AIImageEditor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Filter features based on search and tab
  const { filteredActive, filteredUpcoming } = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    const filteredActive = features.filter(
      (feature) =>
        feature.name.toLowerCase().includes(searchLower) ||
        feature.description.toLowerCase().includes(searchLower) ||
        feature.category.toLowerCase().includes(searchLower)
    );

    const filteredUpcoming = upcomingFeatures.filter(
      (feature) =>
        feature.name.toLowerCase().includes(searchLower) ||
        feature.description.toLowerCase().includes(searchLower) ||
        feature.category.toLowerCase().includes(searchLower)
    );

    return { filteredActive, filteredUpcoming };
  }, [searchQuery]);

 
  
  const shouldShowActive = activeTab === 'all' || activeTab === 'features';
  const shouldShowUpcoming = activeTab === 'all' || activeTab === 'upcoming';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Applications Section */}
        {shouldShowActive && filteredActive.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'all' ? 'Featured Applications' : 'Available Features'}
              </h2>
              <span className="text-sm text-gray-500">{filteredActive.length} applications</span>
            </div>
            <Grid filteredActive={filteredActive} viewMode={viewMode} />
          </section>
        )}
        {shouldShowUpcoming && filteredUpcoming.length > 0 && (
          <Upcoming filteredUpcoming={filteredUpcoming} />
        )}

        {/* No Results State */}
        {filteredActive.length === 0 && filteredUpcoming.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 text-center max-w-md">
              We couldn't find any applications matching "{searchQuery}". Try adjusting your search terms.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
