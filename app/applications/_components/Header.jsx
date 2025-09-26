"use client"
import { Grid3X3, List, Search } from 'lucide-react';
import React from 'react';

const Header = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, viewMode, setViewMode }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-2 rounded-md text-sm font-medium border-b-2 ${
                    activeTab === 'all'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 border-transparent'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`px-3 py-2 rounded-md text-sm font-medium border-b-2 ${
                    activeTab === 'features'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 border-transparent'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-3 py-2 rounded-md text-sm font-medium border-b-2 ${
                    activeTab === 'upcoming'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 border-transparent'
                  }`}
                >
                  Upcoming
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 border-0 rounded-lg px-4 py-2 pl-10 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;