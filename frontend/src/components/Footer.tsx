import React from 'react';

interface FooterProps {
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy }) => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-8 text-xs text-gray-400">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>ResumeIQ — scores are estimates for self-assessment purposes only.</span>
        <div className="flex items-center gap-3">
          <button onClick={onOpenPrivacy} className="hover:text-gray-600 underline">
            Privacy
          </button>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
};
