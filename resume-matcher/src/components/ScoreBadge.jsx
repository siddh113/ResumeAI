export default function ScoreBadge({ score }) {
  const color =
    score >= 70
      ? { ring: '#22c55e', text: 'text-green-600', label: 'Strong Match' }
      : score >= 41
      ? { ring: '#f59e0b', text: 'text-amber-500', label: 'Partial Match' }
      : { ring: '#ef4444', text: 'text-red-500', label: 'Weak Match' };

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color.ring} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color.text}`}>{score}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${color.text}`}>{color.label}</span>
    </div>
  );
}
