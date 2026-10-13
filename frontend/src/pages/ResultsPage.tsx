import React, { useState } from 'react';
import { FullAnalysisResponse } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { SkillTagList } from '../components/SkillTagList';
import { RecommendationsCard } from '../components/RecommendationsCard';
import { Printer, RefreshCw } from 'lucide-react';
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

  const tabs = [
    { key: 'ai', label: 'AI Feedback' },
    { key: 'skills', label: `Skills (${analysis.job_match_result.matched_skills.length} matched / ${analysis.job_match_result.missing_skills.length} missing)` },
    { key: 'breakdown', label: 'Score Breakdown' },
    { key: 'parsed', label: 'Parsed Resume' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">{analysis.timestamp}</p>
          <h2 className="text-xl font-bold text-gray-900">
            {analysis.parsed_resume.candidate_name || 'Candidate'}
          </h2>
          <p className="text-sm text-gray-500">
            {analysis.filename} &nbsp;·&nbsp; Target: <strong className="text-gray-700">{analysis.job_title}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800"
          >
            <Printer className="w-4 h-4" />
            Report
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreGauge
          score={analysis.ats_result.total_score}
          maxScore={100}
          title="ATS Readiness Score"
          subtitle="Structure, headers, contact info, keywords"
          statusLabel={analysis.ats_result.status_label}
          variant="ats"
        />
        <ScoreGauge
          score={analysis.job_match_result.total_score}
          maxScore={100}
          title="Job Match Score"
          subtitle="Skills, experience, semantic similarity"
          statusLabel={analysis.job_match_result.status_label}
          variant="match"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-1 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
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
          <div className="bg-white border border-gray-200 rounded p-5 space-y-5">
            <h3 className="font-semibold text-gray-800">Extracted Resume Data</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 border border-gray-200 rounded bg-gray-50">
                <p className="text-xs text-gray-400 mb-1">Name</p>
                <p className="text-sm font-medium text-gray-800">{analysis.parsed_resume.candidate_name || 'Not detected'}</p>
              </div>
              <div className="p-3 border border-gray-200 rounded bg-gray-50">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-800 truncate">{analysis.parsed_resume.email || 'Not detected'}</p>
              </div>
              <div className="p-3 border border-gray-200 rounded bg-gray-50">
                <p className="text-xs text-gray-400 mb-1">Phone</p>
                <p className="text-sm font-medium text-gray-800">{analysis.parsed_resume.phone || 'Not detected'}</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Education ({analysis.parsed_resume.education.length})</h4>
              {analysis.parsed_resume.education.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {analysis.parsed_resume.education.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              ) : <p className="text-sm text-gray-400">None detected.</p>}
            </div>

            <div className="border border-gray-200 rounded p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Work Experience ({analysis.parsed_resume.work_experience.length})</h4>
              {analysis.parsed_resume.work_experience.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {analysis.parsed_resume.work_experience.slice(0, 10).map((e, i) => <li key={i}>{e}</li>)}
                  {analysis.parsed_resume.work_experience.length > 10 && (
                    <li className="text-gray-400">...and {analysis.parsed_resume.work_experience.length - 10} more</li>
                  )}
                </ul>
              ) : <p className="text-sm text-gray-400">None detected.</p>}
            </div>

            <div className="border border-gray-200 rounded p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Projects ({analysis.parsed_resume.projects.length})</h4>
              {analysis.parsed_resume.projects.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {analysis.parsed_resume.projects.slice(0, 8).map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              ) : <p className="text-sm text-gray-400">None detected.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
