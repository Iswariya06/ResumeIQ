import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, X, Loader2 } from 'lucide-react';
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
      setErrorMessage(`Unsupported format '${ext}'. Please upload a PDF or DOCX file.`);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB. Please upload a smaller file.');
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
      setErrorMessage('Please upload a resume file.');
      return;
    }
    if (jobDescription.trim().length < 25) {
      setErrorMessage('Please enter a job description (at least 25 characters).');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setLoadingStage(1);

    const stageTimer1 = setTimeout(() => setLoadingStage(2), 700);
    const stageTimer2 = setTimeout(() => setLoadingStage(3), 1600);

    try {
      const response = await apiService.analyzeResume(file, jobDescription);
      onAnalysisSuccess(response);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setIsLoading(false);
      setLoadingStage(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Analyze Resume</h1>
      <p className="text-sm text-gray-500 mb-6">Upload your resume and paste the job description below.</p>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded flex items-start gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="flex-1">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File Upload */}
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-sm text-gray-800">1. Upload Resume (PDF or DOCX)</label>
            <span className="text-xs text-gray-400">Max 5MB</span>
          </div>

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded p-8 text-center cursor-pointer ${
                isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Drag and drop here or <span className="text-indigo-600 underline">browse</span></p>
              <p className="text-xs text-gray-400 mt-1">PDF or DOCX only</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold text-sm text-gray-800">2. Paste Job Description</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTIONS.fullstack)}
                className="text-xs text-indigo-600 hover:underline"
              >
                Sample: Full Stack
              </button>
              <button
                type="button"
                onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTIONS.data_science)}
                className="text-xs text-indigo-600 hover:underline"
              >
                Sample: Data Science
              </button>
            </div>
          </div>

          <textarea
            rows={8}
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full text-sm p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{jobDescription.trim().split(/\s+/).filter(Boolean).length} words</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !file || jobDescription.trim().length < 25}
          className={`w-full py-3 rounded font-semibold text-sm flex items-center justify-center gap-2 ${
            isLoading || !file || jobDescription.trim().length < 25
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {loadingStage === 1 && 'Extracting text...'}
              {loadingStage === 2 && 'Computing scores...'}
              {loadingStage >= 3 && 'Generating feedback...'}
            </>
          ) : (
            'Run Analysis'
          )}
        </button>
      </form>
    </div>
  );
};
