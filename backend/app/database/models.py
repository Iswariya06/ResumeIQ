import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(String(36), primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), index=True)
    resume_filename = Column(String(255), nullable=False)
    candidate_name = Column(String(255), default="Candidate")
    job_title = Column(String(255), default="Target Job")
    ats_score = Column(Float, nullable=False)
    job_match_score = Column(Float, nullable=False)
    matched_skills_count = Column(Integer, default=0)
    missing_skills_count = Column(Integer, default=0)
    ai_used = Column(Boolean, default=False)
    ai_provider = Column(String(50), default="rule_based")
    
    # Store complete structured analysis JSON
    results_json = Column(Text, nullable=False)
