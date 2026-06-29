import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAtsReport } from '../api/ats'
import ScoreRing from '../components/ScoreRing'
import AtsScoreConstellation from '../components/AtsScoreConstellation'
import AtsScorecard from '../components/AtsScorecard'
import RevealOnScroll from '../components/RevealOnScroll'

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

      <div className="ats-hero">
        <p className="ats-hero-eyebrow">ATS Compatibility Report</p>
        <h1 className="ats-hero-title">How your resume scores</h1>

        <div className="ats-hero-ring-wrap">
          <ScoreRing label="ATS Score" score={scores.atsScore} size={220} />
        </div>

        <p className="roadmap-pull-quote">{feedback.recruiterPerspective}</p>
      </div>

      <h3 className="roadmap-section-heading">Score Breakdown</h3>
      <AtsScoreConstellation scores={scores} />

      <h3 className="roadmap-section-heading">Structure & Keywords</h3>
      <AtsScorecard sections={sections} matchedKeywords={matchedKeywords} missingKeywords={missingKeywords} />

      <h3 className="roadmap-section-heading">Strengths</h3>
      <RevealOnScroll className="feedback-section">
        <ul className="feedback-list">
          {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </RevealOnScroll>

      <h3 className="roadmap-section-heading">Weaknesses</h3>
      <RevealOnScroll className="feedback-section">
        <ul className="feedback-list">
          {feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </RevealOnScroll>

      <h3 className="roadmap-section-heading">ATS Perspective</h3>
      <RevealOnScroll className="perspective-card">
        <p>{feedback.atsPerspective}</p>
      </RevealOnScroll>

      <h3 className="roadmap-section-heading">Suggestions</h3>
      <RevealOnScroll className="feedback-section">
        <ul className="feedback-list">
          {feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </RevealOnScroll>
    </div>
  )
}

export default AtsReport