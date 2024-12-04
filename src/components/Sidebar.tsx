import { Home, TrendingUp, Star, Clock, Menu } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'top-rated', label: 'Top Rated', icon: Star },
    { id: 'watchlist', label: 'My Watchlist', icon: Clock },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 z-40 shadow-xl`}
      >
        <div className="p-6">
          <div className="space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentSection === item.id
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}