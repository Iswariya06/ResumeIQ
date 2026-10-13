import datetime
import json
import logging
import uuid
from typing import List
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.database.models import AnalysisRecord
from app.schemas.analysis import (
    FullAnalysisResponse, AnalysisHistoryItem, AIStatusResponse
)
from app.services.parser import ResumeParser, ResumeParsingError
from app.services.ats_scorer import ATSScorer
from app.services.job_matcher import JobMatcher
from app.services.ollama_service import OllamaService
from app.services.report_generator import ReportGenerator

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")

@router.get("/health", tags=["System"])
def health_check():
    """Health verification endpoint."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

@router.get("/ai/status", response_model=AIStatusResponse, tags=["AI"])
async def ai_status():
    """Check availability of local Ollama AI model."""
    status_dict = await OllamaService.check_status()
    return AIStatusResponse(**status_dict)

@router.post("/analyze", response_model=FullAnalysisResponse, tags=["Analysis"])
async def analyze_resume(
    file: UploadFile = File(..., description="Resume document in PDF or DOCX format"),
    job_description: str = Form(..., description="Target Job Description text"),
    db: Session = Depends(get_db)
):
    """
    Main analysis endpoint. Accepts resume file and job description text,
    validates inputs, extracts text, computes ATS and job matching scores,
    and generates AI-powered or rule-based explanations.
    """
    # 1. Validate Job Description
    clean_jd = job_description.strip()
    if len(clean_jd) < 25:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description is too short (minimum 25 characters required). Please paste a complete job description."
        )

    # 2. Validate and read file
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must have a valid filename."
        )

    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}"
        )

    # 3. Parse resume
    try:
        raw_resume_text, sections = ResumeParser.parse_document(file.filename, file_bytes)
    except ResumeParsingError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected parsing error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while parsing the resume. Ensure it is a valid PDF or Word document."
        )

    # 4. Infer target job title from JD first line
    jd_lines = [l.strip() for l in clean_jd.splitlines() if l.strip()]
    job_title = jd_lines[0][:60] if jd_lines else "Target Job Role"

    # 5. Compute ATS Readiness Score
    ats_result = ATSScorer.evaluate(raw_resume_text, sections, clean_jd)

    # 6. Compute Job Matching Score
    job_result = JobMatcher.evaluate(raw_resume_text, sections, clean_jd)

    # 7. Generate Explanations (Ollama LLM with fallback)
    ai_explanation = await OllamaService.generate_explanation(
        raw_resume_text, sections, clean_jd, ats_result, job_result
    )

    analysis_id = str(uuid.uuid4())
    now_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    response_obj = FullAnalysisResponse(
        id=analysis_id,
        timestamp=now_iso,
        filename=file.filename,
        job_title=job_title,
        parsed_resume=sections,
        ats_result=ats_result,
        job_match_result=job_result,
        ai_explanation=ai_explanation
    )

    # 8. Persist to local database
    try:
        db_record = AnalysisRecord(
            id=analysis_id,
            resume_filename=file.filename,
            candidate_name=sections.candidate_name or "Candidate",
            job_title=job_title,
            ats_score=ats_result.total_score,
            job_match_score=job_result.total_score,
            matched_skills_count=len(job_result.matched_skills),
            missing_skills_count=len(job_result.missing_skills),
            ai_used=not ai_explanation.is_fallback,
            ai_provider=ai_explanation.ai_provider,
            results_json=response_obj.model_dump_json()
        )
        db.add(db_record)
        db.commit()
    except Exception as e:
        logger.warning(f"Failed to persist analysis to database: {e}")
        db.rollback()

    return response_obj

@router.get("/analyses", response_model=List[AnalysisHistoryItem], tags=["History"])
def get_analyses_history(db: Session = Depends(get_db)):
    """Retrieve recent analysis history (up to 30 records)."""
    records = db.query(AnalysisRecord).order_by(AnalysisRecord.created_at.desc()).limit(30).all()
    results = []
    for r in records:
        results.append(AnalysisHistoryItem(
            id=r.id,
            created_at=r.created_at.strftime("%Y-%m-%d %H:%M"),
            resume_filename=r.resume_filename,
            candidate_name=r.candidate_name or "Candidate",
            job_title=r.job_title or "Target Job",
            ats_score=r.ats_score,
            job_match_score=r.job_match_score,
            matched_skills_count=r.matched_skills_count,
            missing_skills_count=r.missing_skills_count,
            ai_used=r.ai_used,
            ai_provider=r.ai_provider
        ))
    return results

@router.get("/analyses/{analysis_id}", response_model=FullAnalysisResponse, tags=["History"])
def get_analysis_by_id(analysis_id: str, db: Session = Depends(get_db)):
    """Retrieve full analysis details by ID."""
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID '{analysis_id}' not found."
        )
    try:
        data = json.loads(record.results_json)
        return FullAnalysisResponse(**data)
    except Exception as e:
        logger.error(f"Error deserializing analysis JSON: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reconstruct analysis record."
        )

@router.delete("/analyses/{analysis_id}", tags=["History"])
def delete_analysis(analysis_id: str, db: Session = Depends(get_db)):
    """Delete a saved analysis from history."""
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID '{analysis_id}' not found."
        )
    db.delete(record)
    db.commit()
    return {"message": f"Analysis '{analysis_id}' successfully deleted."}

@router.get("/analyses/{analysis_id}/report", response_class=HTMLResponse, tags=["Report"])
def get_analysis_report_html(analysis_id: str, db: Session = Depends(get_db)):
    """Generate printable HTML report for an analysis."""
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID '{analysis_id}' not found."
        )
    try:
        data = json.loads(record.results_json)
        full_analysis = FullAnalysisResponse(**data)
        report_html = ReportGenerator.generate_html_report(full_analysis)
        return HTMLResponse(content=report_html, status_code=200)
    except Exception as e:
        logger.error(f"Error generating report: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate report."
        )
