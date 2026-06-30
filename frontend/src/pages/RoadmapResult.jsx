import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRoadmap } from '../api/careerRoadmap'
import ScoreRing from '../components/ScoreRing'
import SkillGapList from '../components/SkillGapList'
import RoadmapTimeline from '../components/RoadmapTimeline'

function RoadmapResult() {
  const { id } = useParams()
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRoadmap()
  }, [id])

  async function fetchRoadmap() {
    setLoading(true)
    setError('')
    try {
      const res = await getRoadmap(id)
      setRoadmap(res.data.roadmap)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load roadmap.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading your roadmap...</p>
      </div>
    )
  }

  if (error || !roadmap) {
    return (
      <div className="page-container">
        <p className="form-error">{error || 'Roadmap not found.'}</p>
        <Link to="/career-roadmap">← Back to Career Roadmap</Link>
      </div>
    )
  }

  if (roadmap.status === 'generating') {
    return (
      <div className="page-container">
        <p>Your roadmap is still being generated — check back in a moment.</p>
      </div>
    )
  }

  if (roadmap.status === 'failed') {
    return (
      <div className="page-container">
        <p className="form-error">Generation failed. Please try again.</p>
        <Link to="/career-roadmap">← Back to Career Roadmap</Link>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h2>Career Roadmap</h2>
        <Link to="/career-roadmap">Generate Another</Link>
      </div>

      <div className="roadmap-hero">
        <p className="roadmap-hero-eyebrow">Personalized Roadmap</p>
        <h1 className="roadmap-hero-title">{roadmap.targetRole} at {roadmap.targetCompany}</h1>
        <div className="roadmap-hero-meta">
          <span>Experience: <strong>{roadmap.experienceLevel}</strong></span>
          <span>Study time: <strong>{roadmap.weeklyStudyHours}h/week</strong></span>
          <span>Class of <strong>{roadmap.graduationYear}</strong></span>
        </div>

        <div className="roadmap-hero-ring-wrap">
          <ScoreRing label="Readiness Score" score={roadmap.readinessScore} size={220} />
        </div>

        <p className="roadmap-pull-quote">{roadmap.skillAssessment}</p>
      </div>

      <h3 className="roadmap-section-heading">Skill Gap Analysis</h3>
      <SkillGapList currentSkills={roadmap.currentSkills} missingSkills={roadmap.missingSkills} />

      <h3 className="roadmap-section-heading">Your Roadmap</h3>
      <p className="roadmap-timeline-total">
        Estimated total timeline: <strong>{roadmap.totalTimelineWeeks} weeks</strong>
      </p>
      <RoadmapTimeline phases={roadmap.phases} />

      <h3 className="roadmap-section-heading">Interview Preparation</h3>
      <div className="feedback-section">
        <p>{roadmap.interviewPrepPlan}</p>
      </div>

      <h3 className="roadmap-section-heading">Study Rhythm</h3>
      <div className="feedback-section">
        <h4 style={{ marginBottom: 'var(--space-2)' }}>Daily</h4>
        <p>{roadmap.dailyStudyPlan}</p>
      </div>
      <div className="feedback-section">
        <h4 style={{ marginBottom: 'var(--space-2)' }}>Weekly Goals</h4>
        <ul className="feedback-list">
          {roadmap.weeklyGoals.map((g, i) => <li key={i}>{g}</li>)}
        </ul>
      </div>
      <div className="feedback-section">
        <h4 style={{ marginBottom: 'var(--space-2)' }}>Monthly Milestones</h4>
        <ul className="feedback-list">
          {roadmap.monthlyMilestones.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default RoadmapResult