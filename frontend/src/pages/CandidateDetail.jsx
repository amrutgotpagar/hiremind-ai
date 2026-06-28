import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCandidateDetail } from '../api/hr'

function getFileName(filePath) {
  if (!filePath) return 'Resume'
  return filePath.split(/[\\/]/).pop()
}

function CandidateDetail() {
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [resumes, setResumes] = useState([])
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchDetail()
  }, [id])

  async function fetchDetail() {
    setLoading(true)
    setError('')
    try {
      const res = await getCandidateDetail(id)
      setCandidate(res.data.candidate)
      setResumes(res.data.resumes || [])
      setInterviews(res.data.interviews || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load candidate details.')
    } finally {
      setLoading(false)
    }
  }

  function toggleExpand(interviewId) {
    setExpandedId((prev) => (prev === interviewId ? null : interviewId))
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="form-error">{error}</p>
        <Link to="/candidates">Back to Candidates</Link>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>{candidate?.name || 'Candidate'}</h2>
          <p style={{ marginTop: 'var(--space-1)' }}>{candidate?.email}</p>
        </div>
        <Link to="/candidates">Back to Candidates</Link>
      </div>

      <h3 style={{ marginBottom: 'var(--space-3)' }}>Resumes</h3>
      {resumes.length === 0 ? (
        <p className="empty-state">No resumes uploaded.</p>
      ) : (
        <div className="resume-list" style={{ marginBottom: 'var(--space-6)' }}>
          {resumes.map((resume) => (
            <div key={resume._id} className="resume-row">
              <span className="resume-name">{getFileName(resume.filePath)}</span>
              <span className={`status-badge status-${resume.status}`}>{resume.status}</span>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ marginBottom: 'var(--space-3)' }}>Interviews</h3>
      {interviews.length === 0 ? (
        <p className="empty-state">No interviews yet.</p>
      ) : (
        <div className="qa-list">
          {interviews.map((interview, idx) => (
            <div key={interview._id} className="qa-card">
              <div className="qa-card-header">
                <p className="qa-question">Interview #{idx + 1}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span
                    className={`status-badge status-${
                      interview.status === 'evaluated' ? 'parsed' : 'uploaded'
                    }`}
                  >
                    {interview.status}
                  </span>
                  {interview.status === 'evaluated' && interview.overallScore !== undefined && (
                    <span className="qa-score-badge">{interview.overallScore}</span>
                  )}
                </div>
              </div>

              {interview.status === 'evaluated' && (
                <button
                  className="refresh-link"
                  onClick={() => toggleExpand(interview._id)}
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  {expandedId === interview._id ? 'Hide Details' : 'View Details'}
                </button>
              )}

              {expandedId === interview._id && interview.qaPairs && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  {interview.overallFeedback && (
                    <p className="qa-feedback" style={{ marginBottom: 'var(--space-4)' }}>
                      {interview.overallFeedback}
                    </p>
                  )}
                  {interview.qaPairs.map((qa, i) => (
                    <div
                      key={qa._id || i}
                      className="qa-card"
                      style={{ marginBottom: 'var(--space-3)', backgroundColor: 'var(--color-bg-elevated)' }}
                    >
                      <div className="qa-card-header">
                        <p className="qa-question">
                          <span className="qa-number">{i + 1}.</span> {qa.question}
                        </p>
                        {qa.score !== undefined && <span className="qa-score-badge">{qa.score}</span>}
                      </div>
                      <p className="qa-answer-label">Answer</p>
                      <p className="qa-answer">{qa.answer}</p>
                      {qa.feedback && (
                        <>
                          <p className="qa-feedback-label">Feedback</p>
                          <p className="qa-feedback">{qa.feedback}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CandidateDetail