import React from 'react';
import { X } from 'lucide-react';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white w-full max-w-lg rounded border border-gray-200 shadow-lg flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Privacy & Data</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto text-sm text-gray-600 space-y-4 custom-scrollbar">
          <div className="border border-gray-200 rounded p-3 bg-gray-50">
            <p className="font-semibold text-gray-800 mb-1">100% Local Processing</p>
            <p className="text-xs">All resume parsing, scoring, and analysis happens locally on your machine. Nothing is sent to external servers.</p>
          </div>
          <div className="border border-gray-200 rounded p-3 bg-gray-50">
            <p className="font-semibold text-gray-800 mb-1">No Cloud AI</p>
            <p className="text-xs">AI features use a local Ollama instance on <code className="bg-gray-200 px-1 rounded">localhost:11434</code>. If Ollama is not running, a rule-based engine is used instead.</p>
          </div>
          <div className="border border-gray-200 rounded p-3 bg-gray-50">
            <p className="font-semibold text-gray-800 mb-1">No Permanent File Storage</p>
            <p className="text-xs">Uploaded resume files are read in-memory and immediately discarded. Only the analysis results are stored locally in SQLite.</p>
          </div>
          <div className="border border-gray-200 rounded p-3 bg-gray-50">
            <p className="font-semibold text-gray-800 mb-1">Fair Scoring</p>
            <p className="text-xs">Scores are based purely on technical skills and formatting. Personal details like name and phone number are never used in scoring.</p>
          </div>
        </div>

        <div className="p-3 border-t border-gray-200 text-right bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded hover:bg-gray-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
