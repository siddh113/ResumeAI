import { useState } from 'react';
import ResultsContent from './ResultsContent';

function scoreColor(score) {
  if (score >= 70) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
  if (score >= 41) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
  return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function HistoryItem({ entry, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const color = scoreColor(entry.match_score);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${expanded ? 'border-indigo-200' : 'border-gray-100'} overflow-hidden transition-all`}>
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Score badge */}
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${color.bg} ${color.border} border flex flex-col items-center justify-center`}>
          <span className={`text-lg font-bold leading-none ${color.text}`}>{entry.match_score}</span>
          <span className={`text-xs ${color.text} opacity-70`}>/100</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{entry.full_name || 'Unknown Candidate'}</p>
          <p className="text-sm text-indigo-600 truncate">{entry.current_title || '—'}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(entry.analyzedAt)}</p>
        </div>

        {/* Matched / Missing counts */}
        <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs text-green-600 font-medium">{entry.matched_requirements?.length ?? 0} matched</span>
          <span className="text-xs text-red-500 font-medium">{entry.missing_requirements?.length ?? 0} missing</span>
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-6 pt-4 bg-gray-50">
          <ResultsContent data={entry} />
          <div className="flex justify-end mt-4">
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
              className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove from history
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage({ history, onClear, onDelete, onAnalyze }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-gray-900">Resume Matcher</span>
          <button
            onClick={onAnalyze}
            className="text-sm px-4 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + New Analysis
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Analysis History</h1>
            <p className="text-sm text-gray-500 mt-0.5">{history.length} {history.length === 1 ? 'analysis' : 'analyses'} saved</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="text-sm text-red-400 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 font-medium">No analyses yet</p>
            <p className="text-sm text-gray-400 mt-1">Your results will appear here after you analyze a resume</p>
            <button
              onClick={onAnalyze}
              className="mt-6 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Analyze a Resume
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map(entry => (
              <HistoryItem key={entry.id} entry={entry} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
