import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, X, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { FullAnalysisResponse } from '../types';
import { apiService, ApiError } from '../services/api';

interface AnalysisPageProps {
  onAnalysisSuccess: (analysis: FullAnalysisResponse) => void;
}

const SAMPLE_JOB_DESCRIPTIONS = {
  fullstack: `Full Stack Engineer (React & Python)

Requirements:
- 3+ years of professional experience building web applications using React and Python (FastAPI or Django).
- Strong proficiency in JavaScript, TypeScript, HTML5, and CSS3.
- Hands-on experience designing RESTful APIs and microservices.
- Solid understanding of SQL and relational databases (PostgreSQL or MySQL).
- Experience with Docker, Git version control, and CI/CD pipelines.
- Bachelor's degree in Computer Science or equivalent practical experience.

Preferred Qualifications:
- Experience with Cloud platforms (AWS or GCP).
- Familiarity with Kubernetes, Redis, and automated unit testing (pytest, jest).
- Strong problem-solving, collaboration, and communication skills.`,

  data_science: `Data Scientist / Machine Learning Engineer

Requirements:
- Strong programming background in Python, with deep knowledge of NumPy, Pandas, and Scikit-Learn.
- Demonstrated experience in Machine Learning, Deep Learning (PyTorch or TensorFlow), and Natural Language Processing (NLP).
- Proven track record conducting data analysis, feature engineering, and statistical modeling.
- Experience querying databases using SQL.
- Version control using Git.

Preferred Qualifications:
- Familiarity with LLMs, Hugging Face transformers, and vector databases.
- Experience deploying machine learning models via FastAPI or Docker.
- Degree in Computer Science, Data Science, Mathematics, or related quantitative field.`
};

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ onAnalysisSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage(null);
    const validExts = ['.pdf', '.docx'];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!validExts.includes(ext)) {
      setErrorMessage(`Unsupported format '${ext}'. Please upload a PDF (.pdf) or Word document (.docx).`);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 5MB limit. Please upload a smaller document.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please upload a resume file in PDF or DOCX format.');
      return;
    }
    if (jobDescription.trim().length < 25) {
      setErrorMessage('Please provide a job description (at least 25 characters required).');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setLoadingStage(1);

    // Progressive stage feedback
    const stageTimer1 = setTimeout(() => setLoadingStage(2), 700);
    const stageTimer2 = setTimeout(() => setLoadingStage(3), 1600);

    try {
      const response = await apiService.analyzeResume(file, jobDescription);
      onAnalysisSuccess(response);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err?.message || 'An error occurred during resume analysis. Please verify your file and try again.');
      }
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setIsLoading(false);
      setLoadingStage(0);
    }
  };

  const charCount = jobDescription.length;
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze Resume vs Job Description
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Upload your resume file, paste the target job description, and generate dual ATS and Job Match scores.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block font-bold mb-0.5">Analysis Notice:</strong>
            {errorMessage}
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: File Upload */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-sm text-slate-900">Upload Resume (PDF or Word)</h3>
            </div>
            <span className="text-[11px] text-slate-400">Max size: 5 MB</span>
          </div>

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-brand-500 bg-brand-50/50'
                  : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Drag and drop your resume here, or <span className="text-brand-600 underline">browse files</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Supports PDF (.pdf) and Microsoft Word (.docx)</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">{file.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB • Ready for extraction
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Job Description Input */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm text-slate-900">Paste Target Job Description</h3>
            </div>
            
            {/* Quick Fill Sample Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Quick fill sample:</span>
              <button
                type="button"
                onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTIONS.fullstack)}
                className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-md transition"
              >
                Full Stack
              </button>
              <button
                type="button"
                onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTIONS.data_science)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition"
              >
                Data Science
              </button>
            </div>
          </div>

          <textarea
            rows={8}
            placeholder="Paste the complete job description here, including required technologies, qualifications, and responsibilities..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800 leading-relaxed custom-scrollbar"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Minimum 25 characters required for accurate matching.</span>
            <span>
              {wordCount} words • {charCount} chars
            </span>
          </div>
        </div>

        {/* Submit Button & Progress Indicator */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !file || jobDescription.trim().length < 25}
            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition ${
              isLoading || !file || jobDescription.trim().length < 25
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  {loadingStage === 1 && 'Extracting text and structure...'}
                  {loadingStage === 2 && 'Computing ATS factors & skill matches...'}
                  {loadingStage >= 3 && 'Synthesizing AI explanations & report...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run ResumeIQ Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
