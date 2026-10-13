import React from 'react';
import { History, ShieldCheck } from 'lucide-react';
import { AIStatusResponse } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'analyze' | 'results';
  setCurrentView: (view: 'landing' | 'analyze' | 'results') => void;
  onOpenHistory: () => void;
  onOpenPrivacy: () => void;
  aiStatus: AIStatusResponse | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenHistory,
  onOpenPrivacy,
}) => {
  return (
    <header className="bg-white border-b border-gray-300">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div
          onClick={() => setCurrentView('landing')}
          className="cursor-pointer font-bold text-xl text-indigo-700"
        >
          ResumeIQ
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-1.5 rounded text-sm ${
              currentView === 'landing'
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('analyze')}
            className={`px-3 py-1.5 rounded text-sm ${
              currentView === 'analyze'
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Analyze
          </button>
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-100"
          >
            <History className="w-4 h-4" />
            History
          </button>
          <button
            onClick={onOpenPrivacy}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-100"
          >
            <ShieldCheck className="w-4 h-4" />
            Privacy
          </button>
        </nav>
      </div>
    </header>
  );
};
