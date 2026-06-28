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

  const allAnswered = interview.qaPairs?.every(
    (qa) => (answers[qa._id] || '').trim().length > 0
  )

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