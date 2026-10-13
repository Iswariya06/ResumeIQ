import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Layers, Target, Cpu, AlertCircle } from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis }) => {
  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="text-center pt-12 md:pt-20 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Local AI Powered • Zero Paid Cloud APIs</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Optimize Your Resume for <br className="hidden sm:inline" />
          <span className="text-brand-600">Applicant Tracking Systems</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload your resume in PDF or Word format, paste any target job description, and receive dual explainable scores:
          <strong className="text-slate-800"> ATS Readiness</strong> and <strong className="text-slate-800">Job Matching</strong>, backed by local AI and semantic NLP.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartAnalysis}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm hover:shadow transition transform hover:-translate-y-0.5"
          >
            <span>Analyze My Resume Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm transition"
          >
            How It Works
          </a>
        </div>

        {/* Confidence highlights */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>PDF & DOCX Support</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Deterministic Scoring Formula</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Private & Local Execution</span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why ResumeIQ?</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Engineered with transparent algorithms, clear criteria breakdowns, and local AI reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-brand-200 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Dual Independent Scores</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike generic checkers that blend everything into a mystery number, ResumeIQ isolates <strong>ATS Format Readiness</strong> from <strong>Target Role Compatibility</strong>.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-brand-200 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Transparent Skill Taxonomy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Identifies directly matched skills, recognizes partial proficiencies within skill families, and surfaces missing required qualifications with extracted resume proof.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-brand-200 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Local AI Explanations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered locally by Ollama without sending your personal data to cloud servers. Seamlessly falls back to our robust rule-based engine if Ollama is unavailable.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900">How the Workflow Operates</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Three seamless steps from document upload to actionable candidate optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-200 text-brand-600 font-extrabold text-lg flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">Document Extraction</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                PyMuPDF and python-docx extract plain text, segmenting headers, contact details, experiences, and technologies.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-200 text-brand-600 font-extrabold text-lg flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">Deterministic Scoring</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Formulas evaluate standard headers, readability, action verbs, required skills, and Sentence Transformer semantic similarity.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-200 text-brand-600 font-extrabold text-lg flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">AI Explanations & Report</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive strengths, missing skill gaps, STAR bullet point enhancements, and a one-click printable report.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onStartAnalysis}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Start Free Analysis
            </button>
          </div>
        </div>
      </section>

      {/* Realistic Academic Disclaimer */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="block font-bold text-amber-950 mb-1">
              Academic Disclaimer & Benchmark Transparency:
            </strong>
            The scores computed by ResumeIQ are automated estimates designed for resume optimization and educational self-assessment. Proprietary commercial ATS platforms vary widely across organizations. Scoring does not guarantee employment outcomes or human recruiter interview invitations.
          </div>
        </div>
      </section>
    </div>
  );
};
