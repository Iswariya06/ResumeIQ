import { FullAnalysisResponse, AnalysisHistoryItem, AIStatusResponse } from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const apiService = {
  async checkHealth(): Promise<{ status: string; app_name: string; version: string }> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new ApiError('Failed to connect to backend', res.status);
    return res.json();
  },

  async checkAiStatus(): Promise<AIStatusResponse> {
    const res = await fetch(`${API_BASE}/ai/status`);
    if (!res.ok) throw new ApiError('Failed to fetch AI status', res.status);
    return res.json();
  },

  async analyzeResume(file: File, jobDescription: string): Promise<FullAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      let errorMsg = 'Failed to analyze resume';
      try {
        const errJson = await res.json();
        if (errJson.detail) errorMsg = errJson.detail;
      } catch {
        // Fallback to text error or status code
      }
      throw new ApiError(errorMsg, res.status);
    }

    return res.json();
  },

  async getHistory(): Promise<AnalysisHistoryItem[]> {
    const res = await fetch(`${API_BASE}/analyses`);
    if (!res.ok) throw new ApiError('Failed to fetch analysis history', res.status);
    return res.json();
  },

  async getAnalysis(id: string): Promise<FullAnalysisResponse> {
    const res = await fetch(`${API_BASE}/analyses/${id}`);
    if (!res.ok) throw new ApiError(`Analysis ${id} not found`, res.status);
    return res.json();
  },

  async deleteAnalysis(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/analyses/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new ApiError('Failed to delete analysis', res.status);
  },

  getReportUrl(id: string): string {
    return `${API_BASE}/analyses/${id}/report`;
  }
};
