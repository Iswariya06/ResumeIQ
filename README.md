# ResumeIQ — AI Resume ATS Analyzer & Job Matching System

ResumeIQ is a full-stack, local-first web application designed for analyzing resumes against target job descriptions. It computes two distinct, transparent scores: an **ATS Readiness Score (0–100)** and a **Job Matching Score (0–100)**, extracts structured resume sections, performs semantic and keyword alignment, and provides personalized improvement recommendations with STAR-method bullet point rewrites.

---

## 🌟 Key Features

1. **Dual Independent Scoring Engines**:
   - **ATS Readiness Score (0–100)**: Deterministic evaluation of document parsability, standard section headers, contact completeness, readability, action verb usage, and target keyword density.
   - **Job Matching Score (0–100)**: Multi-factor evaluation of required skills (35%), preferred skills (15%), semantic similarity via Sentence Transformers (20%), experience alignment (15%), project relevance (10%), and education qualifications (5%).
2. **Explainable Skills Matrix**:
   - Explicitly separates **Matched Skills**, **Partially Demonstrated Skills** (inferred from related skill families like Docker $\leftrightarrow$ Kubernetes), and **Missing Skills**.
   - Highlights exact extracted text evidence from the candidate's resume for every finding.
3. **Local AI Explanations & STAR Rewrites**:
   - Connects directly to local **Ollama** models (`llama3.2`, `phi3`, `mistral`) for privacy-preserving AI explanations without any external cloud API fees or data leaks.
   - Includes an automatic **deterministic rule-based fallback engine** that continues generating strengths, gaps, and STAR-method bullet rewrites even if Ollama is offline or uninstalled.
4. **Document Parsing (PDF & Word)**:
   - Built with **PyMuPDF** (`fitz`) and **python-docx** to extract text, tables, and section hierarchies from PDF and DOCX files.
   - Comprehensive validation against empty files, corrupt binaries, encrypted/password-protected PDFs, and image-only scans.
5. **Printable / Exportable Reports**:
   - One-click print-ready HTML evaluation reports with CSS print layouts (`@media print`), score badges, and structured recommendations.
6. **Local Persistence & Privacy**:
   - SQLite database for storing analysis history locally.
   - Analysis records can be viewed, reopened, or deleted with one click.
   - Resumes are processed in-memory or in short-lived temporary files that are purged immediately.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend**: FastAPI, Uvicorn, Python 3.12/3.11, Pydantic v2, SQLAlchemy, SQLite
- **Resume Parsing**: PyMuPDF (`fitz`), `python-docx`
- **NLP & Similarity**: Sentence Transformers (`all-MiniLM-L6-v2`), Scikit-Learn TF-IDF Cosine Similarity, Regular Expressions
- **AI Inference**: Local Ollama REST API (`http://localhost:11434`) with prompt injection sanitization and deterministic fallback
- **Testing**: Pytest, FastAPI TestClient

---

## 📋 System Prerequisites (Windows)

Before starting, ensure the following are installed on your Windows system:

1. **Python 3.11 or 3.12**:
   - Verify in PowerShell:
     ```powershell
     python --version
     ```
2. **Node.js (v18+ or v20+) and npm**:
   - Verify in PowerShell:
     ```powershell
     node --version
     npm --version
     ```
