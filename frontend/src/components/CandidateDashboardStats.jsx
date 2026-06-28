import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyResumes } from '../api/resumes'
import { getMyInterviews } from '../api/interviews'

function CandidateDashboardStats() {
  const [resumeCount, setResumeCount] = useState(null)
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      setError('')
      try {
        const [resumesRes, interviewsRes] = await Promise.all([
          getMyResumes(),
          getMyInterviews(),
        ])
        setResumeCount((resumesRes.data.resumes || []).length)
        setInterviews(interviewsRes.data.interviews || [])
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

  const evaluated = interviews.filter(
    (i) => i.status === 'evaluated' && typeof i.overallScore === 'number'
  )
  const averageScore = evaluated.length
    ? Math.round(evaluated.reduce((sum, i) => sum + i.overallScore, 0) / evaluated.length)
    : null
  const recentInterviews = interviews.slice(0, 5)

  return (
    <div style={{ marginTop: 'var(--space-6)' }}>
      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Resumes Uploaded</p>
          <p className="stat-value">{resumeCount ?? '—'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Interviews Taken</p>
          <p className="stat-value">{interviews.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Average Score</p>
          <p className="stat-value">{averageScore !== null ? averageScore : '—'}</p>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/resumes">Go to My Resumes →</Link>
      </div>

      {recentInterviews.length > 0 ? (
        <div className="top-candidates-card">
          <p className="distribution-title">Recent Interviews</p>
          {recentInterviews.map((interview) => (
            <Link
              key={interview._id}
              to={`/interview/${interview._id}`}
              className="top-candidate-row"
              style={{ textDecoration: 'none' }}
            >
              <span className={`status-badge status-${interview.status}`}>
                {interview.status.replace('_', ' ')}
              </span>
              <span
                className="candidate-name"
                style={{ flex: 1, color: 'var(--color-text-primary)' }}
              >
                Interview
              </span>
              {interview.status === 'evaluated' && (
                <span className="qa-score-badge">{interview.overallScore}</span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          No interviews yet — upload a resume and generate questions to get started.
        </p>
      )}
    </div>
  )
}

export default CandidateDashboardStats