import html
from app.schemas.analysis import FullAnalysisResponse

class ReportGenerator:
    @classmethod
    def generate_html_report(cls, analysis: FullAnalysisResponse) -> str:
        """Generates a professional, print-optimized HTML report document."""
        
        # Format skill badges
        matched_html = "".join([
            f'<span class="badge badge-success">{html.escape(s.skill)}</span>'
            for s in analysis.job_match_result.matched_skills
        ]) or '<span class="text-muted">None detected</span>'

        partial_html = "".join([
            f'<span class="badge badge-warning">{html.escape(s.skill)}</span>'
            for s in analysis.job_match_result.partial_skills
        ]) or '<span class="text-muted">None detected</span>'

        missing_html = "".join([
            f'<span class="badge badge-danger">{html.escape(s.skill)}</span>'
            for s in analysis.job_match_result.missing_skills
        ]) or '<span class="text-muted">None detected</span>'

        # Factors table
        factors_rows = "".join([
            f"""<tr>
                <td><strong>{html.escape(f.name)}</strong><br><small class="text-muted">{html.escape(f.category)}</small></td>
                <td><span class="badge badge-{ 'success' if f.status == 'pass' else 'warning' if f.status == 'warning' else 'danger' }">{f.status.upper()}</span></td>
                <td><strong>{f.earned_score}</strong> / {f.max_score}</td>
                <td>{html.escape(f.feedback)}<br><small class="tip">Tip: {html.escape(f.actionable_tip)}</small></td>
            </tr>"""
            for f in analysis.ats_result.factors
        ])

        # Strengths
        strengths_html = "".join([
            f"<li>{html.escape(s)}</li>"
            for s in analysis.ai_explanation.strengths
        ])

        # Weaknesses
        weaknesses_html = "".join([
            f"<li>{html.escape(w)}</li>"
            for w in analysis.ai_explanation.weaknesses
        ])

        # Recommendations
        recommendations_html = "".join([
            f"<li>{html.escape(r)}</li>"
            for r in analysis.ai_explanation.improvement_recommendations
        ])

        # Bullet rewrites
        rewrites_html = "".join([
            f"""<div class="rewrite-card">
                <div class="rewrite-original"><strong>Original:</strong> {html.escape(b.original)}</div>
                <div class="rewrite-suggested"><strong>Suggested (STAR):</strong> {html.escape(b.suggested)}</div>
                <div class="rewrite-reason"><small><em>Rationale: {html.escape(b.reason)}</em></small></div>
            </div>"""
            for b in analysis.ai_explanation.suggested_bullet_rewrites
        ])

        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ResumeIQ Analysis Report - {html.escape(analysis.filename)}</title>
    <style>
        @page {{
            size: A4;
            margin: 1.5cm;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            margin: 0;
            padding: 24px;
            font-size: 14px;
            line-height: 1.5;
        }}
        .report-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }}
        .logo-title {{
            font-size: 24px;
            font-weight: 800;
            color: #4338ca;
            margin: 0;
        }}
        .subtitle {{
            color: #64748b;
            font-size: 13px;
            margin: 4px 0 0 0;
        }}
        .meta-box {{
            text-align: right;
            font-size: 12px;
            color: #64748b;
        }}
        .scores-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }}
        .score-card {{
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            background: #f8fafc;
            text-align: center;
        }}
        .score-number {{
            font-size: 40px;
            font-weight: 800;
            margin: 8px 0;
        }}
        .score-number.ats {{ color: #2563eb; }}
        .score-number.match {{ color: #059669; }}
        .section-title {{
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 6px;
            margin-top: 24px;
            margin-bottom: 12px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            font-size: 13px;
        }}
        th, td {{
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
        }}
        th {{
            background: #f1f5f9;
            font-weight: 600;
        }}
        .badge {{
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin: 2px;
        }}
        .badge-success {{ background: #dcfce7; color: #166534; }}
        .badge-warning {{ background: #fef3c7; color: #92400e; }}
        .badge-danger {{ background: #fee2e2; color: #991b1b; }}
        .text-muted {{ color: #64748b; }}
        .tip {{ color: #4338ca; }}
        .rewrite-card {{
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 10px;
            background: #fafafa;
        }}
        .rewrite-original {{ color: #b91c1c; margin-bottom: 4px; }}
        .rewrite-suggested {{ color: #15803d; margin-bottom: 4px; }}
        .rewrite-reason {{ color: #475569; }}
        .disclaimer-box {{
            background: #f8fafc;
            border: 1px dashed #cbd5e1;
            border-radius: 6px;
            padding: 12px;
            font-size: 11px;
            color: #64748b;
            margin-top: 30px;
        }}
        .print-btn {{
            background: #4f46e5;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
        }}
        @media print {{
            .no-print {{ display: none; }}
            body {{ padding: 0; }}
            .score-card {{ border: 1px solid #cbd5e1; }}
        }}
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: flex-end;">
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
    </div>

    <div class="report-header">
        <div>
            <h1 class="logo-title">ResumeIQ</h1>
            <p class="subtitle">AI Resume ATS Analyzer & Job Matching Evaluation Report</p>
        </div>
        <div class="meta-box">
            <div><strong>Report ID:</strong> {analysis.id[:8]}</div>
            <div><strong>Date:</strong> {html.escape(analysis.timestamp)}</div>
            <div><strong>Candidate:</strong> {html.escape(analysis.parsed_resume.candidate_name or "N/A")}</div>
            <div><strong>Target Job:</strong> {html.escape(analysis.job_title)}</div>
        </div>
    </div>

    <div class="scores-grid">
        <div class="score-card">
            <div style="font-weight: 600; color: #475569;">ATS READINESS SCORE</div>
            <div class="score-number ats">{analysis.ats_result.total_score} <span style="font-size: 18px; color: #64748b;">/ 100</span></div>
            <div><span class="badge badge-success">{analysis.ats_result.status_label}</span></div>
        </div>
        <div class="score-card">
            <div style="font-weight: 600; color: #475569;">JOB MATCHING SCORE</div>
            <div class="score-number match">{analysis.job_match_result.total_score} <span style="font-size: 18px; color: #64748b;">/ 100</span></div>
            <div><span class="badge badge-success">{analysis.job_match_result.status_label}</span></div>
        </div>
    </div>

    <div class="section-title">Executive Summary</div>
    <p>{html.escape(analysis.ai_explanation.summary)}</p>
    <p><small class="text-muted"><strong>Analysis Engine:</strong> {html.escape(analysis.ai_explanation.model_name)} ({'Local LLM' if analysis.ai_explanation.ai_provider == 'ollama' else 'Rule-Based Engine'}) | <strong>Semantic Similarity:</strong> {analysis.job_match_result.semantic_similarity_percent}% via {html.escape(analysis.job_match_result.semantic_engine_used)}</small></p>

    <div class="section-title">Skills Matrix Alignment</div>
    <table>
        <tr>
            <th style="width: 20%;">Status</th>
            <th>Skills Identified</th>
        </tr>
        <tr>
            <td><span class="badge badge-success">MATCHED</span></td>
            <td>{matched_html}</td>
        </tr>
        <tr>
            <td><span class="badge badge-warning">PARTIAL</span></td>
            <td>{partial_html}</td>
        </tr>
        <tr>
            <td><span class="badge badge-danger">MISSING</span></td>
            <td>{missing_html}</td>
        </tr>
    </table>

    <div class="section-title">ATS Readiness Factor Breakdown</div>
    <table>
        <thead>
            <tr>
                <th style="width: 25%;">Evaluation Factor</th>
                <th style="width: 12%;">Status</th>
                <th style="width: 15%;">Points</th>
                <th>Feedback & Optimization</th>
            </tr>
        </thead>
        <tbody>
            {factors_rows}
        </tbody>
    </table>

    <div class="section-title">Key Strengths & Identified Gaps</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px;">
            <strong style="color: #166534;">Verified Strengths:</strong>
            <ul style="margin: 8px 0 0 0; padding-left: 18px; color: #166534;">
                {strengths_html}
            </ul>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 12px;">
            <strong style="color: #991b1b;">Identified Gaps:</strong>
            <ul style="margin: 8px 0 0 0; padding-left: 18px; color: #991b1b;">
                {weaknesses_html}
            </ul>
        </div>
    </div>

    <div class="section-title">Personalized Improvement Recommendations</div>
    <ul>
        {recommendations_html}
    </ul>

    { f'<div class="section-title">Actionable Bullet Point Rewrites (STAR Method)</div>{rewrites_html}' if rewrites_html else '' }

    <div class="disclaimer-box">
        <strong>Important Notice & Academic Disclaimer:</strong><br>
        This evaluation is an algorithmic estimation intended for resume optimization and educational self-assessment. Scores do not represent proprietary internal hiring decisions of specific employers. No personal contact data is utilized for scoring computations.
    </div>
</body>
</html>"""
