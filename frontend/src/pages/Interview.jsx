import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getInterview, submitAnswers, evaluateInterview } from '../api/interviews'

function Interview() {
  const { id } = useParams()
  const [interview, setInterview] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function fetchInterview() {
    setLoading(true)
    setError('')
    try {
      const res = await getInterview(id)
      setInterview(res.data.interview)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load interview.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterview()
  }, [id])

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  async function handleSubmitAndEvaluate() {
    if (!interview) return
    const answerPayload = interview.qaPairs.map((qa) => ({
      questionId: qa._id,
      answer: answers[qa._id] || '',
    }))

    setSubmitting(true)
    setError('')
    try {
      await submitAnswers(interview._id, answerPayload)
      const evalRes = await evaluateInterview(interview._id)
      setInterview(evalRes.data.interview)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answers. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGetFeedback() {
    setSubmitting(true)
    setError('')
    try {
      const res = await evaluateInterview(interview._id)
      setInterview(res.data.interview)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate feedback.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading interview...</p>
      </div>
    )
  }

  if (error && !interview) {
    return (
      <div className="page-container">
        <p className="form-error">{error}</p>
        <Link to="/resumes">Back to Resumes</Link>
      </div>
    )
  }

  if (!interview) return null

  const totalQuestions = interview.qaPairs?.length || 0
  const answeredCount = interview.qaPairs
    ? interview.qaPairs.filter((qa) => (answers[qa._id] || '').trim().length > 0).length
    : 0
  const answeredPercent = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0

  const numericScores = interview.qaPairs
    ? interview.qaPairs.map((qa) => qa.score).filter((s) => typeof s === 'number')
    : []
  const highestScore = numericScores.length ? Math.max(...numericScores) : null
  const lowestScore = numericScores.length ? Math.min(...numericScores) : null

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Interview Practice</h2>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>

      {interview.status === 'pending_answers' && (
        <div>
          <p className="interview-subtitle">
            Answer each question below, then submit for AI feedback.
          </p>

          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-2)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                {answeredCount} of {totalQuestions} answered
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                {answeredPercent}%
              </span>
            </div>
            <div className="distribution-bar-track">
              <div className="distribution-bar-fill" style={{ width: `${answeredPercent}%` }} />
            </div>
          </div>

          <div className="qa-list">
            {interview.qaPairs.map((qa, i) => (
              <div key={qa._id} className="qa-card">
                <p className="qa-question">
                  <span className="qa-number">{i + 1}.</span> {qa.question}
                </p>
                <textarea
                  className="qa-textarea"
                  rows={4}
                  placeholder="Type your answer here..."
                  value={answers[qa._id] || ''}
                  onChange={(e) => handleAnswerChange(qa._id, e.target.value)}
                />
              </div>
            ))}
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            className="form-submit"
            onClick={handleSubmitAndEvaluate}
            disabled={submitting || !allAnswered}
          >
            {submitting ? 'Evaluating your answers...' : 'Submit & Get Feedback'}
          </button>
          {!allAnswered && !submitting && (
            <p className="qa-hint">Answer all questions to enable submission.</p>
          )}
        </div>
      )}

      {interview.status === 'submitted' && (
        <div>
          <p>Your answers were submitted.</p>
          <button className="form-submit" onClick={handleGetFeedback} disabled={submitting}>
            {submitting ? 'Evaluating...' : 'Get Feedback'}
          </button>
          {error && <p className="form-error">{error}</p>}
        </div>
      )}

      {interview.status === 'evaluated' && (
        <div>
          <div className="overall-score-card">
            <p className="overall-score-label">Overall Score</p>
            <p className="overall-score-value">{interview.overallScore}</p>
            {interview.overallFeedback && (
              <p className="overall-feedback">{interview.overallFeedback}</p>
            )}
          </div>

          {numericScores.length > 0 && (
            <div className="stat-grid">
              <div className="stat-card">
                <p className="stat-label">Questions Answered</p>
                <p className="stat-value">{totalQuestions}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Highest Score</p>
                <p className="stat-value">{highestScore}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Lowest Score</p>
                <p className="stat-value">{lowestScore}</p>
              </div>
            </div>
          )}

          <div className="qa-list">
            {interview.qaPairs.map((qa, i) => (
              <div key={qa._id} className="qa-card qa-card-evaluated">
                <div className="qa-card-header">
                  <p className="qa-question">
                    <span className="qa-number">{i + 1}.</span> {qa.question}
                  </p>
                  {qa.score !== undefined && <span className="qa-score-badge">{qa.score}</span>}
                </div>
                <p className="qa-answer-label">Your answer</p>
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

          <Link to="/resumes" style={{ display: 'inline-block', marginTop: 'var(--space-5)' }}>
            ← Back to Resumes
          </Link>
        </div>
      )}
    </div>
  )
}

export default Interview