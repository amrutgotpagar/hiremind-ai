function ScoreRing({ label, score, size = 120 }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const safeScore = Math.max(0, Math.min(100, score ?? 0))
  const offset = circumference - (safeScore / 100) * circumference

  return (
    <div className="score-ring-wrapper">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="score-ring-svg">
        <circle
          className="score-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="8"
          fill="none"
        />
        <circle
          className="score-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="50%" className="score-ring-text" textAnchor="middle" dominantBaseline="middle">
          {safeScore}
        </text>
      </svg>
      <p className="score-ring-label">{label}</p>
    </div>
  )
}

export default ScoreRing