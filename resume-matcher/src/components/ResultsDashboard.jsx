import ResultsContent from './ResultsContent';

export default function ResultsDashboard({ data, onReset, onHistory }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-gray-900">Resume Matcher</span>
          <div className="flex gap-2">
            <button
              onClick={onReset}
              className="text-sm px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Analyze Another
            </button>
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
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 pb-12">
        <ResultsContent data={data} />
      </div>
    </div>
  );
}
