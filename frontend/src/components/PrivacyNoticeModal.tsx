import React from 'react';
import { X, ShieldCheck, HardDrive, Lock, Trash2, HeartHandshake } from 'lucide-react';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Privacy & Data Governance</h3>
              <p className="text-xs text-slate-500">Local-first architecture and candidate data protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 custom-scrollbar">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <HardDrive className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">100% Local Processing</strong>
              <span>
                All resume text extraction, scoring computations, and semantic similarity evaluations execute locally on your machine.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">No External Cloud LLMs</strong>
              <span>
                ResumeIQ never sends your resume text to third-party commercial APIs (such as OpenAI or Google Cloud). When AI insights are enabled, inference runs through your local Ollama instance on <code className="bg-slate-200 px-1 rounded">localhost:11434</code>.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Trash2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Automatic Temporary File Disposal</strong>
              <span>
                Uploaded resume files are processed in-memory or in short-lived temporary files that are purged immediately following parsing. Raw resume documents are not permanently archived.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <HeartHandshake className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Unbiased Algorithmic Scoring</strong>
              <span>
                Scoring algorithms exclusively analyze demonstrated technical skills, domain experiences, and structural formatting. Candidate personal identifiers (such as name, gender, phone number, and email) are never weighted in score calculations.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
