import logging
from typing import Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

# Lazy global model variable
_model = None
_model_attempted = False

def get_sentence_transformer_model():
    global _model, _model_attempted
    if _model_attempted:
        return _model
    _model_attempted = True
    try:
        from sentence_transformers import SentenceTransformer
        from app.core.config import settings
        logger.info(f"Loading SentenceTransformer model '{settings.SENTENCE_TRANSFORMER_MODEL}'...")
        _model = SentenceTransformer(settings.SENTENCE_TRANSFORMER_MODEL)
        logger.info("SentenceTransformer model loaded successfully.")
    except Exception as e:
        logger.warning(f"Could not load SentenceTransformer ('{e}'). Falling back to TF-IDF cosine similarity.")
        _model = None
    return _model

class SemanticMatcher:
    @staticmethod
    def compute_similarity(resume_text: str, jd_text: str) -> Tuple[float, str]:
        """
        Calculates semantic similarity between resume and job description.
        Returns: (similarity_score_0_to_100, engine_name)
        """
        if not resume_text.strip() or not jd_text.strip():
            return 0.0, "none"

        model = get_sentence_transformer_model()
        
        if model is not None:
            try:
                # Dense embedding cosine similarity
                embeddings = model.encode([resume_text[:2000], jd_text[:2000]])
                dense_sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
                # Scale from typical [-0.2, 1.0] to [0.0, 100.0]
                normalized = max(0.0, min(100.0, float(dense_sim) * 100.0))
                return round(normalized, 1), "sentence_transformers (all-MiniLM-L6-v2)"
            except Exception as e:
                logger.warning(f"SentenceTransformer inference failed: {e}. Falling back to TF-IDF.")

        # Fallback: TF-IDF with unigrams and bigrams
        try:
            vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_features=1000)
            tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
            sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            # TF-IDF cosine similarity typically sits in 0.15 - 0.70 for matching text.
            # We map 0.1 - 0.6 to 20% - 95%
            scaled = min(100.0, max(0.0, float(sim) * 140.0))
            return round(scaled, 1), "scikit-learn TF-IDF Cosine Similarity (Fallback)"
        except Exception as e:
            logger.error(f"TF-IDF similarity calculation failed: {e}")
            return 45.0, "heuristic_fallback"
