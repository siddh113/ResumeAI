import { useState, useRef } from 'react';

function FileInput({ file, onChange }) {
  const inputRef = useRef();
  return (
    <div
      onClick={() => inputRef.current.click()}
      className={`flex items-center gap-4 border-2 border-dashed rounded-2xl px-5 py-4 cursor-pointer transition-all
        ${file
          ? 'border-indigo-400 bg-indigo-50/70'
          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
        }`}
    >
      <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={onChange} />
      <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
        ${file ? 'bg-indigo-100' : 'bg-gray-100'}`}>
        {file ? (
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {file ? (
          <>
            <p className="font-semibold text-indigo-700 text-sm truncate">{file.name}</p>
            <p className="text-xs text-indigo-400 mt-0.5">Click to change</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-gray-700 text-sm">Upload Resume</p>
            <p className="text-xs text-gray-400 mt-0.5">PDF files only · Click to browse</p>
          </>
        )}
      </div>
      {!file && (
        <span className="shrink-0 text-xs font-medium text-indigo-500 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
          Browse
        </span>
      )}
    </div>
  );
}

const steps = [
  { n: '01', title: 'Upload Your Resume', desc: 'Drop your PDF resume — we extract all the details automatically.' },
  { n: '02', title: 'Paste the Job Description', desc: 'Copy the full JD from any job board and paste it below.' },
  { n: '03', title: 'Get Your Match Score', desc: 'Receive an AI-powered score, gap analysis, and edit suggestions.' },
];

export default function UploadForm({ onSubmit, onHistory, onBack }) {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resume || !jd.trim()) return;
    onSubmit(resume, jd.trim());
  };

  const ready = resume && jd.trim();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="md:w-[42%] bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col px-10 py-10 md:min-h-screen">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit mb-14"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Branding */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg style={{width:'18px',height:'18px'}} className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Resume Matcher</span>
        </div>

        <h2 className="text-3xl font-black text-white leading-tight mb-3 tracking-tight">
          How it<br />
          <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            works
          </span>
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-10">
          Three simple steps to know exactly where you stand.
        </p>

        {/* Steps */}
        <div className="space-y-7 flex-1">
          {steps.map((s, i) => (
            <div key={s.n} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <span className="text-indigo-400 text-xs font-bold">{s.n}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 mt-2 bg-indigo-500/15" />
                )}
              </div>
              <div className="pb-2">
                <p className="text-white font-semibold text-sm">{s.title}</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 pt-8 border-t border-white/8">
          <p className="text-slate-500 text-xs leading-relaxed">
            Your data is processed securely and never stored without your permission.
          </p>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────── */}
      <div className="flex-1 bg-white flex flex-col">

        {/* Top bar */}
        <div className="px-10 h-16 flex items-center justify-end border-b border-gray-100">
          <button
            onClick={onHistory}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-14 py-12">
          <div className="w-full max-w-lg">

            <div className="mb-8">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Analyze your resume</h1>
              <p className="text-gray-400 text-sm mt-1.5">Upload your PDF and paste the job description below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  Resume
                </label>
                <FileInput file={resume} onChange={(e) => setResume(e.target.files[0])} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  Job Description
                </label>
                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={9}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-300 resize-none transition-all leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={!ready}
                className="w-full py-3.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl hover:from-indigo-500 hover:to-violet-500 disabled:opacity-35 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200/80 hover:shadow-indigo-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none text-sm tracking-wide"
              >
                Analyze Match →
              </button>

              {!ready && (
                <p className="text-center text-xs text-gray-400">
                  {!resume && !jd.trim() ? 'Upload a resume and paste a job description to continue'
                    : !resume ? 'Upload your resume to continue'
                    : 'Paste a job description to continue'}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
