import React, { useState } from 'react';
import { ATSScoreResult, JobMatchResult } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Layers, Target, BookOpen, Briefcase, FolderGit2 } from 'lucide-react';

interface ScoreBreakdownProps {
  atsResult: ATSScoreResult;
  jobResult: JobMatchResult;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ atsResult, jobResult }) => {
  const [activeTab, setActiveTab] = useState<'ats' | 'job'>('ats');
  const [expandedFactor, setExpandedFactor] = useState<number | null>(null);

  const toggleFactor = (index: number) => {
    setExpandedFactor(expandedFactor === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('ats')}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm border-b-2 transition ${
            activeTab === 'ats'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>ATS Readiness Factors ({atsResult.factors.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('job')}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm border-b-2 transition ${
            activeTab === 'job'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Job Match Weights & Criteria</span>
        </button>
      </div>

      {/* Tab 1: ATS Factors */}
      {activeTab === 'ats' && (
        <div className="space-y-3">
          {atsResult.factors.map((factor, idx) => {
            const isExpanded = expandedFactor === idx;
            const pct = Math.round((factor.earned_score / factor.max_score) * 100);

            return (
              <div
                key={factor.name}
                className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition"
              >
                <div
                  onClick={() => toggleFactor(idx)}
                  className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {factor.status === 'pass' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {factor.status === 'warning' && (
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                    {factor.status === 'fail' && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{factor.name}</div>
                      <div className="text-xs text-slate-500">{factor.category} evaluation</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800">
                        {factor.earned_score}
                      </span>
                      <span className="text-xs text-slate-400"> / {factor.max_score} pts</span>
                      <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            factor.status === 'pass'
                              ? 'bg-emerald-500'
                              : factor.status === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-white border-t border-slate-100 text-xs space-y-2">
                    <div className="text-slate-700">
                      <strong>Analysis:</strong> {factor.feedback}
                    </div>
                    <div className="bg-brand-50/60 border border-brand-100 p-2.5 rounded-lg text-brand-900">
                      <strong>Actionable Tip:</strong> {factor.actionable_tip}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Observations and Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Structural Observations
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                {atsResult.structural_observations.map((obs, i) => (
                  <li key={i}>{obs}</li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                Formatting Warnings ({atsResult.formatting_warnings.length})
              </h4>
              {atsResult.formatting_warnings.length > 0 ? (
                <ul className="text-xs text-amber-900 space-y-1.5 list-disc pl-4">
                  {atsResult.formatting_warnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> No formatting red flags detected!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Job Match Criteria */}
      {activeTab === 'job' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required Skills */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">Required Skills Coverage</span>
                <span className="text-xs font-semibold text-slate-500">Weight: 35%</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {jobResult.breakdown.required_skills_score}%
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all"
                  style={{ width: `${jobResult.breakdown.required_skills_score}%` }}
                />
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">Preferred Skills Coverage</span>
                <span className="text-xs font-semibold text-slate-500">Weight: 15%</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {jobResult.breakdown.preferred_skills_score}%
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${jobResult.breakdown.preferred_skills_score}%` }}
                />
              </div>
            </div>

            {/* Semantic Similarity */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">Semantic & Domain Similarity</span>
                <span className="text-xs font-semibold text-slate-500">Weight: 20%</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {jobResult.breakdown.semantic_similarity_score}%
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all"
                  style={{ width: `${jobResult.breakdown.semantic_similarity_score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 truncate" title={jobResult.semantic_engine_used}>
                Engine: {jobResult.semantic_engine_used}
              </p>
            </div>

            {/* Work Experience */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">Experience Alignment</span>
                <span className="text-xs font-semibold text-slate-500">Weight: 15%</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {jobResult.breakdown.experience_score}%
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all"
                  style={{ width: `${jobResult.breakdown.experience_score}%` }}
                />
              </div>
            </div>

            {/* Projects */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">Project Relevance</span>
                <span className="text-xs font-semibold text-slate-500">Weight: 10%</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {jobResult.breakdown.project_score}%
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-violet-500 h-full rounded-full transition-all"
                  style={{ width: `${jobResult.breakdown.project_score}%` }}
                />
              </div>
            </div>

            {/* Education */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">Education / Degree Alignment</span>
                <span className="text-xs font-semibold text-slate-500">Weight: 5%</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {jobResult.breakdown.education_score}%
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${jobResult.breakdown.education_score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Context Explanations */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-start gap-2 text-slate-600">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span><strong>Work Experience:</strong> {jobResult.experience_alignment_summary}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <FolderGit2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span><strong>Projects:</strong> {jobResult.project_alignment_summary}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span><strong>Education:</strong> {jobResult.education_alignment_summary}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
