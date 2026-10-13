import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Academic Project Notice:</strong> ATS Readiness and Job Matching scores are heuristic estimations based on standard parsing benchmarks, not official employer decisions.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenPrivacy}
            className="flex items-center gap-1 text-slate-600 hover:text-brand-600 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local Privacy Guarantee</span>
          </button>
          <span>•</span>
          <span>ResumeIQ © 2026</span>
        </div>
      </div>
    </footer>
  );
};
