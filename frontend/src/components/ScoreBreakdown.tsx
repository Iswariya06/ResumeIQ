import React, { useState } from 'react';
import { ATSScoreResult, JobMatchResult } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ScoreBreakdownProps {
  atsResult: ATSScoreResult;
  jobResult: JobMatchResult;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ atsResult, jobResult }) => {
  const [activeTab, setActiveTab] = useState<'ats' | 'job'>('ats');
  const [expandedFactor, setExpandedFactor] = useState<number | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded p-5">
      <div className="flex border-b border-gray-200 mb-5 gap-1">
        <button
          onClick={() => setActiveTab('ats')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'ats' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          ATS Factors
        </button>
        <button
          onClick={() => setActiveTab('job')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'job' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Job Match Criteria
        </button>
      </div>

      {activeTab === 'ats' && (
        <div className="space-y-2">
          {atsResult.factors.map((factor, idx) => {
            const isExpanded = expandedFactor === idx;
            const pct = Math.round((factor.earned_score / factor.max_score) * 100);

            return (
              <div key={factor.name} className="border border-gray-200 rounded overflow-hidden">
                <div
                  onClick={() => setExpandedFactor(isExpanded ? null : idx)}
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    {factor.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                    {factor.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                    {factor.status === 'fail' && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{factor.name}</p>
                      <p className="text-xs text-gray-400">{factor.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">{factor.earned_score} <span className="text-xs font-normal text-gray-400">/ {factor.max_score}</span></p>
                      <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
                        <div
                          className={`h-full rounded-full ${
                            factor.status === 'pass' ? 'bg-green-500' :
                            factor.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-3 border-t border-gray-100 text-xs space-y-2">
                    <p className="text-gray-700"><strong>Feedback:</strong> {factor.feedback}</p>
                    <p className="text-indigo-700 bg-indigo-50 border border-indigo-100 p-2 rounded">
                      <strong>Tip:</strong> {factor.actionable_tip}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Observations</h4>
              <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                {atsResult.structural_observations.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </div>
            <div className="border border-amber-200 rounded p-3 bg-amber-50">
              <h4 className="text-xs font-semibold text-amber-700 uppercase mb-2">Warnings ({atsResult.formatting_warnings.length})</h4>
              {atsResult.formatting_warnings.length > 0 ? (
                <ul className="text-xs text-amber-800 list-disc pl-4 space-y-1">
                  {atsResult.formatting_warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              ) : (
                <p className="text-xs text-green-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> No formatting issues found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'job' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Required Skills', value: jobResult.breakdown.required_skills_score, weight: '35%', color: 'bg-indigo-500' },
              { label: 'Preferred Skills', value: jobResult.breakdown.preferred_skills_score, weight: '15%', color: 'bg-purple-500' },
              { label: 'Semantic Similarity', value: jobResult.breakdown.semantic_similarity_score, weight: '20%', color: 'bg-teal-500' },
              { label: 'Work Experience', value: jobResult.breakdown.experience_score, weight: '15%', color: 'bg-sky-500' },
              { label: 'Projects', value: jobResult.breakdown.project_score, weight: '10%', color: 'bg-violet-500' },
              { label: 'Education', value: jobResult.breakdown.education_score, weight: '5%', color: 'bg-pink-500' },
            ].map((item) => (
              <div key={item.label} className="border border-gray-200 rounded p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700">{item.label}</span>
                  <span className="text-xs text-gray-400">Weight: {item.weight}</span>
                </div>
                <p className="text-lg font-bold text-gray-900 mb-1">{item.value}%</p>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
            <p><strong>Experience:</strong> {jobResult.experience_alignment_summary}</p>
            <p><strong>Projects:</strong> {jobResult.project_alignment_summary}</p>
            <p><strong>Education:</strong> {jobResult.education_alignment_summary}</p>
            <p className="text-gray-400"><strong>Semantic engine:</strong> {jobResult.semantic_engine_used}</p>
          </div>
        </div>
      )}
    </div>
  );
};
