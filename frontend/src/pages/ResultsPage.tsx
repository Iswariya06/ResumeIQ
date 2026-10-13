import React, { useState } from 'react';
import { FullAnalysisResponse } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { SkillTagList } from '../components/SkillTagList';
import { RecommendationsCard } from '../components/RecommendationsCard';
import { Printer, RefreshCw, Layers, Sparkles, CheckCircle2, User, FileText, Briefcase, BookOpen, Award } from 'lucide-react';
import { apiService } from '../services/api';

interface ResultsPageProps {
  analysis: FullAnalysisResponse;
  onReset: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ analysis, onReset }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'skills' | 'breakdown' | 'parsed'>('ai');

  const handlePrintReport = () => {
    const reportUrl = apiService.getReportUrl(analysis.id);
    window.open(reportUrl, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner: Candidate & File Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              Analysis Complete
            </span>
            <span className="text-xs text-slate-400">• {analysis.timestamp}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {analysis.parsed_resume.candidate_name || 'Candidate Evaluation'}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {analysis.filename}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              Target: <strong className="text-slate-700">{analysis.job_title}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handlePrintReport}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Printable Report</span>
          </button>
          <button
            onClick={onReset}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Dual Scores Prominent Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreGauge
          score={analysis.ats_result.total_score}
          maxScore={100}
          title="ATS Readiness Score"
          subtitle="Structural formatting, standard headers, and parsability"
          statusLabel={analysis.ats_result.status_label}
          variant="ats"
        />
        <ScoreGauge
          score={analysis.job_match_result.total_score}
          maxScore={100}
          title="Job Matching Score"
          subtitle="Skill coverage, semantic similarity, and experience overlap"
          statusLabel={analysis.job_match_result.status_label}
          variant="match"
        />
      </div>

      {/* Results View Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'ai'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Explanations & Rewrites</span>
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'skills'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            Skills Matrix ({analysis.job_match_result.matched_skills.length} matched / {analysis.job_match_result.missing_skills.length} missing)
          </span>
        </button>
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'breakdown'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Score Factors & Weights</span>
        </button>
        <button
          onClick={() => setActiveTab('parsed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'parsed'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Extracted Resume Data</span>
        </button>
      </div>

      {/* Active Tab Views */}
      <div>
        {activeTab === 'ai' && (
          <RecommendationsCard aiExplanation={analysis.ai_explanation} />
        )}

        {activeTab === 'skills' && (
          <SkillTagList
            matchedSkills={analysis.job_match_result.matched_skills}
            partialSkills={analysis.job_match_result.partial_skills}
            missingSkills={analysis.job_match_result.missing_skills}
          />
        )}

        {activeTab === 'breakdown' && (
          <ScoreBreakdown
            atsResult={analysis.ats_result}
            jobResult={analysis.job_match_result}
          />
        )}

        {activeTab === 'parsed' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600" />
              <span>Extracted Section Entities</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Candidate Name
                </span>
                <span className="font-bold text-sm text-slate-800">
                  {analysis.parsed_resume.candidate_name || 'Not detected'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Email Address
                </span>
                <span className="font-bold text-sm text-slate-800 truncate block">
                  {analysis.parsed_resume.email || 'Not detected'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Phone Number
                </span>
                <span className="font-bold text-sm text-slate-800">
                  {analysis.parsed_resume.phone || 'Not detected'}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {/* Education */}
              <div className="p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-4 h-4 text-brand-600" />
                  <span>Education ({analysis.parsed_resume.education.length} entries)</span>
                </h4>
                {analysis.parsed_resume.education.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.parsed_resume.education.map((edu, i) => (
                      <li key={i}>{edu}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 italic">No explicit education section identified.</p>
                )}
              </div>

              {/* Work Experience */}
              <div className="p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <Briefcase className="w-4 h-4 text-brand-600" />
                  <span>Work Experience ({analysis.parsed_resume.work_experience.length} entries)</span>
                </h4>
                {analysis.parsed_resume.work_experience.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.parsed_resume.work_experience.slice(0, 10).map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                    {analysis.parsed_resume.work_experience.length > 10 && (
                      <li className="text-slate-400 italic">...and {analysis.parsed_resume.work_experience.length - 10} more lines.</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-slate-400 italic">No explicit work experience section identified.</p>
                )}
              </div>

              {/* Projects */}
              <div className="p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <Award className="w-4 h-4 text-brand-600" />
                  <span>Projects ({analysis.parsed_resume.projects.length} entries)</span>
                </h4>
                {analysis.parsed_resume.projects.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.parsed_resume.projects.slice(0, 8).map((proj, i) => (
                      <li key={i}>{proj}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 italic">No dedicated projects section identified.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
