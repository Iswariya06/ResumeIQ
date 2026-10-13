import React from 'react';
import { AnalysisHistoryItem } from '../types';
import { X, Trash2, ExternalLink, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisHistoryItem[];
  onSelectAnalysis: (id: string) => void;
  onDeleteAnalysis: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectAnalysis,
  onDeleteAnalysis,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Analysis History</h3>
            <p className="text-xs text-slate-500">Locally saved resume evaluations ({history.length} records)</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 custom-scrollbar flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p>No past analyses found.</p>
              <p className="text-slate-400 mt-1">Upload a resume on the Analyze page to view records here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{item.candidate_name}</span>
                    <span className="text-xs text-slate-500">• {item.resume_filename}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium truncate max-w-sm">
                    {item.job_title}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.created_at}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.matched_skills_count} skills matched
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex gap-2 text-center">
                    <div className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="text-[10px] uppercase font-bold text-blue-700">ATS</div>
                      <div className="text-xs font-black text-blue-900">{Math.round(item.ats_score)}</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200">
                      <div className="text-[10px] uppercase font-bold text-indigo-700">MATCH</div>
                      <div className="text-xs font-black text-indigo-900">{Math.round(item.job_match_score)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                    <button
                      onClick={() => {
                        onSelectAnalysis(item.id);
                        onClose();
                      }}
                      className="p-2 rounded-lg text-brand-600 hover:bg-brand-50 transition"
                      title="Open full analysis"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAnalysis(item.id)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
