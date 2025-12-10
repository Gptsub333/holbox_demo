'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Briefcase, Settings, DollarSign, Crown, Grid, LayoutDashboard, Share2, About } from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';
const OmniLogo = () => (
  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
    <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
  </div>
);

const TooltipLabel = ({ text, show }) => (
  <div
    className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap z-[9999] transition-all duration-300 ease-out pointer-events-none ${show ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95'
      }`}
    style={{
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    }}
  >
    {text}
    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
  </div>
);

export default function Sidebar({ onViewChange, isMobileOpen, onMobileToggle, onOpenSearch }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 w-16 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
    >
      {/* Header */}
      <Link href="/" className="p-4 border-b border-gray-200">
        <div
          className="relative flex items-center justify-center"
          onMouseEnter={() => setHoveredItem('omni-agent')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <OmniLogo />
          {hoveredItem === 'omni-agent' && <TooltipLabel text="Agent AI" show={true} />}
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex-1 py-4">
        <nav className="space-y-2 px-2">
          <Link
            href="/dashboard"
            className="relative"
            onMouseEnter={() => setHoveredItem('dashboards')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Button
              variant="ghost"
              className="w-full justify-center text-gray-700 hover:bg-gray-100 h-10"
              onClick={() => {
                onViewChange?.('dashboard');
                onMobileToggle?.(false);
              }}
              href="/dashboard"
            >
              <BarChart3 href="/dashboard" className="w-5 h-5" />
            </Button>
            {hoveredItem === 'dashboards' && <TooltipLabel text="Dashboards" show={true} />}
          </Link>


          <Link
            href="/applications"
            className="relative"
            onMouseEnter={() => setHoveredItem('Applications')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Button
              variant="ghost"
              className="w-full justify-center text-gray-700 hover:bg-gray-100 h-10"
              onClick={() => onMobileToggle?.(false)}
            >
              <Grid className="w-5 h-5" />
            </Button>
            {hoveredItem === 'Applications' && <TooltipLabel text="Applications" show={true} />}
          </Link>
          {/* </div> */}

          <Link
            href="/upcoming"
            className="relative"
            onMouseEnter={() => setHoveredItem('Up Coming')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Button
              variant="ghost"
              className="w-full justify-center text-gray-700 hover:bg-gray-100 h-10"
              onClick={() => onMobileToggle?.(false)}
            >
              <Briefcase className="w-5 h-5" />
            </Button>
            {hoveredItem === 'Up Coming' && <TooltipLabel text="Up Coming" show={true} />}
          </Link>

          <Link
            href="/connect-to"
            className="relative"
            onMouseEnter={() => setHoveredItem('ConnectTo')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Button
              variant="ghost"
              className="w-full justify-center text-gray-700 hover:bg-gray-100 h-10"
              onClick={() => onMobileToggle?.(false)}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            {hoveredItem === 'ConnectTo' && <TooltipLabel text="Connect To" show={true} />}
          </Link>
          <Link
            href="/about"
            className="relative"
            onMouseEnter={() => setHoveredItem('about')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Button
              variant="ghost"
              className="w-full justify-center text-gray-700 hover:bg-gray-100 h-10"
              onClick={() => onMobileToggle?.(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
            </Button>
            {hoveredItem === 'about' && <TooltipLabel text="About" show={true} />}
          </Link>
          {/* <div className="p-3 border-t border-gray-200 flex items-center justify-center">
            <div
              className="relative"
              onMouseEnter={() => setHoveredItem('theme')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <ThemeToggle />
              {hoveredItem === 'theme' && (
                <TooltipLabel text="Theme" show={true} />
              )}
            </div>
          </div> */}


        </nav>
      </div>


    </div>
  );
}
