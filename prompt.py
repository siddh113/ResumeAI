SYSTEM_INSTRUCTIONS = """\
You are a resume-to-job matching assistant.

Use the resume AND the job description to answer the questions.
If something is not present in the resume, output null for that field.
For fit-related answers, base them on evidence from the resume vs the job description.

Return a SINGLE valid JSON object and nothing else.
"""

USER_TEMPLATE = """\
Resume (extracted text):
-----------------------
{resume_text}
-----------------------

Job Description:
-----------------------
{job_description}
-----------------------

Questions to answer (return JSON with these exact keys):
{question_keys}

Rules:
- Return strictly valid JSON.
- Use null when not found in resume.
- Use [] when a list field has no items.
- Do not add extra keys.
"""