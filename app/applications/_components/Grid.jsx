import { Star } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Grid = ({ filteredActive, viewMode }) => {
  const getIconColor = (category) => {
    const colors = {
      healthcare: 'text-red-600',
      ai: 'text-blue-600',
      security: 'text-orange-600',
      data: 'text-green-600',
      productivity: 'text-purple-600',
      health: 'text-pink-600',
      search: 'text-indigo-600',
      finance: 'text-emerald-600',
      fashion: 'text-rose-600',
      editing: 'text-cyan-600',
    };
    return colors[category] || 'text-gray-600';
  };

  const getBackgroundColor = (category) => {
    const colors = {
      healthcare: 'bg-red-100',
      ai: 'bg-blue-100',
      security: 'bg-orange-100',
      data: 'bg-green-100',
      productivity: 'bg-purple-100',
      health: 'bg-pink-100',
      search: 'bg-indigo-100',
      finance: 'bg-emerald-100',
      fashion: 'bg-rose-100',
      editing: 'bg-cyan-100',
    };
    return colors[category] || 'bg-gray-100';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <>
      <div
        className={`grid ${
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
        } gap-6`}
      >
        {filteredActive.map((app) => {
          const IconComponent = app.icon;
          return (
            <div
              key={app.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="p-6">
                <div
                  className={`flex items-center justify-center`}
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 ${getBackgroundColor(
                      app.category
                    )} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <IconComponent className={`${getIconColor(app.category)} text-xl w-6 h-6`} />
                  </div>
                </div>
                <h3 className="text-lg text-center font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {app.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 text-center min-h-10">{app.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(app.rating)}</div>
                    <span className="text-xs text-gray-500">
                      {app.rating} ({app.reviews.toLocaleString()})
                    </span>
                  </div>
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="mb-4">
                  <span className="text-xs text-gray-500">{app.tasks} tasks completed</span>
                </div>
                <Link href={app.href}>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105">
                    Launch App
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Grid;
