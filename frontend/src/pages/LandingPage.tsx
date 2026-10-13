import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Resume ATS Analyzer
        </h1>
        <p className="text-gray-600 text-base mb-6">
          Upload your resume and paste a job description to get an ATS readiness score and job match score.
        </p>
        <button
          onClick={onStartAnalysis}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded font-semibold hover:bg-indigo-700"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* How it works */}
      <div id="how-it-works" className="bg-white border border-gray-200 rounded p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center mx-auto mb-2">
              1
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Upload Resume</p>
            <p className="text-xs text-gray-500">PDF or DOCX format, up to 5MB</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center mx-auto mb-2">
              2
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Paste Job Description</p>
            <p className="text-xs text-gray-500">Copy the full job posting text</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center mx-auto mb-2">
              3
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Get Results</p>
            <p className="text-xs text-gray-500">ATS score, job match, skill gaps, and suggestions</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">ATS Readiness Score</h3>
          <p className="text-xs text-gray-500">Checks section headers, contact info, action verbs, word count, and keyword coverage.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">Job Match Score</h3>
          <p className="text-xs text-gray-500">Compares your skills against what the job requires using semantic similarity and skill matching.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">Skill Gap Analysis</h3>
          <p className="text-xs text-gray-500">Shows matched, partial, and missing skills from the job description with resume evidence.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">AI Suggestions</h3>
          <p className="text-xs text-gray-500">Powered by local Ollama if available, otherwise uses a rule-based engine. No data sent to cloud.</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Note: Scores are estimates for self-improvement purposes and don't reflect actual employer decisions.
      </p>
    </div>
  );
};
