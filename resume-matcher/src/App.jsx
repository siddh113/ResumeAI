import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import WelcomePage from './components/WelcomePage';
import UploadForm from './components/UploadForm';
import ResultsDashboard from './components/ResultsDashboard';
import HistoryPage from './components/HistoryPage';

const API_URL = '/api/analyze';

export default function App() {
  const [view, setView] = useState('welcome'); // welcome | upload | loading | results | error | history
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

  if (view === 'welcome') {
    return (
      <WelcomePage
        onGetStarted={() => setView('upload')}
        onHistory={() => setView('history')}
      />
    );
  }

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col items-center justify-center gap-5">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg">Analyzing your resume...</p>
          <p className="text-slate-400 text-sm mt-1">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 flex flex-col items-center justify-center gap-4 p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Analysis Failed</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => setView('upload')}
            className="py-2.5 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
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

  return <UploadForm onSubmit={handleSubmit} onHistory={() => setView('history')} onBack={() => setView('welcome')} />;
}
