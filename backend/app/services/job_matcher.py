import re
from typing import List, Dict, Tuple
from app.core.config import settings
from app.schemas.analysis import (
    JobMatchResult, JobMatchBreakdown, SkillMatchItem, ExtractedSections
)
from app.services.skills_extractor import SkillsExtractor
from app.services.semantic_matcher import SemanticMatcher

ROLE_KEYWORDS = {
    "software engineer", "developer", "full stack", "backend", "frontend",
    "data engineer", "data scientist", "machine learning engineer", "devops engineer",
    "cloud engineer", "architect", "analyst", "qa engineer", "system engineer"
}

DEGREE_PATTERNS = [
    r"bachelor(?:'s)?", r"master(?:'s)?", r"b\.?s\.?", r"m\.?s\.?", r"b\.?tech",
    r"m\.?tech", r"ph\.?d", r"computer science", r"information technology",
    r"electrical engineering", r"engineering"
]

class JobMatcher:
    @classmethod
    def evaluate(
        cls,
        resume_text: str,
        sections: ExtractedSections,
        jd_text: str
    ) -> JobMatchResult:
        # 1. Skill Matching
        matched_skills, partial_skills, missing_skills = SkillsExtractor.match_skills(
            resume_text, jd_text
        )

        req_target = [s for s in matched_skills + partial_skills + missing_skills if s.importance == "required"]
        pref_target = [s for s in matched_skills + partial_skills + missing_skills if s.importance == "preferred"]

        # Required skills score
        if req_target:
            req_matched_count = sum(1 for s in matched_skills if s.importance == "required")
            req_partial_count = sum(1 for s in partial_skills if s.importance == "required")
            # Matched gets 1.0, Partial gets 0.5
            req_score = ((req_matched_count * 1.0 + req_partial_count * 0.5) / len(req_target)) * 100.0
        else:
            req_score = 80.0

        # Preferred skills score
        if pref_target:
            pref_matched_count = sum(1 for s in matched_skills if s.importance == "preferred")
            pref_partial_count = sum(1 for s in partial_skills if s.importance == "preferred")
            pref_score = ((pref_matched_count * 1.0 + pref_partial_count * 0.5) / len(pref_target)) * 100.0
        else:
            pref_score = 75.0

        # 2. Semantic Similarity
        semantic_sim, engine_used = SemanticMatcher.compute_similarity(resume_text, jd_text)

        # 3. Work Experience Alignment
        exp_score, exp_summary = cls._evaluate_experience(sections.work_experience, jd_text)

        # 4. Project Relevance
        proj_score, proj_summary = cls._evaluate_projects(sections.projects, jd_text)

        # 5. Education Alignment
        edu_score, edu_summary = cls._evaluate_education(sections.education, jd_text)

        # Weighted calculation
        weights = {
            "required_skills": settings.WEIGHT_REQUIRED_SKILLS,
            "preferred_skills": settings.WEIGHT_PREFERRED_SKILLS,
            "semantic_similarity": settings.WEIGHT_SEMANTIC_SIMILARITY,
            "experience": settings.WEIGHT_EXPERIENCE,
            "projects": settings.WEIGHT_PROJECTS,
            "education": settings.WEIGHT_EDUCATION
        }

        total_match = (
            req_score * weights["required_skills"] +
            pref_score * weights["preferred_skills"] +
            semantic_sim * weights["semantic_similarity"] +
            exp_score * weights["experience"] +
            proj_score * weights["projects"] +
            edu_score * weights["education"]
        )

        total_match = max(0.0, min(100.0, round(total_match, 1)))

        if total_match >= 78.0:
            status_label = "Strong Match"
        elif total_match >= 58.0:
            status_label = "Moderate Match"
        else:
            status_label = "Low Match"

        breakdown = JobMatchBreakdown(
            required_skills_score=round(req_score, 1),
            preferred_skills_score=round(pref_score, 1),
            semantic_similarity_score=round(semantic_sim, 1),
            experience_score=round(exp_score, 1),
            project_score=round(proj_score, 1),
            education_score=round(edu_score, 1),
            weights=weights
        )

        return JobMatchResult(
            total_score=total_match,
            max_score=100.0,
            status_label=status_label,
            breakdown=breakdown,
            matched_skills=matched_skills,
            partial_skills=partial_skills,
            missing_skills=missing_skills,
            semantic_similarity_percent=round(semantic_sim, 1),
            semantic_engine_used=engine_used,
            experience_alignment_summary=exp_summary,
            project_alignment_summary=proj_summary,
            education_alignment_summary=edu_summary
        )

    @staticmethod
    def _evaluate_experience(exp_lines: List[str], jd_text: str) -> Tuple[float, str]:
        if not exp_lines:
            return 35.0, "No distinct work experience section identified in resume."
        
        exp_text = " ".join(exp_lines).lower()
        jd_lower = jd_text.lower()
        
        # Check for role overlap
        matched_roles = [r for r in ROLE_KEYWORDS if r in exp_text and r in jd_lower]
        
        # Check years of experience mentioned in resume
        years_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs)', exp_text)
        max_years = max([int(y) for y in years_matches], default=0)

        score = 60.0
        if matched_roles:
            score += 25.0
            summary = f"Experience aligns with role keywords ({', '.join(matched_roles)})."
        else:
            score += 10.0
            summary = "Experience contains professional contributions but lacks exact matching title keywords."

        if max_years > 0:
            summary += f" Mentions ~{max_years} years of relevant domain activity."

        return min(100.0, score), summary

    @staticmethod
    def _evaluate_projects(proj_lines: List[str], jd_text: str) -> Tuple[float, str]:
        if not proj_lines:
            return 45.0, "Projects section not explicitly isolated or relies on work history."

        proj_text = " ".join(proj_lines).lower()
        jd_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', jd_text.lower()))
        proj_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', proj_text))
        
        common = proj_words.intersection(jd_words)
        if len(common) >= 8:
            return 90.0, f"Strong project relevance: Demonstrated hands-on project work aligning with {len(common)} job keywords."
        elif len(common) >= 3:
            return 70.0, f"Moderate project relevance: Projects exhibit hands-on familiarity with core technical terms."
        else:
            return 50.0, "Projects demonstrate general initiative, but lack direct keyword alignment with this role's technology stack."

    @staticmethod
    def _evaluate_education(edu_lines: List[str], jd_text: str) -> Tuple[float, str]:
        if not edu_lines:
            return 50.0, "No education records extracted."

        edu_text = " ".join(edu_lines).lower()
        jd_lower = jd_text.lower()

        found_degrees = [d for d in DEGREE_PATTERNS if re.search(d, edu_text)]
        jd_requests_degree = any(re.search(d, jd_lower) for d in DEGREE_PATTERNS)

        if found_degrees:
            if jd_requests_degree:
                return 95.0, "Candidate education directly satisfies degree requirements specified in the job posting."
            else:
                return 90.0, "Candidate holds verified degree qualifications relevant to technical roles."
        else:
            return 60.0, "Education background is present but specific degree title could not be confirmed."
