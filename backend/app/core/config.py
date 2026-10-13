import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "ResumeIQ - AI Resume ATS Analyzer"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Upload limits
    MAX_UPLOAD_SIZE_BYTES: int = 5 * 1024 * 1024  # 5 MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".docx"}
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./resumeiq.db")
    
    # Ollama Local AI Settings
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    OLLAMA_TIMEOUT_SECONDS: float = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", "45.0"))
    
    # Semantic Matching Model
    SENTENCE_TRANSFORMER_MODEL: str = os.getenv("SENTENCE_TRANSFORMER_MODEL", "all-MiniLM-L6-v2")
    
    # Weights for Job Matching (Total = 1.0)
    WEIGHT_REQUIRED_SKILLS: float = 0.35
    WEIGHT_PREFERRED_SKILLS: float = 0.15
    WEIGHT_SEMANTIC_SIMILARITY: float = 0.20
    WEIGHT_EXPERIENCE: float = 0.15
    WEIGHT_PROJECTS: float = 0.10
    WEIGHT_EDUCATION: float = 0.05

settings = Settings()
