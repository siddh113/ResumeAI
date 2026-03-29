import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import UploadForm from './components/UploadForm';
import ResultsDashboard from './components/ResultsDashboard';
import HistoryPage from './components/HistoryPage';

const API_URL = '/api/analyze';

export default function App() {
  const [view, setView] = useState('upload'); // upload | loading | results | error | history
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Load history from Supabase on mount
  useEffect(() => {
    supabase
      .from('history')
      .select('*')
      .order('analyzed_at', { ascending: false })
      .then(({ data: rows }) => {
        if (rows) setHistory(rows.map(r => ({ ...r.data, id: r.id, analyzedAt: r.analyzed_at })));
      });
  }, []);

  const handleSubmit = async (resumeFile, jdText) => {
    setView('loading');
    setError('');
    try {
      const formData = new FormData();
      formData.append('pdf', resumeFile);
      formData.append('jd', jdText);

      const res = await fetch(API_URL, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();

      const entry = { ...json, id: Date.now(), analyzedAt: new Date().toISOString() };

      // Save to Supabase
      await supabase.from('history').insert({ id: entry.id, analyzed_at: entry.analyzedAt, data: entry });

      setHistory(prev => [entry, ...prev]);
      setData(json);
      setView('results');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setView('error');
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('history').delete().eq('id', id);
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  const handleClear = async () => {
    await supabase.from('history').delete().gte('id', 0);
    setHistory([]);
  };

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Analyzing your resume...</p>
        <p className="text-sm text-gray-400">This may take a few seconds</p>
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Analysis Failed</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => setView('upload')}
            className="py-2.5 px-6 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (view === 'results') {
    return (
      <ResultsDashboard
        data={data}
        onReset={() => { setView('upload'); setData(null); }}
        onHistory={() => setView('history')}
      />
    );
  }

  if (view === 'history') {
    return (
      <HistoryPage
        history={history}
        onDelete={handleDelete}
        onClear={handleClear}
        onAnalyze={() => setView('upload')}
      />
    );
  }

  return <UploadForm onSubmit={handleSubmit} onHistory={() => setView('history')} />;
}
