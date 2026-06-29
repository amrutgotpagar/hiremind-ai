import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAtsReport } from '../api/ats'
import ScoreRing from '../components/ScoreRing'

const SECTION_LABELS = {
  contact: 'Contact Information',
  summary: 'Summary / Objective',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
}

function AtsReport() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReport()
  }, [id])

  async function fetchReport() {
    setLoading(true)
    setError('')
    try {
      const res = await getAtsReport(id)
      setReport(res.data.report)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading your ATS report...</p>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="page-container">
        <p className="form-error">{error || 'Report not found.'}</p>
        <Link to="/ats">← Back to ATS Checker</Link>
      </div>
    )
  }

  if (report.status === 'analyzing') {
    return (
      <div className="page-container">
        <p>Your resume is still being analyzed — check back in a moment.</p>
      </div>
    )
  }

  if (report.status === 'failed') {
    return (
      <div className="page-container">
        <p className="form-error">This analysis failed. Please try running it again.</p>
        <Link to="/ats">← Back to ATS Checker</Link>
      </div>
    )
  }

  const { scores, sections, matchedKeywords, missingKeywords, feedback } = report

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h2>ATS Report</h2>
        <Link to="/ats">Run Another Check</Link>
      </div>

      <div className="ats-score-grid">
        <ScoreRing label="ATS Score" score={scores.atsScore} />
        <ScoreRing label="Keyword Match" score={scores.keywordMatch} />
        <ScoreRing label="Skills Coverage" score={scores.skillsCoverage} />
        <ScoreRing label="Formatting" score={scores.formatting} />
      </div>

      <div className="ats-sub-scores">
        <div className="sub-score-card">
          <p className="sub-score-value">{scores.resumeStrength}</p>
          <p className="sub-score-label">Resume Strength</p>
        </div>
        <div className="sub-score-card">
          <p className="sub-score-value">{scores.contentQuality}</p>
          <p className="sub-score-label">Content Quality</p>
        </div>
        <div className="sub-score-card">
          <p className="sub-score-value">{scores.experienceRelevance}</p>
          <p className="sub-score-label">Experience Relevance</p>
        </div>
      </div>

      <div className="section-checklist">
        {Object.entries(SECTION_LABELS).map(([key, label]) => (
          <div key={key} className="section-check-item">
            <span className={sections[key] ? 'section-check-icon-present' : 'section-check-icon-missing'}>
              {sections[key] ? '✓' : '✕'}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {(matchedKeywords.length > 0 || missingKeywords.length > 0) && (
        <div className="keyword-columns">
          <div className="keyword-card">
            <p className="keyword-card-title keyword-card-title-matched">Matched Keywords</p>
            <div className="keyword-pills">
              {matchedKeywords.length === 0 ? (
                <p className="empty-state">None matched</p>
              ) : (
                matchedKeywords.map((kw) => (
                  <span key={kw} className="keyword-pill keyword-pill-matched">{kw}</span>
                ))
              )}
            </div>
          </div>
          <div className="keyword-card">
            <p className="keyword-card-title keyword-card-title-missing">Missing Keywords</p>
            <div className="keyword-pills">
              {missingKeywords.length === 0 ? (
                <p className="empty-state">None missing</p>
              ) : (
                missingKeywords.map((kw) => (
                  <span key={kw} className="keyword-pill keyword-pill-missing">{kw}</span>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="feedback-section">
        <h3>Strengths</h3>
        <ul className="feedback-list">
          {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="feedback-section">
        <h3>Weaknesses</h3>
        <ul className="feedback-list">
          {feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </div>

      <div className="feedback-section">
        <h3>Perspectives</h3>
        <div className="perspective-card">
          <p className="perspective-card-label">Recruiter Perspective</p>
          <p>{feedback.recruiterPerspective}</p>
        </div>
        <div className="perspective-card">
          <p className="perspective-card-label">ATS Perspective</p>
          <p>{feedback.atsPerspective}</p>
        </div>
      </div>

      <div className="feedback-section">
        <h3>Suggestions</h3>
        <ul className="feedback-list">
          {feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default AtsReport