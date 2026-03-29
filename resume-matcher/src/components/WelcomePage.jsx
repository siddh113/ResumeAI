export default function WelcomePage({ onGetStarted, onHistory }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col overflow-hidden">

      {/* Nav */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-4.5 h-4.5 text-white" style={{width:'18px',height:'18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Resume Matcher</span>
        </div>
        <button
          onClick={onHistory}
          className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </button>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-8 pb-16">

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/25 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span className="text-indigo-300 text-sm font-medium">AI-Powered · Instant · Free</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-[1.05] tracking-tight">
          Land Your<br />
          <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Dream Job
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
          Upload your resume and paste any job description. Our AI gives you an instant match score and tells you exactly what to fix.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onGetStarted}
            className="group px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-base transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            Analyze My Resume
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={onHistory}
            className="px-8 py-3.5 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl text-base font-medium transition-all"
          >
            View History
          </button>
        </div>
      </div>

      {/* Feature cards */}
      <div className="w-full max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              emoji: '🎯',
              title: 'Precise Match Score',
              desc: 'Get a 0–100 score showing exactly how well your resume fits the role.',
            },
            {
              emoji: '⚡',
              title: 'Instant Feedback',
              desc: 'AI analysis in seconds — no waiting, no sign-up required.',
            },
            {
              emoji: '✏️',
              title: 'Smart Suggestions',
              desc: 'Get specific edits to boost your score and beat applicant filters.',
            },
          ].map(f => (
            <div
              key={f.title}
              className="bg-white/5 hover:bg-white/8 border border-white/8 rounded-2xl p-6 backdrop-blur-sm transition-colors"
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="text-white font-semibold mb-1.5">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
