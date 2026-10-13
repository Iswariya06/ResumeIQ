from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ExtractedSections(BaseModel):
    candidate_name: Optional[str] = "Candidate"
    email: Optional[str] = None
    phone: Optional[str] = None
    education: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    work_experience: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    raw_word_count: int = 0
    section_headers_detected: List[str] = Field(default_factory=list)

class ATSFactorDetail(BaseModel):
    name: str
    category: str
    max_score: float
    earned_score: float
    status: str  # "pass", "warning", "fail"
    feedback: str
    actionable_tip: str

class ATSScoreResult(BaseModel):
    total_score: float
    max_score: float = 100.0
    status_label: str  # "Excellent", "Good", "Needs Improvement", "Critical Issues"
    factors: List[ATSFactorDetail]
    structural_observations: List[str]
    formatting_warnings: List[str]
    readability_metrics: Dict[str, Any]

class SkillMatchItem(BaseModel):
    skill: str
    category: str = "Technical"
    status: str  # "matched", "partial", "missing"
    resume_evidence: Optional[str] = None
    importance: str = "required"  # "required" or "preferred"

class JobMatchBreakdown(BaseModel):
    required_skills_score: float
    preferred_skills_score: float
    semantic_similarity_score: float
    experience_score: float
    project_score: float
    education_score: float
    weights: Dict[str, float]

class BulletRewriteItem(BaseModel):
    original: str
    suggested: str
    reason: str

class AIExplanationResult(BaseModel):
    ai_provider: str  # "ollama" or "rule_based"
    model_name: str
    is_fallback: bool
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    improvement_recommendations: List[str]
    suggested_bullet_rewrites: List[BulletRewriteItem]
    disclaimer: str

class JobMatchResult(BaseModel):
    total_score: float
    max_score: float = 100.0
    status_label: str  # "Strong Match", "Moderate Match", "Low Match"
    breakdown: JobMatchBreakdown
    matched_skills: List[SkillMatchItem]
    partial_skills: List[SkillMatchItem]
    missing_skills: List[SkillMatchItem]
    semantic_similarity_percent: float
    semantic_engine_used: str
    experience_alignment_summary: str
    project_alignment_summary: str
    education_alignment_summary: str

class FullAnalysisResponse(BaseModel):
    id: str
    timestamp: str
    filename: str
    job_title: str
    parsed_resume: ExtractedSections
    ats_result: ATSScoreResult
    job_match_result: JobMatchResult
    ai_explanation: AIExplanationResult

class AnalysisHistoryItem(BaseModel):
    id: str
    created_at: str
    resume_filename: str
    candidate_name: str
    job_title: str
    ats_score: float
    job_match_score: float
    matched_skills_count: int
    missing_skills_count: int
    ai_used: bool
    ai_provider: str

class AIStatusResponse(BaseModel):
    ollama_running: bool
    available_models: List[str]
    current_model: str
    model_ready: bool
    message: str
