function RequirementItem({ text, matched }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${matched ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
        {matched ? (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </span>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}

export default function RequirementsList({ matched = [], missing = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          Matched Requirements ({matched.length})
        </h3>
        {matched.length === 0 ? (
          <p className="text-sm text-gray-400">None found</p>
        ) : (
          <ul className="space-y-2">
            {matched.map((r, i) => <RequirementItem key={i} text={r} matched={true} />)}
          </ul>
        )}
      </div>
      <div className="bg-red-50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
          Missing Requirements ({missing.length})
        </h3>
        {missing.length === 0 ? (
          <p className="text-sm text-gray-400">None found</p>
        ) : (
          <ul className="space-y-2">
            {missing.map((r, i) => <RequirementItem key={i} text={r} matched={false} />)}
          </ul>
        )}
      </div>
    </div>
  );
}
