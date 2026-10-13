import re
from typing import Dict, List, Set, Tuple, Optional
from app.schemas.analysis import SkillMatchItem

# Canonical Skill Taxonomy with Aliases and Categories
SKILL_TAXONOMY: Dict[str, Dict] = {
    "Python": {"category": "Languages", "aliases": ["python", "python3", "py"]},
    "JavaScript": {"category": "Languages", "aliases": ["javascript", "js", "ecmascript"]},
    "TypeScript": {"category": "Languages", "aliases": ["typescript", "ts"]},
    "Java": {"category": "Languages", "aliases": ["java", "jvm"]},
    "C++": {"category": "Languages", "aliases": ["c++", "cpp"]},
    "C#": {"category": "Languages", "aliases": ["c#", "csharp", ".net"]},
    "Go": {"category": "Languages", "aliases": ["go", "golang"]},
    "Rust": {"category": "Languages", "aliases": ["rust"]},
    "SQL": {"category": "Databases", "aliases": ["sql", "structured query language"]},
    "HTML5": {"category": "Frontend", "aliases": ["html", "html5"]},
    "CSS3": {"category": "Frontend", "aliases": ["css", "css3", "sass", "scss"]},
    "React": {"category": "Frontend", "aliases": ["react", "react.js", "reactjs"]},
    "Vue.js": {"category": "Frontend", "aliases": ["vue", "vue.js", "vuejs"]},
    "Angular": {"category": "Frontend", "aliases": ["angular", "angularjs"]},
    "Next.js": {"category": "Frontend", "aliases": ["next.js", "nextjs"]},
    "Tailwind CSS": {"category": "Frontend", "aliases": ["tailwind", "tailwindcss"]},
    "FastAPI": {"category": "Backend", "aliases": ["fastapi"]},
    "Flask": {"category": "Backend", "aliases": ["flask"]},
    "Django": {"category": "Backend", "aliases": ["django"]},
    "Node.js": {"category": "Backend", "aliases": ["node", "nodejs", "node.js", "express.js", "express"]},
    "RESTful APIs": {"category": "Backend", "aliases": ["rest", "rest api", "rest apis", "restful", "restful api", "restful apis"]},
    "GraphQL": {"category": "Backend", "aliases": ["graphql"]},
    "Microservices": {"category": "Architecture", "aliases": ["microservices", "microservice architecture", "system design"]},
    "PostgreSQL": {"category": "Databases", "aliases": ["postgresql", "postgres", "psql"]},
    "MySQL": {"category": "Databases", "aliases": ["mysql", "mariadb"]},
    "MongoDB": {"category": "Databases", "aliases": ["mongodb", "mongo", "nosql"]},
    "Redis": {"category": "Databases", "aliases": ["redis", "in-memory database", "cache"]},
    "Docker": {"category": "Cloud & DevOps", "aliases": ["docker", "container", "containers", "containerization"]},
    "Kubernetes": {"category": "Cloud & DevOps", "aliases": ["kubernetes", "k8s"]},
    "AWS": {"category": "Cloud & DevOps", "aliases": ["aws", "amazon web services", "ec2", "s3", "lambda"]},
    "GCP": {"category": "Cloud & DevOps", "aliases": ["gcp", "google cloud", "google cloud platform"]},
    "Azure": {"category": "Cloud & DevOps", "aliases": ["azure", "microsoft azure"]},
    "CI/CD": {"category": "Cloud & DevOps", "aliases": ["ci/cd", "continuous integration", "github actions", "gitlab ci", "jenkins"]},
    "Git": {"category": "Tools", "aliases": ["git", "github", "gitlab", "version control"]},
    "Linux": {"category": "Systems", "aliases": ["linux", "unix", "bash", "shell scripting"]},
    "Machine Learning": {"category": "AI / Data Science", "aliases": ["machine learning", "ml", "scikit-learn", "sklearn"]},
    "Deep Learning": {"category": "AI / Data Science", "aliases": ["deep learning", "neural networks", "pytorch", "tensorflow", "keras"]},
    "Natural Language Processing": {"category": "AI / Data Science", "aliases": ["nlp", "natural language processing", "spacy", "hugging face", "transformers", "llm", "large language models"]},
    "Data Analysis": {"category": "AI / Data Science", "aliases": ["data analysis", "pandas", "numpy", "data analytics", "eda"]},
    "Unit Testing": {"category": "Quality Assurance", "aliases": ["unit testing", "pytest", "jest", "tdd", "integration testing"]},
    "Agile/Scrum": {"category": "Methodologies", "aliases": ["agile", "scrum", "kanban", "sprints"]},
    "Problem Solving": {"category": "Soft Skills", "aliases": ["problem solving", "analytical thinking", "critical thinking"]},
    "Team Collaboration": {"category": "Soft Skills", "aliases": ["teamwork", "collaboration", "cross-functional teams", "communication skills"]}
}

# Related Skill Families for Partial Match detection
RELATED_FAMILIES = {
    "Kubernetes": ["Docker"],
    "Docker": ["Kubernetes"],
    "PostgreSQL": ["SQL", "MySQL"],
    "MySQL": ["SQL", "PostgreSQL"],
    "MongoDB": ["SQL", "Redis"],
    "Deep Learning": ["Machine Learning", "Data Analysis"],
    "Natural Language Processing": ["Machine Learning", "Deep Learning"],
    "Next.js": ["React", "JavaScript", "TypeScript"],
    "TypeScript": ["JavaScript"],
    "FastAPI": ["Python", "Flask", "Django"],
    "AWS": ["GCP", "Azure", "Docker"],
    "Azure": ["AWS", "GCP"],
    "GCP": ["AWS", "Azure"],
    "Microservices": ["RESTful APIs", "Docker"]
}

