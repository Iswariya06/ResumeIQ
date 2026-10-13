import React from 'react';
import { AIExplanationResult } from '../types';
import { Bot, Lightbulb, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Cpu } from 'lucide-react';

interface RecommendationsCardProps {
  aiExplanation: AIExplanationResult;
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ aiExplanation }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header with Provider Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${
            aiExplanation.ai_provider === 'ollama' ? 'bg-emerald-600' : 'bg-brand-600'
          }`}>
            {aiExplanation.ai_provider === 'ollama' ? <Bot className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">AI Explanations & Action Plan</h3>
            <p className="text-xs text-slate-500">
              Personalized assessment of candidate fit, strengths, and targeted improvements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            aiExplanation.ai_provider === 'ollama'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-brand-50 text-brand-700 border-brand-200'
          }`}>
            <Cpu className="w-3.5 h-3.5" />
            <span>{aiExplanation.model_name}</span>
          </span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
        <strong>Overview:</strong> {aiExplanation.summary}
      </div>

      {/* Strengths & Weaknesses 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Key Strengths ({aiExplanation.strengths.length})</span>
          </h4>
          <ul className="space-y-2 text-xs text-emerald-900">
            {aiExplanation.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Identified Gaps */}
        <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Identified Gaps ({aiExplanation.weaknesses.length})</span>
          </h4>
          <ul className="space-y-2 text-xs text-rose-900">
            {aiExplanation.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Priority Resume Optimizations</span>
        </h4>
        <div className="space-y-2.5">
          {aiExplanation.improvement_recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition text-xs text-slate-700"
            >
              <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Bullet Point Rewrites (STAR Method) */}
      {aiExplanation.suggested_bullet_rewrites.length > 0 && (
        <div className="pt-2">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-brand-600" />
            <span>Suggested Bullet Point Rewrites (STAR Impact Framework)</span>
          </h4>
          <div className="space-y-4">
            {aiExplanation.suggested_bullet_rewrites.map((rewrite, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50"
              >
                {/* Original */}
                <div className="p-3 bg-rose-50/60 border-b border-rose-100 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-1">
                    Original Resume Phrasing
                  </div>
                  <div className="text-rose-900 line-through opacity-85">
                    "{rewrite.original}"
                  </div>
                </div>

                {/* Suggested */}
                <div className="p-3 bg-emerald-50/60 border-b border-emerald-100 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1 mb-1">
                    <ArrowRight className="w-3 h-3" /> Recommended STAR Enhancement
                  </div>
                  <div className="text-emerald-950 font-medium">
                    "{rewrite.suggested}"
                  </div>
                </div>

                {/* Reason */}
                <div className="p-2.5 bg-white text-[11px] text-slate-500 italic">
                  <strong>Why this scores higher:</strong> {rewrite.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic Disclaimer */}
      <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
        {aiExplanation.disclaimer}
      </div>
    </div>
  );
};
