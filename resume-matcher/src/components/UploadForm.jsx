import { useState, useRef } from 'react';

function FileInput({ label, file, onChange }) {
  const inputRef = useRef();
  return (
    <div
      onClick={() => inputRef.current.click()}
      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
    >
      <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={onChange} />
      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 16v-8m0 0l-3 3m3-3l3 3M6 20h12a2 2 0 002-2V8a2 2 0 00-.586-1.414l-4-4A2 2 0 0013.586 2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <p className="font-medium text-gray-700 text-sm">{label}</p>
      {file ? (
        <p className="text-xs text-indigo-600 mt-1 truncate max-w-xs">{file.name}</p>
      ) : (
        <p className="text-xs text-gray-400 mt-1">PDF only</p>
      )}
    </div>
  );
}

export default function UploadForm({ onSubmit, onHistory }) {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resume || !jd.trim()) return;
    onSubmit(resume, jd.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-gray-900">Resume Matcher</span>
          <button
            onClick={onHistory}
            className="text-sm px-4 py-1.5 rounded-lg text-indigo-600 font-medium hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center p-4 pt-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Matcher</h1>
          <p className="text-gray-500 mt-1 text-sm">Upload a resume and paste a job description to get an AI-powered match analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FileInput
            label="Upload Resume (PDF)"
            file={resume}
            onChange={(e) => setResume(e.target.files[0])}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description</label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={7}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!resume || !jd.trim()}
            className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Analyze Match
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
