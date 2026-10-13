import React from 'react';
import { AIExplanationResult } from '../types';
import { ArrowRight } from 'lucide-react';

interface RecommendationsCardProps {
  aiExplanation: AIExplanationResult;
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ aiExplanation }) => {
  return (
    <div className="bg-white border border-gray-200 rounded p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-semibold text-gray-800">AI Feedback & Recommendations</h3>
        <span className="text-xs text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
          {aiExplanation.ai_provider === 'ollama' ? aiExplanation.model_name : 'Rule-based engine'}
        </span>
      </div>

      {/* Summary */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
        {aiExplanation.summary}
      </div>

      {/* Strengths & Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-green-200 rounded p-4 bg-green-50">
          <h4 className="text-xs font-semibold text-green-800 uppercase mb-2">Strengths</h4>
          <ul className="space-y-1.5 text-xs text-green-900">
            {aiExplanation.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-red-200 rounded p-4 bg-red-50">
          <h4 className="text-xs font-semibold text-red-800 uppercase mb-2">Gaps</h4>
          <ul className="space-y-1.5 text-xs text-red-900">
            {aiExplanation.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-red-500 font-bold mt-0.5">•</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">What to Improve</h4>
        <div className="space-y-2">
          {aiExplanation.improvement_recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2.5 border border-gray-200 rounded text-xs text-gray-700 bg-gray-50">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              {rec}
            </div>
          ))}
        </div>
      </div>

      {/* Bullet Rewrites */}
      {aiExplanation.suggested_bullet_rewrites.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Bullet Point Suggestions</h4>
          <div className="space-y-3">
            {aiExplanation.suggested_bullet_rewrites.map((rewrite, idx) => (
              <div key={idx} className="border border-gray-200 rounded overflow-hidden text-xs">
                <div className="p-2.5 bg-red-50 border-b border-red-100">
                  <p className="text-[10px] font-semibold text-red-600 uppercase mb-0.5">Original</p>
                  <p className="text-red-800 line-through">"{rewrite.original}"</p>
                </div>
                <div className="p-2.5 bg-green-50 border-b border-green-100">
                  <p className="text-[10px] font-semibold text-green-700 uppercase mb-0.5 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> Suggested
                  </p>
                  <p className="text-green-900 font-medium">"{rewrite.suggested}"</p>
                </div>
                <div className="p-2 bg-white text-gray-500 italic">
                  Why: {rewrite.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-gray-400 border-t border-gray-100 pt-3">
        {aiExplanation.disclaimer}
      </p>
    </div>
  );
};