3. **Ollama (Optional — for local LLM inference)**:
   - Download from: [https://ollama.com/download](https://ollama.com/download)
   - Verify in PowerShell:
     ```powershell
     ollama --version
     ```

---

## 🚀 Step-by-Step Setup Instructions

### 1. Open the Project Directory

Open Windows Terminal or PowerShell:

```powershell
cd C:\Users\Iswariya\.gemini\antigravity\scratch\resumeiq
```

---

### 2. Set Up the Backend

In PowerShell, navigate to the `backend` folder:

```powershell
cd backend
```

#### A. Create and Activate Virtual Environment
```powershell
# Create venv (already created during build)
python -m venv venv

# Activate venv on Windows PowerShell
.\venv\Scripts\Activate.ps1
```

> **Note for PowerShell execution policy**: If you see an error about script execution being disabled, run:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> .\venv\Scripts\Activate.ps1
> ```

#### B. Install Python Dependencies
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

### 3. Set Up the Frontend

Open a **new** PowerShell terminal and navigate to the `frontend` folder:

```powershell
cd C:\Users\Iswariya\.gemini\antigravity\scratch\resumeiq\frontend
```

Install frontend packages:
```powershell
npm install
```

---

### 4. (Optional) Configure Local Ollama AI

ResumeIQ runs completely fine **without** Ollama using its built-in rule-based explanation engine. 

To enable local LLM-powered insights:
1. Ensure Ollama is running in the Windows system tray.
2. Pull the recommended lightweight model in PowerShell:
   ```powershell
   ollama pull llama3.2
   ```
   *(Alternative lightweight models: `ollama pull phi3` or `ollama pull mistral`)*
3. When you open the ResumeIQ website, the top navbar will display a green pill: **"Ollama AI Ready"**.

---

## 💻 Running the Application

To run the complete system locally, keep **two PowerShell terminals** open:

### Terminal 1: Backend Server (FastAPI)

```powershell
cd C:\Users\Iswariya\.gemini\antigravity\scratch\resumeiq\backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Backend API URL**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check**: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

---

### Terminal 2: Frontend Server (Vite React)

```powershell
cd C:\Users\Iswariya\.gemini\antigravity\scratch\resumeiq\frontend
npm run dev
```

- **Frontend Website URL**: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing the Application

### Running Backend Unit & Integration Tests

From the `backend` directory:

```powershell
cd C:\Users\Iswariya\.gemini\antigravity\scratch\resumeiq\backend
.\venv\Scripts\Activate.ps1
python -m pytest tests\ -v
```

All 14 tests will execute, verifying:
- Health and AI status endpoints
- Valid PDF text and structured section extraction
- Valid DOCX text and structured section extraction
- Corrupted, empty, or unreadable document rejections
- Deterministic ATS score calculations
- Multi-factor Job Matching score and skill taxonomy classification
- Ollama fallback mechanism
- End-to-end resume analysis, history retrieval, printable report generation, and deletion

---

## 🧭 How to Use the Website

1. Open your browser and navigate to **`http://localhost:5173`**.
2. Click **"Analyze My Resume"** on the landing page.
3. **Upload a Resume**:
   - Drag and drop a `.pdf` or `.docx` file (a sample resume `sample_alex_resume.pdf` is provided in the project root for testing).
4. **Paste a Job Description**:
   - Paste any software, data, or engineering job description, or click one of the quick sample buttons (**"Full Stack"** or **"Data Science"**).
5. Click **"Run ResumeIQ Analysis"**:
   - Watch the progressive progress messages as the parser extracts sections and the scoring engine evaluates compatibility.
6. **Explore the Results Dashboard**:
   - Inspect the **ATS Readiness Score** and **Job Matching Score** circular gauges.
   - Check the **AI Explanations & Rewrites** tab for strengths, gaps, and STAR-method bullet rewrites.
   - Switch to the **Skills Matrix** tab to see matched, partially demonstrated, and missing skills with exact text evidence.
   - Switch to the **Score Factors & Weights** tab to see point breakdowns.
   - Click **"Printable Report"** to view and print or export the PDF report.
7. Click **"History"** in the top navbar anytime to review or delete past analyses.

---

## 🛠️ Troubleshooting Guide

### 1. `python` or `npm` is not recognized
- Ensure Python and Node.js are added to your Windows system `PATH`.
- Restart your terminal after installing Python or Node.js.

### 2. Port Conflicts
- **Backend (Port 8000)**: If port 8000 is occupied by another service:
  ```powershell
  python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
  ```
  *(Update `frontend/vite.config.ts` target to `http://127.0.0.1:8001` if you change this port).*
- **Frontend (Port 5173)**: If port 5173 is occupied, Vite will automatically suggest the next available port (e.g., `5174`).

### 3. Ollama Status Shows "Offline" or "Pull Model"
- **Ollama Offline**: If Ollama is not running, ResumeIQ continues working seamlessly using its built-in rule-based analysis engine.
- **Model Pending**: If Ollama is running but has no model, run:
  ```powershell
  ollama pull llama3.2
  ```

### 4. Scanned PDF / Image Files
- ResumeIQ parses text-based PDFs. If a user uploads an image-only or scanned PDF without a text layer, the system returns a clear error prompting for a searchable text PDF or DOCX file.

---

## ⚖️ Academic Project Notice & Ethics

- The ATS Readiness and Job Matching scores are heuristic estimations based on standard parsing benchmarks. They do not represent proprietary internal hiring algorithms of specific companies.
- Scoring algorithms exclusively inspect technical qualifications and formatting structure. Candidate personal identifiers (name, gender, age, phone number, email) are never weighted in score calculations.
- Uploaded resumes are processed locally and are not transmitted to third-party commercial APIs.
