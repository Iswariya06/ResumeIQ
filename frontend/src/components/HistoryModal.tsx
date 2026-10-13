import React from 'react';
import { AnalysisHistoryItem } from '../types';
import { X, Trash2, ExternalLink, FileText } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded border border-gray-200 shadow-lg flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Analysis History</h3>
            <p className="text-xs text-gray-400">{history.length} saved records</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No history yet.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 border border-gray-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-sm text-gray-800">{item.candidate_name} <span className="text-gray-400 font-normal text-xs">— {item.resume_filename}</span></p>
                  <p className="text-xs text-gray-500">{item.job_title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.created_at} · {item.matched_skills_count} skills matched</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex gap-1.5">
                    <span className="px-2 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded">
                      ATS {Math.round(item.ats_score)}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded">
                      Match {Math.round(item.job_match_score)}
                    </span>
                  </div>
                  <button
                    onClick={() => { onSelectAnalysis(item.id); onClose(); }}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Open"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAnalysis(item.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-gray-200 text-right bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
