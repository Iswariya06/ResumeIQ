import re
from typing import List, Dict, Any, Set
from app.schemas.analysis import ATSScoreResult, ATSFactorDetail, ExtractedSections

STRONG_ACTION_VERBS = {
    "architected", "built", "created", "developed", "engineered", "implemented",
    "designed", "optimized", "spearheaded", "orchestrated", "automated", "deployed",
    "refactored", "resolved", "managed", "led", "mentored", "delivered", "established",
    "formulated", "executed", "collaborated", "streamlined", "enhanced", "integrated",
    "reduced", "increased", "maximized", "accelerated", "initiated"
}

class ATSScorer:
    @classmethod
    def evaluate(
        cls,
        resume_text: str,
        sections: ExtractedSections,
        jd_text: str
    ) -> ATSScoreResult:
        factors: List[ATSFactorDetail] = []
        structural_observations: List[str] = []
        formatting_warnings: List[str] = []

        # --- Factor 1: Document Parsability & Word Count (Max: 15) ---
        word_count = sections.raw_word_count
        factor1_score = 0.0
        factor1_status = "pass"
        factor1_feedback = ""
        factor1_tip = ""

        if 350 <= word_count <= 1100:
            factor1_score = 15.0
            factor1_feedback = f"Optimal length ({word_count} words). Fits standard 1-2 page formatting."
            factor1_tip = "Maintain this concise length while tailoring details to each application."
            structural_observations.append("Resume word count is in the optimal 350-1100 word range for single or two-page resumes.")
        elif 200 <= word_count < 350:
            factor1_score = 9.0
            factor1_status = "warning"
            factor1_feedback = f"Slightly short ({word_count} words). May lack sufficient technical depth."
            factor1_tip = "Expand your project descriptions and work bullet points to demonstrate your skills."
            formatting_warnings.append("Resume text is somewhat brief (< 350 words). Consider adding project and technical details.")
        elif word_count > 1100:
            factor1_score = 10.0
            factor1_status = "warning"
            factor1_feedback = f"Long document ({word_count} words). ATS and recruiters favor concise 1-2 page documents."
            factor1_tip = "Condense older experiences and trim repetitive phrases to keep it to 1-2 pages."
            formatting_warnings.append("Document length exceeds 1100 words. Consider condensing to avoid recruiter fatigue.")
        else:
            factor1_score = 5.0
            factor1_status = "fail"
            factor1_feedback = f"Critical: Extremely short text ({word_count} words)."
            factor1_tip = "Ensure the resume includes full work history, technical stack, and education."
            formatting_warnings.append("Resume has fewer than 200 words, which will likely score poorly in initial ATS parsing.")

        factors.append(ATSFactorDetail(
            name="Document Parsability & Length",
            category="Structure",
            max_score=15.0,
            earned_score=factor1_score,
            status=factor1_status,
            feedback=factor1_feedback,
            actionable_tip=factor1_tip
        ))

        # --- Factor 2: Standard Section Headers (Max: 25) ---
        factor2_score = 0.0
        missing_sections = []
        present_sections = []

        # Work Experience (8 pts)
        if sections.work_experience:
            factor2_score += 8.0
            present_sections.append("Work Experience")
        else:
            missing_sections.append("Work Experience")
            formatting_warnings.append("Standard 'Work Experience' or 'Employment' section header was not distinctly detected.")

        # Skills (7 pts)
        if sections.skills:
            factor2_score += 7.0
            present_sections.append("Skills")
        else:
            missing_sections.append("Skills")
            formatting_warnings.append("Dedicated 'Skills' or 'Technical Skills' section was not cleanly detected.")

        # Education (5 pts)
        if sections.education:
            factor2_score += 5.0
            present_sections.append("Education")
        else:
            missing_sections.append("Education")
            formatting_warnings.append("Education section is missing or using an unconventional header.")

        # Projects or Certifications (5 pts)
        if sections.projects or sections.certifications:
            factor2_score += 5.0
            present_sections.append("Projects/Certifications")
        else:
            formatting_warnings.append("No distinct Projects or Certifications section detected.")

        if factor2_score >= 23.0:
            f2_status = "pass"
            f2_feedback = f"All key ATS sections detected ({', '.join(present_sections)})."
            f2_tip = "Keep section headings standard (e.g. 'Work Experience', 'Education', 'Technical Skills')."
        elif factor2_score >= 15.0:
            f2_status = "warning"
            f2_feedback = f"Missing standard sections: {', '.join(missing_sections)}."
            f2_tip = f"Explicitly add conventional headers for {', '.join(missing_sections)}."
        else:
            f2_status = "fail"
            f2_feedback = "Multiple essential resume sections could not be identified."
            f2_tip = "Reorganize the resume with clear headers: Work Experience, Education, and Skills."

        structural_observations.append(f"Identified {len(present_sections)} standard resume sections: {', '.join(present_sections)}.")

        factors.append(ATSFactorDetail(
            name="Section Structure & Standard Headers",
            category="Structure",
            max_score=25.0,
            earned_score=factor2_score,
            status=f2_status,
            feedback=f2_feedback,
            actionable_tip=f2_tip
        ))

        # --- Factor 3: Contact Information Completeness (Max: 15) ---
        factor3_score = 0.0
        contact_items = []
        missing_contact = []

        if sections.email:
            factor3_score += 6.0
            contact_items.append("Email")
        else:
            missing_contact.append("Professional Email")

        if sections.phone:
            factor3_score += 5.0
            contact_items.append("Phone Number")
        else:
            missing_contact.append("Phone Number")

        if sections.candidate_name and sections.candidate_name != "Candidate":
            factor3_score += 4.0
            contact_items.append(f"Name ({sections.candidate_name})")
        else:
            missing_contact.append("Clear Candidate Name")

        if factor3_score >= 14.0:
            f3_status = "pass"
            f3_feedback = "Complete contact information (Name, Email, Phone) clearly detected at header."
            f3_tip = "Ensure links to LinkedIn or GitHub are also included in the header."
        elif factor3_score >= 6.0:
            f3_status = "warning"
            f3_feedback = f"Missing contact fields: {', '.join(missing_contact)}."
            f3_tip = "Place your full name, email address, and phone number prominently at the top."
            formatting_warnings.append(f"Contact details incomplete: missing {', '.join(missing_contact)}.")
        else:
            f3_status = "fail"
            f3_feedback = "Crucial contact details could not be parsed."
            f3_tip = "Add your Name, Email, and Phone number in plain text (avoid embedding in image headers)."
            formatting_warnings.append(f"Crucial contact details could not be parsed: missing {', '.join(missing_contact)}.")

        factors.append(ATSFactorDetail(
            name="Contact Information Completeness",
            category="Contact",
            max_score=15.0,
            earned_score=factor3_score,
            status=f3_status,
            feedback=f3_feedback,
            actionable_tip=f3_tip
        ))

        # --- Factor 4: Text Structure, Action Verbs & Readability (Max: 20) ---
        words_lower = set(re.findall(r'\b[a-zA-Z]+\b', resume_text.lower()))
        action_verbs_found = words_lower.intersection(STRONG_ACTION_VERBS)
        
        # Count bullet lines
        lines = resume_text.splitlines()
        bullet_lines = [l for l in lines if re.match(r'^[•\-\*\d\.]+\s+', l.strip()) or (len(l.strip()) > 30 and l.strip().endswith('.'))]
        
        f4_score = 0.0
        # Action verbs (up to 10 pts)
        verb_count = len(action_verbs_found)
        if verb_count >= 6:
            f4_score += 10.0
        elif verb_count >= 3:
            f4_score += 6.5
        elif verb_count >= 1:
            f4_score += 3.5

        # Bullet point formatting (up to 6 pts)
        if len(bullet_lines) >= 5:
            f4_score += 6.0
        elif len(bullet_lines) >= 2:
            f4_score += 3.5
        else:
            f4_score += 1.0

        # Absence of formatting red flags (up to 4 pts)
        # Check for unreadable character clusters
        unusual_chars = len(re.findall(r'[^\x00-\x7F\u2022\u2013\u2014]', resume_text))
        if unusual_chars < 15:
            f4_score += 4.0
        else:
            formatting_warnings.append(f"Found unusual non-standard characters ({unusual_chars} instances) that may confuse ATS parsers.")

        if f4_score >= 16.0:
            f4_status = "pass"
            f4_feedback = f"Strong readability. Uses {verb_count} distinct action verbs and structured bullet points."
            f4_tip = "Keep starting every bullet point with an impactful action verb and quantifiable outcome."
        elif f4_score >= 10.0:
            f4_status = "warning"
            f4_feedback = f"Moderate readability. Uses {verb_count} action verbs. Can incorporate more dynamic action phrasing."
            f4_tip = "Begin experience bullet points with verbs like 'Spearheaded', 'Optimized', or 'Architected'."
        else:
            f4_status = "fail"
            f4_feedback = "Weak structural readability or insufficient action verbs."
            f4_tip = "Break dense paragraphs into structured bullet points starting with action verbs."

        factors.append(ATSFactorDetail(
            name="Readability & Action Verbs",
            category="Content",
            max_score=20.0,
            earned_score=round(f4_score, 1),
            status=f4_status,
            feedback=f4_feedback,
            actionable_tip=f4_tip
        ))

        # --- Factor 5: Job Description Keyword Coverage (Max: 25) ---
        # Extract meaningful keywords from JD (excluding common stopwords)
        jd_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', jd_text.lower()))
        common_stopwords = {
            "the", "and", "for", "with", "that", "this", "from", "have", "will", "your",
            "are", "you", "our", "all", "can", "work", "team", "role", "looking", "candidate",
            "experience", "years", "skills", "ability", "strong", "must", "working"
        }
        jd_meaningful = jd_words - common_stopwords
        
        f5_score = 0.0
        if jd_meaningful:
            overlap = words_lower.intersection(jd_meaningful)
            coverage_pct = len(overlap) / len(jd_meaningful)
            f5_score = min(25.0, round(coverage_pct * 40.0, 1)) # 60% coverage = full 25 pts
        else:
            f5_score = 18.0

        if f5_score >= 18.0:
            f5_status = "pass"
            f5_feedback = f"Strong contextual keyword density matching target job requirements."
            f5_tip = "Maintain natural keyword integration without keyword stuffing."
        elif f5_score >= 12.0:
            f5_status = "warning"
            f5_feedback = "Moderate keyword alignment with job posting. Some key terminology is missing."
            f5_tip = "Mirror key terminology directly from the job description in your skills and project sections."
        else:
            f5_status = "fail"
            f5_feedback = "Low keyword coverage relative to the target job description."
            f5_tip = "Carefully review the job description and incorporate missing industry keywords."

        factors.append(ATSFactorDetail(
            name="Job Keyword Alignment",
            category="Keywords",
            max_score=25.0,
            earned_score=f5_score,
            status=f5_status,
            feedback=f5_feedback,
            actionable_tip=f5_tip
        ))

        # Total Score
        total_ats = round(sum(f.earned_score for f in factors), 1)
        total_ats = max(0.0, min(100.0, total_ats))

        if total_ats >= 80.0:
            status_label = "Excellent"
        elif total_ats >= 65.0:
            status_label = "Good"
        elif total_ats >= 50.0:
            status_label = "Needs Improvement"
        else:
            status_label = "Critical Issues"

        readability_metrics = {
            "total_words": word_count,
            "action_verbs_detected": len(action_verbs_found),
            "action_verbs_sample": list(action_verbs_found)[:5],
            "bullet_points_count": len(bullet_lines),
            "sections_count": len(present_sections)
        }

        return ATSScoreResult(
            total_score=total_ats,
            max_score=100.0,
            status_label=status_label,
            factors=factors,
            structural_observations=structural_observations,
            formatting_warnings=formatting_warnings,
            readability_metrics=readability_metrics
        )
