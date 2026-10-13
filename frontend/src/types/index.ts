export interface ExtractedSections {
  candidate_name?: string;
  email?: string;
  phone?: string;
  education: string[];
  skills: string[];
  work_experience: string[];
  projects: string[];
  certifications: string[];
  achievements: string[];
  raw_word_count: number;
  section_headers_detected: string[];
}

export interface ATSFactorDetail {
  name: string;
  category: string;
  max_score: number;
  earned_score: number;
  status: 'pass' | 'warning' | 'fail';
  feedback: string;
  actionable_tip: string;
}

export interface ATSScoreResult {
  total_score: number;
  max_score: number;
  status_label: string;
  factors: ATSFactorDetail[];
  structural_observations: string[];
  formatting_warnings: string[];
  readability_metrics: {
    total_words: number;
    action_verbs_detected: number;
    action_verbs_sample: string[];
    bullet_points_count: number;
    sections_count: number;
  };
}

export interface SkillMatchItem {
  skill: string;
  category: string;
  status: 'matched' | 'partial' | 'missing';
  resume_evidence?: string;
  importance: 'required' | 'preferred';
}

export interface JobMatchBreakdown {
  required_skills_score: number;
  preferred_skills_score: number;
  semantic_similarity_score: number;
  experience_score: number;
  project_score: number;
  education_score: number;
  weights: Record<string, number>;
}

export interface BulletRewriteItem {
  original: string;
  suggested: string;
  reason: string;
}

export interface AIExplanationResult {
  ai_provider: 'ollama' | 'rule_based';
  model_name: string;
  is_fallback: boolean;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvement_recommendations: string[];
  suggested_bullet_rewrites: BulletRewriteItem[];
  disclaimer: string;
}

export interface JobMatchResult {
  total_score: number;
  max_score: number;
  status_label: string;
  breakdown: JobMatchBreakdown;
  matched_skills: SkillMatchItem[];
  partial_skills: SkillMatchItem[];
  missing_skills: SkillMatchItem[];
  semantic_similarity_percent: number;
  semantic_engine_used: string;
  experience_alignment_summary: string;
  project_alignment_summary: string;
  education_alignment_summary: string;
}

export interface FullAnalysisResponse {
  id: string;
  timestamp: string;
  filename: string;
  job_title: string;
  parsed_resume: ExtractedSections;
  ats_result: ATSScoreResult;
  job_match_result: JobMatchResult;
  ai_explanation: AIExplanationResult;
}

export interface AnalysisHistoryItem {
  id: string;
  created_at: string;
  resume_filename: string;
  candidate_name: string;
  job_title: string;
  ats_score: number;
  job_match_score: number;
  matched_skills_count: number;
  missing_skills_count: number;
  ai_used: boolean;
  ai_provider: string;
}

export interface AIStatusResponse {
  ollama_running: boolean;
  available_models: string[];
  current_model: string;
  model_ready: boolean;
  message: string;
}
