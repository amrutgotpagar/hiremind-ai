import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCandidates, getRankings } from '../api/hr'

function extractScore(item) {
  const score = item.overallScore ?? item.score ?? item.candidate?.overallScore
  return typeof score === 'number' ? score : null
}

function extractName(item) {
  return item.name || item.candidate?.name || item.user?.name || 'Unnamed Candidate'
}

function bucketScores(scores) {
  const buckets = [
    { label: '90–100', min: 90, max: 100, count: 0 },
    { label: '70–89', min: 70, max: 89, count: 0 },
    { label: '50–69', min: 50, max: 69, count: 0 },
    { label: 'Below 50', min: 0, max: 49, count: 0 },
  ]
  scores.forEach((score) => {
    const bucket = buckets.find((b) => score >= b.min && score <= b.max)
    if (bucket) bucket.count += 1
  })
  return buckets
}

function HRDashboardStats() {
  const [candidateCount, setCandidateCount] = useState(null)
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      setError('')
      try {
        // Fetched in parallel since neither call depends on the other
        const [candidatesRes, rankingsRes] = await Promise.all([
          getCandidates(),
          getRankings(),
        ])
        setCandidateCount((candidatesRes.data.candidates || []).length)
        setRankings(rankingsRes.data.rankings || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <p style={{ marginTop: 'var(--space-5)' }}>Loading stats...</p>
  }

  if (error) {
    return (
      <p className="form-error" style={{ marginTop: 'var(--space-5)' }}>
        {error}
      </p>
    )
  }

  const scores = rankings.map(extractScore).filter((s) => s !== null)
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
    : null
  const buckets = bucketScores(scores)
  const topCandidates = rankings.slice(0, 5)

  return (
    <div style={{ marginTop: 'var(--space-6)' }}>
      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Total Candidates</p>
          <p className="stat-value">{candidateCount ?? '—'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Evaluated Interviews</p>
          <p className="stat-value">{rankings.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Average Score</p>
          <p className="stat-value">{averageScore !== null ? averageScore : '—'}</p>
        </div>
      </div>

      {scores.length > 0 && (
        <div className="distribution-card">
          <p className="distribution-title">Score Distribution</p>
          {buckets.map((bucket) => (
            <div key={bucket.label} className="distribution-row">
              <span className="distribution-label">{bucket.label}</span>
              <div className="distribution-bar-track">
                <div
                  className="distribution-bar-fill"
                  style={{ width: `${(bucket.count / scores.length) * 100}%` }}
                />
              </div>
              <span className="distribution-count">{bucket.count}</span>
            </div>
          ))}
        </div>
      )}

      {topCandidates.length > 0 && (
        <div className="top-candidates-card">
          <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
            <p className="distribution-title">Top Candidates</p>
            <Link to="/rankings">View All →</Link>
          </div>
          {topCandidates.map((item, i) => (
            <div key={i} className="top-candidate-row">
              <span className="rank-position" style={{ fontSize: '1rem' }}>
                #{i + 1}
              </span>
              <span className="candidate-name" style={{ flex: 1 }}>
                {extractName(item)}
              </span>
              <span className="qa-score-badge">{extractScore(item) ?? '—'}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-5)', marginTop: 'var(--space-6)' }}>
        <Link to="/candidates">View All Candidates →</Link>
        <Link to="/rankings">View Full Rankings →</Link>
      </div>
    </div>
  )
}

export default HRDashboardStats