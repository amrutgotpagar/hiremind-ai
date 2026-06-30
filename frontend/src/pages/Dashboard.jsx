import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyResumes } from '../api/resumes'
import { getMyInterviews } from '../api/interviews'
import { getMyRoadmaps } from '../api/careerRoadmap'
import DashboardSidebar from '../components/DashboardSidebar'
import IconStatCard from '../components/IconStatCard'
import ReadinessWidget from '../components/ReadinessWidget'
import HRDashboardStats from '../components/HRDashboardStats'

function CandidateDashboard({ user, logout }) {
  const [resumeCount, setResumeCount] = useState(0)
  const [interviews, setInterviews] = useState([])
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setError('')
      try {
        const [resumesRes, interviewsRes, roadmapsRes] = await Promise.all([
          getMyResumes(),
          getMyInterviews(),
          getMyRoadmaps(),
        ])
        setResumeCount((resumesRes.data.resumes || []).length)
        setInterviews(interviewsRes.data.interviews || [])
        setRoadmaps(roadmapsRes.data.roadmaps || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <p>Loading your dashboard...</p>
  if (error) return <p className="form-error">{error}</p>

  const evaluated = interviews.filter(
    (i) => i.status === 'evaluated' && typeof i.overallScore === 'number'
  )
  const averageScore = evaluated.length
    ? Math.round(evaluated.reduce((sum, i) => sum + i.overallScore, 0) / evaluated.length)
    : null
  const recentInterviews = interviews.slice(0, 3)
  const latestRoadmap = roadmaps[0] || null

  return (
    <>
      <div className="dash-topbar">
        <div>
          <h2>
            Welcome back, {user?.name} <span className="dash-welcome-emoji">👋</span>
          </h2>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Let's accelerate your career journey with AI-powered insights.
          </p>
        </div>
        <div className="dash-topbar-right">
          <div className="dash-avatar">
            {user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <button className="dash-logout-btn" onClick={logout}>Log Out</button>
        </div>
      </div>

      <div className="icon-stat-grid">
        <IconStatCard
          icon="▤"
          label="Resumes Uploaded"
          value={resumeCount}
          linkTo="/resumes"
          linkLabel="View All Resumes"
        />
        <IconStatCard
          icon="◐"
          label="Interviews Taken"
          value={interviews.length}
          linkTo="/resumes"
          linkLabel="View History"
          accentClass="icon-stat-icon-purple"
        />
        <IconStatCard
          icon="★"
          label="Average Score"
          value={averageScore !== null ? `${averageScore}%` : '—'}
          linkTo="/resumes"
          linkLabel="Improve Now"
          accentClass="icon-stat-icon-amber"
        />
        <IconStatCard
          icon="↗"
          label="Career Roadmaps"
          value={roadmaps.length}
          linkTo="/career-roadmap"
          linkLabel="View Roadmaps"
          accentClass="icon-stat-icon-green"
        />
      </div>

      <div className="quick-actions-bar">
        <span className="quick-actions-label">Quick Actions</span>
        <Link to="/resumes" className="quick-action-btn quick-action-btn-primary">↑ Upload New Resume</Link>
        <Link to="/ats" className="quick-action-btn">◎ Run ATS Check</Link>
        <Link to="/career-roadmap" className="quick-action-btn">↗ AI Career Roadmap</Link>
      </div>

      <div className="dash-panel-row">
        <ReadinessWidget roadmap={latestRoadmap} />

        <div className="dash-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <p className="dash-panel-title" style={{ marginBottom: 0 }}>Recent Interviews</p>
            <Link to="/resumes" style={{ fontSize: '0.8125rem' }}>View All →</Link>
          </div>
          {recentInterviews.length === 0 ? (
            <p className="empty-state">No interviews yet.</p>
          ) : (
            recentInterviews.map((interview) => (
              <Link
                key={interview._id}
                to={`/interview/${interview._id}`}
                className="top-candidate-row"
                style={{ textDecoration: 'none' }}
              >
                <span className={`status-badge status-${interview.status}`}>
                  {interview.status.replace('_', ' ')}
                </span>
                <span className="candidate-name" style={{ flex: 1, color: 'var(--color-text-primary)' }}>
                  Interview
                </span>
                {interview.status === 'evaluated' && (
                  <span className="qa-score-badge">{interview.overallScore}</span>
                )}
              </Link>
            ))
          )}
        </div>

        <div className="dash-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <p className="dash-panel-title" style={{ marginBottom: 0 }}>AI Career Roadmap</p>
            <Link to="/career-roadmap" style={{ fontSize: '0.8125rem' }}>View All →</Link>
          </div>
          {!latestRoadmap ? (
            <p className="empty-state">No roadmap generated yet.</p>
          ) : (
            <>
              <p style={{ marginBottom: 'var(--space-3)' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>{latestRoadmap.targetRole}</strong> at{' '}
                <strong style={{ color: 'var(--color-text-primary)' }}>{latestRoadmap.targetCompany}</strong>
              </p>
              {latestRoadmap.phases.slice(0, 4).map((phase) => (
                <div key={phase._id} className="dash-phase-row">
                  <span className="dash-phase-number">{phase.phaseNumber}</span>
                  <span className="dash-phase-title">{phase.title}</span>
                  <span className="dash-phase-weeks">{phase.estimatedWeeks}w</span>
                </div>
              ))}
              <Link to={`/career-roadmap/${latestRoadmap._id}`} className="dash-panel-cta">
                Continue Roadmap →
              </Link>
            </>
          )}
        </div>
      </div>

      <p className="dash-panel-title" style={{ marginBottom: 'var(--space-4)' }}>AI Insights For You</p>
      <div className="insights-row">
        <div className="insight-card">
          <div className="insight-card-icon insight-card-icon-ats">◎</div>
          <h4>Improve Your ATS Score</h4>
          <p>Your resume can be optimized further. Run an ATS check now.</p>
          <Link to="/ats" className="dash-panel-cta">Run Now →</Link>
        </div>
        <div className="insight-card">
          <div className="insight-card-icon insight-card-icon-roadmap">↗</div>
          <h4>Plan Your Career Path</h4>
          <p>Generate a personalized roadmap toward your target company.</p>
          <Link to="/career-roadmap" className="dash-panel-cta">Start Now →</Link>
        </div>
        <div className="insight-card">
          <span className="insight-card-soon-badge">Soon</span>
          <div className="insight-card-icon insight-card-icon-soon">◐</div>
          <h4>Mock Interviews</h4>
          <p>Live, voice-based mock interviews are coming to HireMind AI.</p>
        </div>
        <div className="insight-card">
          <span className="insight-card-soon-badge">Soon</span>
          <div className="insight-card-icon insight-card-icon-soon">⬡</div>
          <h4>Job Match</h4>
          <p>AI-matched job listings based on your resume and skills.</p>
        </div>
      </div>
    </>
  )
}

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="dash-layout">
      <DashboardSidebar role={user?.role} />
      <main className="dash-main">
        {user?.role === 'candidate' && <CandidateDashboard user={user} logout={logout} />}
        {user?.role === 'hr' && (
          <>
            <div className="dash-topbar">
              <div>
                <h2>Welcome, {user?.name}</h2>
                <p style={{ marginTop: 'var(--space-1)' }}>
                  Overview of candidates, interview performance, and rankings.
                </p>
              </div>
              <button className="dash-logout-btn" onClick={logout}>Log Out</button>
            </div>
            <HRDashboardStats />
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard