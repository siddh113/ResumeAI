# Resume Screener API

This project compares a resume PDF against a job description and returns structured JSON.

## Features
- CLI mode for local testing
- FastAPI endpoint for API usage
- Structured output validated with Pydantic

## Setup
```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

## Run as API
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

Health check:
```bash
curl http://localhost:8000/health
```

Analyze endpoint:
```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "pdf=@resume.pdf" \
  -F "jd=Looking for a Data Engineer with Python, SQL, and AWS experience."
```

## Run as CLI
```bash
python app.py --pdf resume.pdf --jd jd.txt --out response.json
```

## Make It Public
1. Push this repo to GitHub.
2. Deploy with a service like Render, Railway, or Fly.io.
3. Set environment variable `OPENAI_API_KEY` in the deployment dashboard.
4. Use start command:
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```
5. Share the deployed URL, for example:
`https://your-app.onrender.com/analyze`

## Notes
- `pypdf` extracts text only from text-based PDFs, not scanned image PDFs.
- For scanned resumes, add OCR (for example `pytesseract`) before analysis.
