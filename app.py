import os
import json
import argparse
from io import BytesIO
from typing import List, Optional, Dict, Any

from dotenv import load_dotenv
from pypdf import PdfReader

from pydantic import BaseModel, Field
from fastapi import FastAPI, File, Form, HTTPException, UploadFile

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from prompt import SYSTEM_INSTRUCTIONS, USER_TEMPLATE


# -----------------------------
# 1) PDF -> text using pypdf
# -----------------------------
def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    chunks = []
    for page in reader.pages:
        text = page.extract_text() or ""
        text = " ".join(text.split())
        if text:
            chunks.append(text)
    return "\n".join(chunks).strip()


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(pdf_bytes))
    chunks = []
    for page in reader.pages:
        text = page.extract_text() or ""
        text = " ".join(text.split())
        if text:
            chunks.append(text)
    return "\n".join(chunks).strip()


def load_job_description(jd_arg: str) -> str:
    """
    If jd_arg is a path to an existing .txt/.md file, read it.
    Otherwise treat jd_arg as literal job description text.
    """
    if os.path.isfile(jd_arg):
        with open(jd_arg, "r", encoding="utf-8") as f:
            return f.read().strip()
    return jd_arg.strip()


# -----------------------------
# 2) Output schema (JSON keys)
# -----------------------------
class ResumeJDResponse(BaseModel):
    # Resume basics
    full_name: Optional[str] = Field(default=None)
    email: Optional[str] = Field(default=None)
    phone: Optional[str] = Field(default=None)
    location: Optional[str] = Field(default=None)

    linkedin: Optional[str] = Field(default=None)
    github: Optional[str] = Field(default=None)

    years_of_experience: Optional[float] = Field(default=None)
    current_title: Optional[str] = Field(default=None)

    skills: List[str] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    work_experience: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)

    # Job fit section
    match_summary: Optional[str] = Field(default=None, description="1-3 sentence overall fit summary")
    match_score: Optional[int] = Field(default=None, ge=0, le=100, description="0-100 overall match score")
    matched_requirements: List[str] = Field(default_factory=list, description="JD requirements supported by resume evidence")
    missing_requirements: List[str] = Field(default_factory=list, description="JD requirements not found in resume")
    recommended_resume_edits: List[str] = Field(default_factory=list, description="Concrete resume edits to better match the JD")


def build_question_keys_from_schema() -> List[str]:
    return list(ResumeJDResponse.model_fields.keys())


# -----------------------------
# 3) LangChain + ChatGPT API call
# -----------------------------
def analyze_resume_vs_jd(resume_text: str, job_description: str) -> Dict[str, Any]:
    load_dotenv()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("Missing OPENAI_API_KEY. Put it in .env")

    model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    llm = ChatOpenAI(
        model=model_name,
        temperature=0,
        api_key=api_key,
    )

    parser = JsonOutputParser(pydantic_object=ResumeJDResponse)
    question_keys = build_question_keys_from_schema()

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_INSTRUCTIONS),
        ("user", USER_TEMPLATE),
        ("user", "JSON schema instructions:\n{format_instructions}")
    ])

    chain = prompt | llm | parser

    result = chain.invoke({
        "resume_text": resume_text,
        "job_description": job_description,
        "question_keys": json.dumps(question_keys, indent=2),
        "format_instructions": parser.get_format_instructions(),
    })

    return result


app = FastAPI(
    title="Resume Screener API",
    version="1.0.0",
    description="Analyze a resume PDF against a job description and return structured JSON.",
)


@app.get("/health")
def health_check() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=ResumeJDResponse)
async def analyze_resume_api(
    pdf: UploadFile = File(..., description="Resume PDF file"),
    jd: str = Form(..., description="Job description text"),
) -> Dict[str, Any]:
    if pdf.content_type not in {"application/pdf", "application/octet-stream"}:
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF.")

    pdf_bytes = await pdf.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty.")

    resume_text = extract_text_from_pdf_bytes(pdf_bytes)
    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="No text extracted from PDF. If it is scanned, pypdf cannot OCR it.",
        )

    job_description = jd.strip()
    if not job_description:
        raise HTTPException(status_code=400, detail="Job description is empty.")

    try:
        return analyze_resume_vs_jd(resume_text=resume_text, job_description=job_description)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(exc)}") from exc


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", required=True, help="Path to resume PDF")
    ap.add_argument(
        "--jd",
        required=True,
        help="Job description text OR path to a .txt/.md file containing the JD"
    )
    ap.add_argument("--out", default="response.json", help="Output JSON file")
    args = ap.parse_args()

    resume_text = extract_text_from_pdf(args.pdf)
    if not resume_text:
        raise RuntimeError("No text extracted from the PDF. If it is scanned, pypdf won't OCR it.")

    job_description = load_job_description(args.jd)
    if not job_description:
        raise RuntimeError("Job description is empty.")

    response = analyze_resume_vs_jd(resume_text, job_description)

    print(json.dumps(response, indent=2, ensure_ascii=False))

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(response, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to: {args.out}")


if __name__ == "__main__":
    main()
