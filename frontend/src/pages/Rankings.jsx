import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRankings } from '../api/hr'

function getRankingFields(item) {
  const name = item.name || item.candidate?.name || item.user?.name || 'Unnamed Candidate'
  const email = item.email || item.candidate?.email || item.user?.email || ''
  const score = item.overallScore ?? item.score ?? item.candidate?.overallScore ?? '—'
  const candidateId = item.candidateId || item.candidate?._id || item._id || item.userId
  return { name, email, score, candidateId }
}

function Rankings() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRankings()
  }, [])

  async function fetchRankings() {
    setLoading(true)
    setError('')
    try {
      const res = await getRankings()
      setRankings(res.data.rankings || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rankings.')
    } finally {
      setLoading(false)
    }
  }

  const numericScores = rankings
    .map((item) => getRankingFields(item).score)
    .filter((s) => typeof s === 'number')
  const averageScore = numericScores.length
    ? Math.round(numericScores.reduce((sum, s) => sum + s, 0) / numericScores.length)
    : null
  const topScore = numericScores.length ? Math.max(...numericScores) : null

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Rankings</h2>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>

      {!loading && !error && rankings.length > 0 && (
        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-label">Ranked Candidates</p>
            <p className="stat-value">{rankings.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Top Score</p>
            <p className="stat-value">{topScore !== null ? topScore : '—'}</p>
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
      ) : rankings.length === 0 ? (
        <p className="empty-state">No evaluated interviews yet.</p>
      ) : (
        <div className="rank-list">
          {rankings.map((item, i) => {
            const { name, email, score, candidateId } = getRankingFields(item)
            const RowTag = candidateId ? Link : 'div'
            const rowProps = candidateId ? { to: `/candidates/${candidateId}` } : {}

            return (
              <RowTag
                key={candidateId || i}
                className={`rank-row ${i === 0 ? 'rank-row-top' : ''}`}
                {...rowProps}
              >
                <div className="rank-position">#{i + 1}</div>
                <div className="rank-info">
                  <p className="candidate-name">{name}</p>
                  {email && <p className="candidate-email">{email}</p>}
                </div>
                <div className="rank-score-badge">{score}</div>
              </RowTag>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Rankings