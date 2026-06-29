import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCandidates, getRankings } from '../api/hr'

function extractScore(item) {
  const score = item.overallScore ?? item.score ?? item.candidate?.overallScore
  return typeof score === 'number' ? score : null
}

function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError('')
    try {
      const [candidatesRes, rankingsRes] = await Promise.all([getCandidates(), getRankings()])
      setCandidates(candidatesRes.data.candidates || [])
      setRankings(rankingsRes.data.rankings || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load candidates.')
    } finally {
      setLoading(false)
    }
  }

  const scores = rankings.map(extractScore).filter((s) => s !== null)
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
    : null

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Candidates</h2>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>

      {!loading && !error && candidates.length > 0 && (
        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-label">Total Candidates</p>
            <p className="stat-value">{candidates.length}</p>
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
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : candidates.length === 0 ? (
        <p className="empty-state">No candidates yet.</p>
      ) : (
        <div className="candidate-list">
          {candidates.map((candidate) => (
            <Link key={candidate._id} to={`/candidates/${candidate._id}`} className="candidate-row">
              <div>
                <p className="candidate-name">{candidate.name || 'Unnamed Candidate'}</p>
                <p className="candidate-email">{candidate.email}</p>
              </div>
              <span style={{ color: 'var(--color-accent)' }}>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Candidates