class SkillsExtractor:
    @staticmethod
    def _find_mention(text_lower: str, alias: str) -> bool:
        """Word-boundary sensitive check for alias match."""
        # Special symbols like c++, c# require tailored regex
        if alias in ["c++", "c#", ".net"]:
            escaped = re.escape(alias)
            return bool(re.search(r'(?:^|\s|[(\[,])' + escaped + r'(?:$|\s|[)\],.:])', text_lower))
        pattern = r'\b' + re.escape(alias) + r'\b'
        return bool(re.search(pattern, text_lower))

    @staticmethod
    def _extract_evidence(text: str, aliases: List[str]) -> Optional[str]:
        """Find the sentence or line mentioning any of the aliases as proof."""
        lines = text.splitlines()
        for line in lines:
            line_str = line.strip()
            line_lower = line_str.lower()
            for alias in aliases:
                if SkillsExtractor._find_mention(line_lower, alias):
                    # Clean up bullet markers
                    cleaned = re.sub(r'^[•\-\*\d\.\s]+', '', line_str).strip()
                    if len(cleaned) > 120:
                        cleaned = cleaned[:117] + "..."
                    return cleaned
        return None

    @classmethod
    def extract_skills_from_text(cls, text: str) -> Dict[str, Dict]:
        """Extract canonical skills found in given text along with category and evidence."""
        text_lower = text.lower()
        extracted = {}

        for canonical, meta in SKILL_TAXONOMY.items():
            for alias in meta["aliases"]:
                if cls._find_mention(text_lower, alias):
                    evidence = cls._extract_evidence(text, meta["aliases"])
                    extracted[canonical] = {
                        "category": meta["category"],
                        "evidence": evidence
                    }
                    break

        return extracted

    @classmethod
    def parse_job_description_skills(cls, jd_text: str) -> Tuple[List[str], List[str]]:
        """Identify required vs preferred skills from Job Description."""
        lines = jd_text.splitlines()
        jd_lower = jd_text.lower()
        
        # Check if JD has explicit sections for required vs preferred
        required_section_lines = []
        preferred_section_lines = []
        current_bucket = "required" # default

        for line in lines:
            l_lower = line.strip().lower()
            if any(h in l_lower for h in ["preferred", "nice to have", "plus", "bonus", "desirable"]):
                current_bucket = "preferred"
            elif any(h in l_lower for h in ["required", "must have", "minimum", "qualifications", "requirements", "essential"]):
                current_bucket = "required"
                
            if current_bucket == "preferred":
                preferred_section_lines.append(line)
            else:
                required_section_lines.append(line)

        all_extracted = cls.extract_skills_from_text(jd_text)
        preferred_extracted = cls.extract_skills_from_text("\n".join(preferred_section_lines))
        
        required_skills = []
        preferred_skills = []

        for skill in all_extracted.keys():
            if skill in preferred_extracted and len(preferred_section_lines) > 0:
                preferred_skills.append(skill)
            else:
                required_skills.append(skill)

        # Fallback if everything ended up in preferred or empty
        if not required_skills and preferred_skills:
            required_skills = preferred_skills
            preferred_skills = []

        return required_skills, preferred_skills

    @classmethod
    def match_skills(
        cls, resume_text: str, jd_text: str
    ) -> Tuple[List[SkillMatchItem], List[SkillMatchItem], List[SkillMatchItem]]:
        """
        Compare skills in resume against job description.
        Returns: (matched_skills, partial_skills, missing_skills)
        """
        resume_skills_dict = cls.extract_skills_from_text(resume_text)
        req_skills, pref_skills = cls.parse_job_description_skills(jd_text)
        
        all_target_skills = [(s, "required") for s in req_skills] + [(s, "preferred") for s in pref_skills]
        
        matched_items: List[SkillMatchItem] = []
        partial_items: List[SkillMatchItem] = []
        missing_items: List[SkillMatchItem] = []

        for skill_name, importance in all_target_skills:
            category = SKILL_TAXONOMY.get(skill_name, {}).get("category", "Technical")

            # 1. Direct match
            if skill_name in resume_skills_dict:
                evidence = resume_skills_dict[skill_name]["evidence"]
                matched_items.append(SkillMatchItem(
                    skill=skill_name,
                    category=category,
                    status="matched",
                    resume_evidence=evidence or f"Mentioned in resume under {category}",
                    importance=importance
                ))
            else:
                # 2. Check for partial / related family match
                related_candidates = RELATED_FAMILIES.get(skill_name, [])
                partial_found = False
                for rel in related_candidates:
                    if rel in resume_skills_dict:
                        rel_evidence = resume_skills_dict[rel]["evidence"]
                        partial_items.append(SkillMatchItem(
                            skill=skill_name,
                            category=category,
                            status="partial",
                            resume_evidence=f"Demonstrated related proficiency in {rel}: '{rel_evidence}'",
                            importance=importance
                        ))
                        partial_found = True
                        break
                
                # 3. Missing
                if not partial_found:
                    missing_items.append(SkillMatchItem(
                        skill=skill_name,
                        category=category,
                        status="missing",
                        resume_evidence=None,
                        importance=importance
                    ))

        return matched_items, partial_items, missing_items
