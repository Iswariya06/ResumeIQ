import React from 'react';
import { FileSearch, History, ShieldCheck, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
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
  aiStatus
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">ResumeIQ</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">AI ATS Analyzer & Job Matching</p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                currentView === 'landing'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('analyze')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                currentView === 'analyze'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Analyze
            </button>
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="View past analyses"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">History</span>
            </button>
            <button
              onClick={onOpenPrivacy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Privacy Policy"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Privacy</span>
            </button>
          </nav>

          {/* AI Status Pill */}
          <div className="pl-2 border-l border-slate-200">
            {aiStatus?.model_ready ? (
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium cursor-help"
                title={`Ollama model '${aiStatus.current_model}' active and ready for local inference.`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Cpu className="w-3.5 h-3.5 hidden sm:inline" />
                <span className="hidden md:inline">Ollama AI Ready</span>
                <span className="md:hidden">AI Ready</span>
              </div>
            ) : aiStatus?.ollama_running ? (
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium cursor-help"
                title={`Ollama is active, but model '${aiStatus.current_model}' needs to be pulled. Run 'ollama pull ${aiStatus.current_model}' to enable LLM mode.`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Pull Model: {aiStatus.current_model}</span>
                <span className="md:hidden">Ollama Init</span>
              </div>
            ) : (
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium cursor-help"
                title="Ollama is offline. Deterministic rule-based analysis will run seamlessly."
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                <span className="hidden md:inline">Rule Engine Active</span>
                <span className="md:hidden">Rule Engine</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
